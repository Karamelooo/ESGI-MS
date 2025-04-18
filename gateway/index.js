import express from 'express';
import axios from 'axios';
import { ConsulService } from './services/consulService.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const consulService = new ConsulService('gateway', PORT);

const routeToServiceMap = {
  '/api/products': 'catalogue',
  '/api/orders': 'commande'
};

const logRequest = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

app.use(logRequest);

app.use('/api/*', async (req, res) => {
  try {
    const serviceName = Object.entries(routeToServiceMap).find(([route]) => 
      req.originalUrl.startsWith(route)
    )?.[1];

    if (!serviceName) {
      return res.status(404).json({ message: 'Route non trouvée' });
    }

    const serviceUrl = await consulService.getServiceUrl(serviceName);
    
    if (!serviceUrl) {
      return res.status(503).json({ message: `Service ${serviceName} non disponible` });
    }

    const targetUrl = `${serviceUrl}${req.originalUrl.replace('/api', '')}`;
    
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: req.headers
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Erreur lors de la redirection vers ${serviceName}:`, error);
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