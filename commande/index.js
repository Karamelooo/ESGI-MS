import express from 'express';
import ordersRoutes from './routes/orders.js';
import healthRoutes from './routes/health.js';

const app = express();

app.use(express.json());
app.use('/orders', ordersRoutes);
app.use('/health', healthRoutes);

const PORT = 8082;
app.listen(PORT, () => {
  console.log(`Commande service running on port ${PORT}`);
});
