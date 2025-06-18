import { ce } from './abbreviations.js'

export const buildElement = (selector: string): Element => {
    const [tagId, ...classNames] = selector.split('.')
    const [tag, id] = tagId.split('#')
    const element = ce(tag || 'div')
    if (id) {
        element.id = id
    }
    element.className = classNames.join(' ')
    return element
}