export const qs = <T>(selector: string) => document.querySelector(selector) as T
export const qsa = (selector: string) => document.querySelectorAll(selector)
export const ce = (elementName: string) => document.createElement(elementName)