import express from 'express';
import { createOrder, getOrder } from '../controllers/orderController.js';

const router = express.Router();

// POST /orders
router.post('/', createOrder);

// GET /orders/:id
router.get('/:id', getOrder);

export default router;
