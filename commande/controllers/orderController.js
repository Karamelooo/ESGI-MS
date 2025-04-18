import Order from '../models/order.js';
import { orders, getNextId } from '../data/store.js';
import { CatalogueService } from '../services/catalogueService.js';

const catalogueService = new CatalogueService();

export const createOrder = async (req, res) => {
  const { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: "Liste d'IDs de produits requise." });
  }

  try {
    const products = await catalogueService.getProducts(productIds);
    const order = new Order(getNextId(), products);
    orders.push(order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des produits." });
  }
};

export const getOrder = (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ error: "Commande introuvable." });
  }

  res.json(order);
};

export const getAllOrders = (req, res) => {
  res.json(orders);
}; 