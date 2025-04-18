import axios from 'axios';
import { ConsulService } from './consulService.js';

const consulService = new ConsulService('commande', 8082);
consulService.register();

export class CatalogueService {
  constructor() {
    this.client = axios.create({
      timeout: 5000
    });
  }

  async getProduct(id) {
    try {
      const catalogueUrl = await consulService.getServiceUrl('catalogue');
      if (!catalogueUrl) {
        throw new Error('Service catalogue non disponible');
      }
      const response = await this.client.get(`${catalogueUrl}/products/${id}`);
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