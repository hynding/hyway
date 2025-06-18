import { Registry } from "./registry.js"
import { iterate } from "./directives/iterate.js"
import { renderer } from "../renderers/DOMRenderer.js"

export type componentConfig = {
    name: string;
    shadow?: boolean;
    template?: string;
    props?: Record<string, any>;
    data?: Record<string, any>;
    computed?: Record<string, any>;
    methods?: Record<string, Function>;
    mounted?: () => void;
    events?: Record<string, Function>;
    [key: string]: any;
}
export const component = (config: componentConfig) => {
    // TODO: Abstract this so there is no DOM dependency
    const template = config.template
        ? new DOMParser()
            .parseFromString(`<template>${config.template}</template>`, "text/html")
            .querySelector("template")
        : Registry.lookup(config.name);

    class CustomElement extends HTMLElement {
        template!: HTMLTemplateElement;
        root!: HTMLElement | DocumentFragment;
        name = config.name;
        data = {
            ...config.props || {},
            ...config.data || {},
            ...config.computed || {},
            ...config.methods || {},
        }
        props = config.props || {};
        computed = config.computed || {};
        methods = config.methods || {};
        mounted = config.mounted?.bind(this.data) ?? (() => {});
        events: [Element, string, Function][] = [];
        conditionals: Array<{ el: Element, data: any, parent: ParentNode, index: number }> = [];
        displays: Array<{ el: HTMLElement, data: any }> = [];
        iterations: Array<{ content: Element, id: string, data: string, children: Node[] }> = [];
        dataIterator = iterate(
            renderer,
            ({ content, id, data, children }: any) => { 
                this.iterations.push({ content, id, data, children }) 
            }
        )
        state: Record<string, any> = {};

        static observedAttributes = Object.keys(config.props || {})

        constructor() {
            super();
            this.root = config.shadow ? this.attachShadow({ mode: "open" }) : this;
            this.template = template;
            this.root.appendChild(this.template.content.cloneNode(true));
        }

        connectedCallback() {
            const callbacks: any[] = []
            // TODO: This should be used for adding event listeners, setting up state changes and calling mounted
            console.log("CustomElement connected", config);
            (async () => {
                await this.mounted();

                // HANDLE DATA/CONFIG
                Object.entries(this.data).forEach(([key, value]) => {
                    const renderBindings = (v: any, k = key) => {
                        
                        this.root.querySelectorAll(`[data-bind="${k}"]`).forEach((el) => {
                            if (typeof v === "function") {
                                el.innerHTML = v.bind(this.state)();
                            } else if (Array.isArray(v)) {
                                el.innerHTML = v.join(", ");
                            } else if (typeof v === "object") {
                                el.innerHTML = JSON.stringify(v);
                            } else {
                                el.innerHTML = v;
                            }
                        });
                    }
                    // to run at the end after all bindings are set
                    callbacks.push(() => renderBindings(value));
                    Object.defineProperty(this.state, key, {
                        // value,
                        get: () => {
                            // console.log("get!", key, this.data[key]);
                            // renderBindings(this.data[key])
                            //Object.keys(this.computed).forEach((key) => { this.state[key]() })
                            return this.data[key];
                        },
                        set: (v) => {
                            console.log("set!", key, v);
                            this.data[key] = v;
                            renderBindings(v);
                            Object.keys(this.computed).forEach((key) => {
                                renderBindings(this.state[key](), key) 
                            })
                            this.renderIterations(this.iterations.filter(({ data }) => data === key));
                            this.renderConditionals(this.conditionals.filter(({ data }) => data === key));
                            this.renderDisplays(this.displays.filter(({ data }) => data === key));
                        },
                        configurable: true,
                        // writable: true,
                    })
                })
                /*
                // cleanup the above by implementing this...
                this.root.querySelectorAll("[data-placeholder], [data-bind]").forEach(this.dataBind);

                this.root.querySelectorAll("[data-value]").forEach((el) => {})


                */
                this.root.querySelectorAll("[data-when]").forEach((el) => {
                    const data = el.getAttribute("data-when");
                    const parent = el.parentNode!;
                    const index = [...parent.children].indexOf(el);
                    this.conditionals.push({ el, data, parent, index });
                })

                this.root.querySelectorAll<HTMLElement>("[data-show]").forEach((el) => {
                    const data = el.getAttribute("data-show");
                    this.displays.push({ el, data });
                })

                this.root.querySelectorAll("[data-value]").forEach((el) => {
                    const key = el.getAttribute("data-value")!;
                    if (this.state[key] && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) {
                        el.value = this.state[key];
                    }
                    const event = (e: any) => {
                        this.state[key] = e.target.value;
                    }
                    el.addEventListener("input", event);
                    this.events.push([el, "input", event]);
                })
                this.root.querySelectorAll("[data-click]").forEach((el) => {
                    const key = el.getAttribute("data-click")!;
                    if (this.state[key]) {
                        const event = (e: any) => {
                            this.state[key].bind(this.state)(e);
                        }
                        el.addEventListener("click", event);
                        this.events.push([el, "click", event]);
                    }
                })


                this.root.querySelectorAll("[data-for-each]").forEach(this.dataIterator);

                callbacks.forEach((callback) => {
                    callback();
                })

                this.renderIterations()
                this.renderConditionals()
                this.renderDisplays()
            })();
        }

        disconnectedCallback() {
            console.log("CustomElement disconnected");
            this.events.forEach(([el, event, handler]) => {
                el.removeEventListener(event as any , handler as any);
            });
            this.events = [];
        }

        attributeChangedCallback(name: any, oldValue: any, newValue: any) {
          console.log(
            `Attribute ${name} has changed from ${oldValue} to ${newValue}.`,
          );
        }

        // TODO: This should be updated to recognize state changes
        renderIterations(filteredIterations = this.iterations) {
            console.log("render iterations", filteredIterations);
            filteredIterations.forEach(({ content: el, id, data, children: childNodes }) => {
                const items = this.state[data];
                if (Array.isArray(items)) {
                    el.innerHTML = "";
                    items.forEach((item) => {
                        childNodes.forEach((child) => {
                            if (child.nodeType === Node.ELEMENT_NODE && child instanceof Element) {
                                const cloneChild = child.cloneNode(true) as Element;
                                if (child.hasAttribute("data-bind")) {
                                    const key = child.getAttribute("data-bind")!;
                                    const [bindId, bindKey] = key.split(".");
                                    if (bindId === id) {
                                        cloneChild.innerHTML = item[bindKey];
                                    }
                                    cloneChild.removeAttribute("data-bind");
                                }
                                cloneChild.querySelectorAll(`[data-bind]`).forEach((child) => {
                                    const key = child.getAttribute("data-bind")!;
                                    const [bindId, bindKey] = key.split(".");
                                    console.log("bindId", bindId, "bindKey", bindKey);
                                    if (bindId === id) {
                                        child.innerHTML = item[bindKey];
                                    }
                                    child.removeAttribute("data-bind");
                                });
                                el.appendChild(cloneChild);
                            } else if (child.nodeType === Node.TEXT_NODE && child.textContent) {
                                const textNode = document.createTextNode(child.textContent);
                                el.appendChild(textNode);
                            }
                        });
                    });
                }
            })
        }

        renderConditionals(filteredConditionals = this.conditionals) {
            console.log("render conditionals", filteredConditionals);
            filteredConditionals.forEach(({ el, data: key, parent, index }) => {
                const value = this.state[key];
                if (value) {
                    if (!el.parentNode) {
                        parent.insertBefore(el, parent.children[index]);
                    }
                } else {
                    if (el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                }
            });
        }

        renderDisplays(filteredDisplays = this.displays) {
            console.log("render displays", filteredDisplays);
            filteredDisplays.forEach(({ el, data: key }) => {
                const value = this.state[key];
                if (value) {
                    el.style.display = "block";
                } else {
                    el.style.display = "none";
                }
            });
        }
    }
    const localName = config.template ? config.name : Registry.getLocalName(config.name);
    customElements.define(localName, CustomElement);
}