import express from 'express';
import axios from 'axios';
import { ConsulService } from './services/consulService.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const consulService = new ConsulService('gateway', PORT);

const logRequest = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

// Application des middlewares globaux
app.use(logRequest);

// Routes pour le service catalogue
app.get('/api/products', async (req, res) => {
  try {
    const catalogueUrl = await consulService.getServiceUrl('catalogue');
    if (!catalogueUrl) {
      return res.status(503).json({ message: 'Service catalogue non disponible' });
    }
    
    const response = await axios.get(`${catalogueUrl}/products`);
    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const catalogueUrl = await consulService.getServiceUrl('catalogue');
    if (!catalogueUrl) {
      return res.status(503).json({ message: 'Service catalogue non disponible' });
    }
    
    const response = await axios.get(`${catalogueUrl}/products/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const commandeUrl = await consulService.getServiceUrl('commande');
    if (!commandeUrl) {
      return res.status(503).json({ message: 'Service commande non disponible' });
    }
    
    const response = await axios.post(`${commandeUrl}/orders`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

const startServer = async () => {
  try {
    await consulService.register();
    app.listen(PORT, () => {
      console.log(`API Gateway en écoute sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer(); 