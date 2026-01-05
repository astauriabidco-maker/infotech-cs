# 🚀 Infotech - Marketplace E-Commerce

Infotech est une plateforme e-commerce moderne inspirée de Back Market, développée avec **Angular 20** et **Spring Boot**. Cette marketplace permet d'acheter et vendre des produits reconditionnés avec une interface utilisateur élégante et performante.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#-stack-technique)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [Structure du Projet](#-structure-du-projet)
- [Design System](#-design-system)
- [API Endpoints](#-api-endpoints)

## ✨ Fonctionnalités

### Frontend (Angular)

#### 🏠 Pages Principales
- **Accueil** : Hero section dynamique, catégories populaires, produits phares, avantages
- **Liste Produits** : Filtres avancés (recherche, catégorie, marque, état, prix), pagination, tri
- **Détail Produit** : Galerie d'images, description, prix, ajout au panier, caractéristiques
- **Panier** : Gestion des quantités, calcul du total, suppression d'articles
- **Favoris** : Liste des produits favoris avec gestion facile
- **Commandes** : Historique et suivi des commandes
- **Profil** : Gestion des informations utilisateur et adresses

#### 🔐 Authentification
- Inscription (utilisateur ou vendeur)
- Connexion avec JWT
- Gestion de session persistante
- Protection des routes

#### 🎨 Interface Utilisateur
- **Design moderne** : Interface épurée et attractive
- **Animations fluides** : Transitions et micro-interactions soignées
- **Responsive** : Adapté mobile, tablette et desktop
- **Performance** : Lazy loading, pagination, optimisations
- **Accessibilité** : Sémantique HTML, ARIA labels

### Backend (Spring Boot)

#### 📦 Entités Principales
- **Users** : Utilisateurs avec système de rôles (USER, SELLER, ADMIN)
- **Products** : Produits avec images, catégories, marques
- **Listings** : Annonces de vente par vendeur avec prix et stock
- **Cart** : Panier d'achats
- **Orders** : Commandes avec items et statuts
- **Reviews** : Avis clients avec notation
- **Favorites** : Produits favoris
- **Categories** : Catégories hiérarchiques
- **Addresses** : Adresses de livraison

#### 🔒 Sécurité
- Authentification JWT
- Rôles et permissions (USER, SELLER, ADMIN)
- Endpoints protégés
- Validation des données

## 🛠 Stack Technique

### Frontend
- **Framework** : Angular 20 (Standalone Components)
- **Language** : TypeScript 5.9
- **Styling** : SCSS avec variables CSS
- **State Management** : Signals (Angular)
- **HTTP Client** : HttpClient avec intercepteurs
- **Routing** : Angular Router avec lazy loading
- **Build** : Angular CLI

### Backend
- **Framework** : Spring Boot 3.x
- **Language** : Java 17+
- **Database** : PostgreSQL
- **ORM** : Hibernate/JPA
- **Security** : Spring Security + JWT
- **API** : REST
- **Documentation** : OpenAPI/Swagger

## 🏗 Architecture

### Frontend Architecture

```
src/
├── app/
│   ├── core/                    # Services, modèles, intercepteurs
│   │   ├── models/              # Interfaces TypeScript
│   │   ├── services/            # Services métier
│   │   └── interceptors/        # HTTP intercepteurs
│   ├── features/                # Pages par fonctionnalité
│   │   ├── home/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── auth/
│   │   ├── favorites/
│   │   ├── orders/
│   │   └── profile/
│   ├── shared/                  # Composants partagés
│   │   ├── header/
│   │   ├── footer/
│   │   └── product-card/
│   ├── app.config.ts           # Configuration Angular
│   ├── app.routes.ts           # Routing
│   └── app.ts                  # Composant racine
├── environments/               # Variables d'environnement
└── styles.scss                # Styles globaux + Design System
```

### Backend Architecture

```
src/main/java/com/n2s/infotech/
├── config/                     # Configuration Spring
├── controller/                 # Contrôleurs REST
├── dto/                       # Data Transfer Objects
├── model/                     # Entités JPA
├── repository/                # Repositories JPA
├── service/                   # Logique métier
├── security/                  # Configuration sécurité
└── specification/             # Spécifications JPA
```

## 📥 Installation

### Prérequis

- **Node.js** 20+ et npm
- **Java** 17+
- **PostgreSQL** 14+
- **Maven** 3.8+

### 1. Backend (Spring Boot)

```bash
# Créer la base de données PostgreSQL
createdb infotech

# Configurer src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/infotech
spring.datasource.username=votre_username
spring.datasource.password=votre_password

# Installer les dépendances et lancer
./mvnw clean install
./mvnw spring-boot:run
```

Le backend sera accessible sur `http://localhost:8080`

### 2. Frontend (Angular)

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm start
```

Le frontend sera accessible sur `http://localhost:4200`

## ⚙️ Configuration

### Variables d'Environnement Frontend

**`src/environments/environment.ts`** (Development)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

**`src/environments/environment.prod.ts`** (Production)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api.com/api'
};
```

### Configuration Backend

**`application.properties`**
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/infotech
spring.datasource.username=emmanuel
spring.datasource.password=

# JWT
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000

# Server
server.port=8080
```

## 🚀 Lancement

### Mode Développement

```bash
# Terminal 1 - Backend
cd /path/to/backend
./mvnw spring-boot:run

# Terminal 2 - Frontend
cd /Users/emmanuel/Documents/dev/github/infotech-cs
npm start
```

Accédez à l'application sur `http://localhost:4200`

### Mode Production

```bash
# Build Frontend
ng build

# Build Backend
./mvnw clean package

# Lancer le JAR
java -jar target/infotech-0.0.1-SNAPSHOT.jar
```

## 📁 Structure du Projet

### Composants Principaux

#### Shared Components
- **HeaderComponent** : Navigation principale avec panier, user menu
- **FooterComponent** : Pied de page avec liens et réseaux sociaux
- **ProductCardComponent** : Carte produit réutilisable avec favoris

#### Feature Components
- **HomeComponent** : Page d'accueil avec hero, catégories, produits phares
- **ProductListComponent** : Liste paginée avec filtres avancés
- **ProductDetailComponent** : Détail produit avec galerie et ajout panier
- **CartComponent** : Gestion complète du panier
- **FavoritesComponent** : Gestion des favoris
- **LoginComponent / RegisterComponent** : Authentification
- **OrderListComponent** : Historique commandes
- **ProfileComponent** : Profil utilisateur

### Services

- **AuthService** : Authentification, gestion JWT, état utilisateur
- **ProductService** : CRUD produits, filtres, recherche
- **CartService** : Gestion panier avec state management (Signals)
- **FavoriteService** : Gestion favoris
- **OrderService** : Gestion commandes
- **CategoryService** : Gestion catégories
- **ReviewService** : Gestion avis

## 🎨 Design System

### Palette de Couleurs

```scss
// Primary
--primary-600: #5c7cfa;  // Bleu principal
--accent-600: #7950f2;   // Violet accent

// Neutrals
--gray-900: #212529;     // Texte principal
--gray-700: #495057;     // Texte secondaire
--gray-600: #868e96;     // Texte tertiaire

// Semantic
--success: #51cf66;      // Succès
--error: #ff6b6b;        // Erreur
--warning: #ffd43b;      // Attention
--info: #339af0;         // Info
```

### Typography

- **Police** : Inter (système de fallback Apple/Google)
- **Tailles** : 12px à 48px (échelle modulaire)
- **Poids** : 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Espacements

```scss
--spacing-xs: 0.25rem;   // 4px
--spacing-sm: 0.5rem;    // 8px
--spacing-md: 1rem;      // 16px
--spacing-lg: 1.5rem;    // 24px
--spacing-xl: 2rem;      // 32px
--spacing-2xl: 3rem;     // 48px
--spacing-3xl: 4rem;     // 64px
```

### Composants Réutilisables

- **Buttons** : Primary, Secondary, Ghost (3 tailles)
- **Cards** : Avec hover effects et transitions
- **Forms** : Inputs, selects, textareas stylisés
- **Badges** : Pour états et labels
- **Grids** : Responsive (2, 3, 4 colonnes)

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Produits
- `GET /api/products` - Liste paginée avec filtres
- `GET /api/products/{id}` - Détail produit
- `GET /api/products/brands` - Liste des marques
- `GET /api/products/conditions` - Liste des états
- `GET /api/products/search?q=query` - Recherche

### Panier
- `GET /api/cart?userId={id}` - Panier utilisateur
- `POST /api/cart?userId={id}` - Ajouter au panier
- `PUT /api/cart/{id}?quantity={n}` - Modifier quantité
- `DELETE /api/cart/{id}` - Supprimer article
- `DELETE /api/cart?userId={id}` - Vider panier

### Favoris
- `GET /api/favorites?userId={id}` - Liste favoris
- `POST /api/favorites/{productId}?userId={id}` - Ajouter
- `DELETE /api/favorites/{productId}?userId={id}` - Supprimer
- `GET /api/favorites/check/{productId}?userId={id}` - Vérifier

### Commandes
- `GET /api/orders?userId={id}` - Commandes utilisateur
- `POST /api/orders` - Créer commande
- `GET /api/orders/{id}` - Détail commande

### Catégories
- `GET /api/categories` - Liste catégories
- `GET /api/categories/{id}` - Détail catégorie

### Avis
- `GET /api/reviews/product/{id}` - Avis produit
- `GET /api/reviews/product/{id}/stats` - Stats avis
- `POST /api/reviews` - Créer avis
- `DELETE /api/reviews/{id}?userId={id}` - Supprimer avis

## 🎯 Fonctionnalités Clés

### 1. Expérience Utilisateur

✅ **Navigation fluide** : Transitions douces, lazy loading  
✅ **Recherche avancée** : Filtres multiples, suggestions  
✅ **Responsive design** : Mobile-first, adaptatif  
✅ **Performance** : Optimisations, pagination  
✅ **Accessibilité** : ARIA, keyboard navigation  

### 2. E-Commerce

✅ **Catalogue produits** : Grille responsive, filtres  
✅ **Gestion panier** : Quantités, total en temps réel  
✅ **Favoris** : Sauvegarde persistante  
✅ **Commandes** : Historique, suivi  
✅ **Avis clients** : Notation, commentaires  

### 3. Sécurité

✅ **Authentification JWT** : Tokens sécurisés  
✅ **Rôles utilisateurs** : USER, SELLER, ADMIN  
✅ **Protection routes** : Guards Angular  
✅ **Validation données** : Backend + Frontend  
✅ **HTTPS ready** : Production sécurisée  

## 📊 Données de Test

Le backend inclut un fichier `data.sql` avec des données de démonstration :

**Utilisateurs :**
- Admin : `admin@example.com` / `admin123`
- Alice (vendeur) : `alice@example.com` / `password123`
- Bob : `bob@example.com` / `password123`

**Produits :**
- 6 produits de test (vêtements, électronique, audio)
- Images placeholder
- Prix entre 14,90€ et 699€

## 🔄 Workflow de Développement

1. **Backend first** : Créer les entités et endpoints
2. **Models** : Créer les interfaces TypeScript
3. **Services** : Implémenter la logique métier
4. **Components** : Développer les pages et composants
5. **Styling** : Appliquer le design system
6. **Testing** : Tests unitaires et e2e
7. **Optimization** : Performance et SEO

## 📝 Bonnes Pratiques

### Angular
- Standalone components partout
- Signals pour la réactivité
- Lazy loading des routes
- Services injectables au niveau root
- Types stricts TypeScript

### Spring Boot
- DTOs pour les transferts de données
- Validation des inputs
- Gestion des exceptions
- Transactions JPA
- Tests unitaires

## 🚧 Améliorations Futures

- [ ] Système de paiement (Stripe)
- [ ] Upload d'images produits
- [ ] Chat vendeur/acheteur
- [ ] Notifications push
- [ ] Tableau de bord vendeur
- [ ] Statistiques admin
- [ ] Export commandes PDF
- [ ] Multi-langue (i18n)
- [ ] Progressive Web App (PWA)
- [ ] Tests e2e (Cypress/Playwright)

## 👨‍💻 Développement

### Running unit tests

```bash
ng test
```

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner:

```bash
ng test
```

### Running end-to-end tests

For end-to-end testing:

```bash
ng e2e
```

## 📄 Licence

Ce projet est un projet éducatif et de démonstration.

---

**Note** : Ce projet est une démonstration complète d'une marketplace moderne. L'interface est entièrement fonctionnelle et connectée au backend Spring Boot via API REST avec authentification JWT.

## 🆘 Support

Pour toute question ou problème :
1. Vérifier la documentation ci-dessus
2. Vérifier que le backend est bien lancé sur le port 8080
3. Vérifier que PostgreSQL est démarré
4. Consulter les logs du terminal pour les erreurs

**Bonne exploration ! 🚀**
