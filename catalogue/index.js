import express from 'express';
import productsRoutes from './routes/products.js';

const app = express();

app.use(express.json());

app.use('/products', productsRoutes);

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Service catalogue en écoute sur le port ${PORT}`);
});
