import request from 'supertest';
import express from 'express';
import productsRoutes from '../routes/products.js';
import { products } from '../data/store.js';

const app = express();
app.use(express.json());
app.use('/products', productsRoutes);

describe('Tests des endpoints produits', () => {
  beforeEach(() => {
    products.clear();
  });

  describe('GET /products', () => {
    it('devrait retourner une liste vide au démarrage', async () => {
      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /products', () => {
    it('devrait créer un nouveau produit', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 99.99
      };

      const response = await request(app)
        .post('/products')
        .send(newProduct);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newProduct.name);
      expect(response.body.price).toBe(newProduct.price);
    });

    it('devrait retourner une erreur 400 si les données sont invalides', async () => {
      const invalidProduct = {
        name: 'Test Product',
    };

      const response = await request(app)
        .post('/products')
        .send(invalidProduct);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /products/:id', () => {
    it('devrait retourner un produit existant', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 99.99
      };

      const createResponse = await request(app)
        .post('/products')
        .send(newProduct);

      const productId = createResponse.body.id;

      const response = await request(app).get(`/products/${productId}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(productId);
    });

    it('devrait retourner 404 pour un produit inexistant', async () => {
      const response = await request(app).get('/products/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});
