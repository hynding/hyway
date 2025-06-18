export const stringToDocument = (htmlString: string) => {
  if (typeof htmlString !== 'string') {
    throw new Error('Input must be a string');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  if (doc.querySelector('parsererror')) {
    throw new Error('Invalid HTML string');
  }

  return doc;
}