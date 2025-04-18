import axios from 'axios';

const CATALOGUE_URL = 'http://catalogue:8081';

export class CatalogueService {
  constructor() {
    this.client = axios.create({
      baseURL: CATALOGUE_URL,
      timeout: 5000
    });
  }

  async getProduct(id) {
    try {
      const response = await this.client.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      throw error;
    }
  }

  async getProducts(ids) {
    return Promise.all(ids.map(id => this.getProduct(id)));
  }
} 