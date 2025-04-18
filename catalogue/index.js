import express from 'express';
import productsRoutes from './routes/products.js';
import healthRoutes from './routes/health.js';
import { ConsulService } from './services/consulService.js';

const app = express();

app.use(express.json());

app.use('/products', productsRoutes);
app.use('/health', healthRoutes);

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Catalogue service running on port ${PORT}`);
    const consulService = new ConsulService('catalogue', PORT);
    consulService.register();
});
