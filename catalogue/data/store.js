const products = new Map();
let currentId = 1;

export const getNextId = () => currentId++;
export { products };
