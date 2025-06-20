import { qs } from './abbreviations.js'
import { buildElement } from './buildElement.js'

export type ElementFactoryType = {
    clear: () => ElementFactoryType
    add: (...elements: ElementFactoryType[]) => ElementFactoryType
    attr: (name: string, value: string) => ElementFactoryType
    toggleClass: (className: string) => ElementFactoryType
    ev: (eventName: string, callback: (element: ElementFactoryType, event: Event) => void) => ElementFactoryType
    get: () => HTMLElement
}

export const elementFactory = <T>(reference: string | HTMLElement, isNew = true): ElementFactoryType => {
    if (!reference) {
        throw new Error('elementFactory requires a reference to an element')
    }
    const lookup = typeof reference === 'string' ? qs<HTMLElement>(reference) : reference
    if (!isNew && !lookup) {
        throw new Error(`elementFactory could not find element with selector ${reference}`)
    }
    const element = (isNew && lookup) 
        ? lookup.cloneNode(true) as HTMLElement
        : lookup || buildElement(reference as string)
    const factory: ElementFactoryType = {
        clear: () => {
            element.innerHTML = ''
            return factory
        },
        add: (...elements: ElementFactoryType[]) => {
            element.append(...elements.map(elf => elf.get()))
            return factory
        },
        attr: (name: string, value: string | number) => {
          element.setAttribute(name, `${value}`)
          return factory
        },
        toggleClass: (className: string) => {
            element.classList.toggle(className)
            return factory
        },
        ev: (eventName: string, callback: (elf: ElementFactoryType, e: Event) => void) => {
            element.addEventListener(eventName, (event) => {
                callback(factory, event)
            })
            return factory
        },
        get: () => element
    }
    return factory
}
