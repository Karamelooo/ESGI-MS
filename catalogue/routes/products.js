import express from 'express';
import Product from '../models/product.js';
import { products, getNextId } from '../data/store.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json(Array.from(products.values()));
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.get(id);

    if (!product) {
        return res.status(404).json({ error: "Produit introuvable." });
    }

    res.json(product);
});

router.post('/', (req, res) => {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: "Le nom et le prix sont requis." });
    }

    const id = getNextId();
    const product = new Product(id, name, price);
    products.set(id, product);

    res.status(201).json(product);
});

export default router;
