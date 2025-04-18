# ESGI-MS - Système de microservices

## Auteurs
- Arthur VALENTIM (@Valentin460)
- Hugo PETIT (@Karamelooo)

## Architecture du projet

Le projet est composé de quatre microservices principaux :

### 1. Service Catalogue (Port 8081)
- Gestion des produits
- Endpoints REST :
  - `GET /products` : Liste tous les produits
  - `GET /products/{id}` : Récupère un produit par son ID
  - `POST /products` : Ajoute un nouveau produit
- Stockage en mémoire des données
- Structure :
  - `models/` : Définition des modèles de données
  - `routes/` : Gestion des routes API
  - `services/` : Logique métier
  - `data/` : Stockage des données en mémoire

### 2. Service Commande (Port 8082)
- Gestion des commandes
- Endpoints REST :
  - `POST /orders` : Crée une nouvelle commande
  - `GET /orders/{id}` : Récupère une commande par son ID
- Communication avec le service catalogue via HTTP
- Structure :
  - `controllers/` : Gestion des requêtes
  - `models/` : Modèles de données
  - `routes/` : Définition des routes
  - `services/` : Logique métier
  - `data/` : Stockage des données en mémoire

### 3. Service Gateway (Port 3000) (Bonus)
- Point d'entrée unique pour l'API
- Gestion du routage vers les services
- Structure :
  - `services/` : Configuration du routage
  - `index.js` : Configuration principale

### 4. Service de Découverte (Port 8500) (Bonus)
- Service Consul pour la découverte des services
- Permet l'enregistrement automatique des microservices
- Facilite la communication entre services
- Structure :
  - `config/` : Configuration Consul
  - `index.js` : Point d'entrée du service

## Technologies utilisées
- Node.js
- Express.js
- Docker
- Docker Compose
- Consul (Service de découverte)
- Jest (bonus)

## Déploiement

### Prérequis
- Docker
- Docker Compose

### Installation
1. Cloner le repository
2. Exécuter `docker-compose up` à la racine du projet

### Configuration
Les services sont configurés pour communiquer entre eux via les ports suivants :
- Gateway : 3000
- Catalogue : 8081
- Commande : 8082
- Service de découverte : 8500

### Fonctionnement du service de découverte
1. Le service de découverte démarre en premier
2. Les autres services s'enregistrent automatiquement auprès d'Eureka
3. Les services peuvent se découvrir mutuellement via le service de découverte
4. Le Gateway utilise le service de découverte pour router les requêtes

## Exemples d'utilisation

### Ajouter un produit
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Produit Test", "price": 19.99}'
```

### Récupérer un produit

```bash
curl http://localhost:3000/api/products/1
```

### Créer une commande
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"productIds": [1, 2, 3]}'
```

### Récupérer une commande
```bash
curl http://localhost:3000/api/orders/1
```

## Structure des données

### Produit
```json
{
  "id": 1,
  "name": "Nom du produit",
  "price": 19.99
}
```

### Commande
```json
{
  "id": 1,
  "products": [
    {
      "id": 1,
      "name": "Produit 1",
      "price": 19.99
    }
  ]
}
```
