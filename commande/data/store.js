const orders = new Map();
let currentId = 1;

export const getNextId = () => currentId++;
export { orders };
