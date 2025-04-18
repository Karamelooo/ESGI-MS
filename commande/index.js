import express from 'express';
import ordersRoutes from './routes/orders.js';

const app = express();

app.use(express.json());
app.use('/orders', ordersRoutes);

const PORT = 8082;
app.listen(PORT, () => {
  console.log(`Commande service running on port ${PORT}`);
});
