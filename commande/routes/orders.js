import express from 'express';
import { createOrder, getOrder, getAllOrders } from '../controllers/orderController.js';

const router = express.Router();

// POST /orders
router.post('/', createOrder);

// GET /orders/:id
router.get('/:id', getOrder);

router.get('/', getAllOrders);

export default router;
