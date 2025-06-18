import { NodeArray, nodeToArray } from "../utilities/nodeToArray.js";
import { Renderer } from "./Renderer.js";

export class DOMRenderer extends Renderer {

    nodeArray: NodeArray | NodeArray[] = [];
    content: Element;

    static getTemplate(content: string) {
        return new DOMParser()
            .parseFromString(content, "text/html")
            .querySelector("template")
    }
    constructor(content: Element | string) {
        super();
        this.content = typeof content === "string"
            ? DOMRenderer.getTemplate(content) || document.createElement("div")
            : content;
    }

    attribute(name: string) {
        return this.content.getAttribute(name);
    }

    get children() {
        return this.content.childNodes;
    }

    get type() {
        return this.content.nodeType;
    }

    clone() {
        if (this.content.nodeType === Node.ELEMENT_NODE) {
            return this.content.cloneNode(true);
        } else if (this.content.nodeType === Node.TEXT_NODE && this.content.textContent) {
            return document.createTextNode(this.content.textContent);
        }
    }

    virtualize() {
        this.nodeArray = nodeToArray(this.content);
    }
}

export const renderer = (content: Element | string) => new DOMRenderer(content);