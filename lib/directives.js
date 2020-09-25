export const removeChildren = node => node.firstChild && node.removeChild(node.firstChild) ? removeChildren(node) : node
export const wrapup = (element, text, node = 'span', symbol = '^') => {
  removeChildren(element)
  text.split(' ')
    .map(word => word.split(symbol))
    .map(segments => segments.map(segment => document.createTextNode(segment)))
    .map(textNodeSegments => {

    })
}