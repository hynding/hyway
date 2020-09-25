// TODO: TO PLACE
const map_reduce = (array = [], reducer = () => {}) => array.reduce((map, item) => ({ ...map, ...(reducer(item) || {})}), {})
