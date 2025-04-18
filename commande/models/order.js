export default class Order {
  constructor(id, products) {
    this.id = id;
    this.products = products;
    this.createdAt = new Date();
  }
} 