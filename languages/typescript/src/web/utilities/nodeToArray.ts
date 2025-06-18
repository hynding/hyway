import { stringToDocument } from "./stringToDocument.js";
import { toCamelCase } from "../../core/patterns/naming-conventions/toCamelCase.js";

export type NodeArray = [string, Record<string, string>?, ...any[]];
// Create a tree structure similar to React's element structure
export const nodeToArray = (node: Node | Element | Document): NodeArray | NodeArray[] => {
  if (typeof node === "string") {
    const doc = stringToDocument(node);
    if (doc) {
      // Convert the document to an array of nodes
      return Array.from(doc.body.childNodes).map(child => nodeToArray(child) as NodeArray);
    }
  } else if (node instanceof Document && node.body) {
    return nodeToArray(node.body);
  } else if (node instanceof DocumentFragment) {
    // If it's an DocumentFragment, convert it to a tree structure
    return Array.from(node.children).map(child => nodeToArray(child) as NodeArray);

  } else if (node instanceof Node) {
    if (node.textContent && node.nodeType === Node.TEXT_NODE) {
      // If it's a text node, return its text content
      return [node.textContent];
    } else if (node instanceof Element) {
      // If it's a Node, convert it to a tree structure
      return [
        node.tagName,
        Array.from(node.attributes || []).reduce((acc, attr) => {
          const camelCasedName = toCamelCase(attr.name);
          acc[camelCasedName] = attr.value;
          return acc;
        }, {} as Record<string, string>),
        ...Array.from(node.childNodes).map<NodeArray>(child => nodeToArray(child) as NodeArray)
      ];
    }
  }
  return []; // Return null for unsupported types
}