import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../index.js';
import { orders } from '../data/store.js';

jest.mock('../services/catalogueService.js', () => ({
  CatalogueService: jest.fn().mockImplementation(() => ({
    getProducts: async (productIds) => {
      return productIds.map(id => ({
        id,
        name: `Product ${id}`,
        price: 10.99
      }));
    }
  }))
}));

describe('Tests des endpoints commandes', () => {
  beforeEach(() => {
    orders.clear();
  });

  describe('GET /orders', () => {
    it('devrait retourner une liste vide au démarrage', async () => {
      const response = await request(app).get('/orders');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return an array of orders', async () => {
      const response = await request(app)
        .get('/orders')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /orders', () => {
    it('devrait créer une nouvelle commande', async () => {
      const newOrder = {
        productIds: [1, 2, 3]
      };

      const response = await request(app)
        .post('/orders')
        .send(newOrder);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('devrait retourner une erreur 400 si les données sont invalides', async () => {
      const invalidOrder = {
        productIds: []
      };

      const response = await request(app)
        .post('/orders')
        .send(invalidOrder);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /orders/:id', () => {
    it('devrait retourner une commande existante', async () => {
      const newOrder = {
        productIds: [1, 2, 3]
      };

      const createResponse = await request(app)
        .post('/orders')
        .send(newOrder);

      const orderId = createResponse.body.id;

      const response = await request(app).get(`/orders/${orderId}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(orderId);
    });

    it('devrait retourner 404 pour une commande inexistante', async () => {
      const response = await request(app).get('/orders/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});
