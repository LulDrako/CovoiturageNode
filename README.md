# KovoitGo

**Statut** : 🛠️ En cours de développement mais déjà fonctionnel

## Description

**EcoCovoit** est une plateforme de covoiturage conçue pour connecter facilement conducteurs et passagers. L'objectif est de proposer une solution simple, rapide et éco-responsable pour organiser des trajets ensemble.

Le projet repose sur :
- **Node.js** pour le backend,
- **EJS** pour le rendu dynamique des pages côté serveur,
- **MongoDB** pour la gestion des données utilisateurs, trajets et véhicules.

## Fonctionnalités principales

✅ Créées et **déjà fonctionnelles** :
- Authentification sécurisée par JWT
- Connexion / inscription avec rôle (conducteur ou passager)
- Création de trajets (conducteur)
- Recherche de trajets (passager)
- Filtres géographiques basés sur Google Maps
- Gestion des voitures liées à chaque conducteur
- Affichage des trajets avec informations complètes (heure, distance, véhicule, etc.)

🚧 **Fonctionnalités à venir** :
- Réservation de trajets côté passager
- Paiement en ligne sécurisé (via Stripe ou autre)
- Notifications email ou en temps réel
- Système de notation / avis entre utilisateurs

## Technologies utilisées

- **Node.js** : Serveur back-end
- **Express** : Framework web
- **EJS** : Templating engine côté serveur
- **MongoDB** : Base de données NoSQL
- **JWT + Cookies** : Authentification sécurisée
- **Google Maps API** : Autocomplétion et itinéraires
- **Axios** : Requêtes HTTP
- **CSS/HTML** : Interface utilisateur
- **Swiper.js** : Slider de voitures

## Screenshots

Voici un aperçu de l'interface :

![Accueil](/images/image-6.png)
![Connexion](/images/image.png)
![Inscription](/images/image-1.png)
![Page conducteur](/images/image-2.png)
![Création de trajet](/images/image-4.png)
![Liste des trajets](/images/image-5.png)
![Page passager](/images/image-7.png)
![Vue détaillée](/images/image-3.png)

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/LulDrako/CovoiturageNode.git
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d’environnement dans un fichier `.env` :
   ```env
   MONGO_URL=your_mongodb_url
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   JWT_SECRET=your_secure_jwt_secret
   ```

4. Lancez l’application :
   ```bash
   node app.js
   ```

## À venir 🔮

- [ ] Réservation de places par les passagers
- [ ] Intégration de Stripe pour les paiements
- [ ] Dashboard de gestion personnel
- [ ] Filtres avancés (prix, horaires, nombre de places)
- [ ] Système d’évaluations

## Contributions

Tu veux contribuer ? Fais-toi plaisir 🙌  
Fork le repo, crée ta branche, puis propose une pull request !

---

**Made by [LulDrako](https://github.com/LulDrako)**