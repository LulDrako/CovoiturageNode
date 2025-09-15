# KovoitGo

**Statut** : 🛠️ En cours de développement mais déjà fonctionnel

## Description

**KovoitGO** est une plateforme de covoiturage conçue pour connecter facilement conducteurs et passagers. L'objectif est de proposer une solution simple, rapide et éco-responsable pour organiser des trajets ensemble.

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

- [ ] Intégration de Stripe pour les paiements
- [ ] Dashboard de gestion personnel
- [ ] Filtres avancés (prix, horaires, nombre de places)
- [ ] Système d’évaluations

## Contributions

Tu veux contribuer ? Fais-toi plaisir 🙌  
Fork le repo, crée ta branche, puis propose une pull request !

---

**Made by [LulDrako](https://github.com/LulDrako)**
