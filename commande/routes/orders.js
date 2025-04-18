import express from 'express';
import axios from 'axios';
import Order from '../models/order.js';
import { orders, getNextId } from '../data/store.js';

const router = express.Router();

// POST /orders
router.post('/', async (req, res) => {
  const { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: "Liste d'IDs de produits requise." });
  }

  try {
    const products = [];

    for (const id of productIds) {
      const response = await axios.get(`http://localhost:8081/products/${id}`);
      products.push(response.data);
    }

    const order = new Order(getNextId(), products);
    orders.push(order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des produits." });
  }
});

// GET /orders/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ error: "Commande introuvable." });
  }

  res.json(order);
});

export default router;
