export default function reduceIntoIndexedObject(key) {
    return (object, item) => ({
        ...object,
        [item[key]]: item
    })
}