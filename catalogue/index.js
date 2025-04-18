import express from 'express';
import productsRoutes from './routes/products.js';
import healthRoutes from './routes/health.js';
import { ConsulService } from './services/consulService.js';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
    req.setTimeout(30000);
    res.setTimeout(30000);
    next();
});

app.use('/products', productsRoutes);
app.use('/health', healthRoutes);

app.use((err, req, res, next) => {
    console.error('Erreur globale:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
});

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Catalogue service running on port ${PORT}`);
    const consulService = new ConsulService('catalogue', PORT);
    consulService.register();
});
