import axios from 'axios';

const CONSUL_HOST = process.env.CONSUL_HOST || 'consul';
const CONSUL_PORT = process.env.CONSUL_PORT || 8500;
const CONSUL_URL = `http://${CONSUL_HOST}:${CONSUL_PORT}`;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

export class ConsulService {
  constructor(serviceName, port) {
    this.serviceName = serviceName;
    this.port = port;
    this.client = axios.create({
      baseURL: CONSUL_URL,
      timeout: 30000
    });
  }

  async waitForConsul() {
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        console.log(`Tentative de connexion à Consul (${i + 1}/${MAX_RETRIES})...`);
        console.log(`URL de Consul: ${CONSUL_URL}`);
        
        const response = await this.client.get('/v1/status/leader');
        console.log('Réponse de Consul:', response.status);
        console.log('Consul est prêt');
        return true;
      } catch (error) {
        console.log(`Erreur lors de la tentative ${i + 1}:`, error.message);
        if (i < MAX_RETRIES - 1) {
          console.log(`Attente de ${RETRY_DELAY/1000} secondes avant la prochaine tentative...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }
    throw new Error('Impossible de se connecter à Consul après plusieurs tentatives');
  }

  async register() {
    try {
      await this.waitForConsul();
      
      const serviceData = {
        ID: `${this.serviceName}-${this.port}`,
        Name: this.serviceName,
        Address: this.serviceName,
        Port: parseInt(this.port),
        Check: {
          HTTP: `http://${this.serviceName}:${this.port}/health`,
          Interval: '10s',
          Timeout: '5s',
          DeregisterCriticalServiceAfter: '1m'
        }
      };
      
      console.log('Données d\'enregistrement du service:', JSON.stringify(serviceData, null, 2));
      
      const response = await this.client.put('/v1/agent/service/register', serviceData);
      console.log(`Service ${this.serviceName} enregistré avec succès:`, response.status);
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement du service ${this.serviceName}:`, error.message);
      if (error.response) {
        console.error('Détails de l\'erreur:', error.response.data);
      }
      throw error;
    }
  }

  async getServiceUrl(serviceName) {
    try {
      console.log(`Recherche du service ${serviceName}...`);
      const response = await this.client.get(`/v1/health/service/${serviceName}?passing=true`);
      
      if (response.data && response.data.length > 0) {
        const service = response.data[0].Service;
        const url = `http://${service.Address}:${service.Port}`;
        console.log(`URL du service ${serviceName} trouvée:`, url);
        return url;
      }
      
      console.log(`Aucun service ${serviceName} en état de fonctionnement trouvé`);
      return null;
    } catch (error) {
      console.error(`Erreur lors de la recherche du service ${serviceName}:`, error.message);
      return null;
    }
  }
} 