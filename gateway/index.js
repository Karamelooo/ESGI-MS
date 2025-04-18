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
    console.log('Nouvelle requête reçue:', {
      method: req.method,
      url: req.originalUrl,
      body: req.body
    });

    const serviceName = Object.entries(routeToServiceMap).find(([route]) => 
      req.originalUrl.startsWith(route)
    )?.[1];

    console.log('Service trouvé:', serviceName);

    if (!serviceName) {
      console.log('Aucun service trouvé pour cette route');
      return res.status(404).json({ message: 'Route non trouvée' });
    }

    const serviceUrl = await consulService.getServiceUrl(serviceName);
    console.log('URL du service:', serviceUrl);
    
    if (!serviceUrl) {
      console.log('Service non disponible');
      return res.status(503).json({ message: `Service ${serviceName} non disponible` });
    }

    const targetUrl = `${serviceUrl}${req.originalUrl.replace('/api', '')}`;
    console.log('URL cible:', targetUrl);
    
    console.log('Body de la requête:', req.body);
    
    const axiosConfig = {
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    };

    console.log('Configuration axios:', axiosConfig);
    
    const response = await axios(axiosConfig);

    console.log('Réponse reçue du service:', {
      status: response.status,
      data: response.data
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erreur détaillée:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
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