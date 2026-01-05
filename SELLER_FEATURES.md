# 🏪 Fonctionnalités Vendeur - Infotech Marketplace

## ✅ Fonctionnalités Implémentées

### 1. **Dashboard Vendeur** (`/seller/dashboard`)
- 📊 **Statistiques en temps réel** :
  - Nombre de produits en vente
  - Total des ventes
  - Chiffre d'affaires
  - Note moyenne des avis
- 🎯 **Actions rapides** :
  - Gérer mes produits
  - Mes commandes
  - Avis clients
  - Paramètres boutique
- 📦 **Derniers produits** : Aperçu des 5 derniers produits ajoutés

### 2. **Gestion des Produits** (`/seller/products`)
- ➕ **Ajout de produits** avec formulaire complet :
  - Titre, marque, modèle
  - État du produit (Neuf, Excellent, Très bon état, etc.)
  - Prix et quantité
  - Description détaillée
  - Note sur l'état
- 📸 **Upload d'images Cloudinary** :
  - ✨ Drag & drop d'images
  - 📤 Sélection multiple de fichiers
  - 👁️ Prévisualisation avant upload
  - 🗑️ Suppression d'images individuelles
  - 📏 Formats supportés : JPG, PNG, WebP, GIF (max 10MB)
- 📋 **Liste des produits** :
  - Affichage en grille avec images
  - Prix, quantité, état
  - Badge actif/inactif
- ✏️ **Actions** :
  - Modifier un produit
  - Supprimer un produit

### 3. **Intégration Profil**
- 🏪 **Carte Espace Vendeur** pour les utilisateurs avec `ROLE_SELLER`
- 🚀 Accès rapide au dashboard vendeur depuis le profil
- 🎨 Design cohérent avec le reste de l'application

## 🛠️ Architecture Technique

### **Models** (`src/app/core/models/`)
```typescript
// listing.model.ts
- Listing (DTO principal)
- CreateListingRequest (création)
- UpdateListingRequest (modification)

// product.model.ts
- Product (DTO principal)
- CreateProductRequest (création)
- ProductImage (image Cloudinary)
- UploadImageResponse (réponse upload)
```

### **Services** (`src/app/core/services/`)
```typescript
// listing.service.ts
✅ getListings() - Liste paginée
✅ getListing(id) - Détail
✅ createListing() - Création [SELLER/ADMIN]
✅ getAllListings() - Liste complète [ADMIN]
✅ deleteListing(id) - Suppression [SELLER/ADMIN]

// image.service.ts
✅ uploadProductImage() - Upload une image
✅ uploadMultipleProductImages() - Upload multiple
✅ getProductImages() - Récupérer images
✅ deleteImage() - Supprimer une image
✅ deleteAllProductImages() - Supprimer toutes

// product-admin.service.ts
✅ createProduct() - Créer un produit [ADMIN/SELLER]
```

### **Composants** (`src/app/features/seller/`)
```
seller/
├── dashboard/
│   ├── seller-dashboard.component.ts
│   ├── seller-dashboard.component.html
│   └── seller-dashboard.component.scss
└── products/
    ├── seller-products.component.ts
    ├── seller-products.component.html
    └── seller-products.component.scss
```

### **Routes** (`app.routes.ts`)
```typescript
/seller/dashboard  → SellerDashboardComponent
/seller/products   → SellerProductsComponent
```

## 📡 Endpoints Backend Utilisés

### **Produits**
- `POST /api/admin/products` - Créer un produit
- `GET /api/products` - Liste publique avec filtres

### **Listings**
- `GET /api/listings` - Liste paginée avec recherche
- `GET /api/listings/{id}` - Détail d'un listing
- `POST /api/admin/listings` - Créer un listing
- `GET /api/admin/listings` - Liste complète
- `DELETE /api/admin/listings/{id}` - Supprimer

### **Images Cloudinary**
- `POST /api/images/product/{productId}/upload` - Upload 1 image
- `POST /api/images/product/{productId}/upload/multiple` - Upload multiple
- `GET /api/images/product/{productId}` - Récupérer images
- `DELETE /api/images/{imageId}` - Supprimer image
- `DELETE /api/images/product/{productId}/all` - Supprimer toutes

### **Profil Vendeur**
- `GET /api/user/stats` - Statistiques vendeur

## 🎨 Design & UX

### **Palette Couleurs Vendeur**
- Primaire : `#667eea` → `#764ba2` (gradient violet)
- Vendeur : `#ff9800` → `#f57c00` (gradient orange)
- Success : `#d4edda` (vert clair)
- Danger : `#dc3545` (rouge)

### **Caractéristiques UI**
- ✨ Design moderne et épuré
- 📱 Responsive (mobile, tablette, desktop)
- 🎭 Animations fluides et transitions
- 🖼️ Cards avec hover effects
- 🎯 Modal plein écran pour l'ajout de produits
- 🌈 Gradient backgrounds pour les sections importantes

## 🔐 Sécurité & Permissions

### **Rôles Requis**
- `ROLE_SELLER` : Accès au dashboard et gestion de ses produits
- `ROLE_ADMIN` : Accès complet + modération

### **Guards** (à implémenter)
```typescript
// auth.guard.ts - Vérifier authentification
// seller.guard.ts - Vérifier ROLE_SELLER
```

## 🚀 Prochaines Étapes

### **Haute Priorité**
- [ ] Auth Guards pour protéger les routes seller
- [ ] Édition de produits existants
- [ ] Gestion du stock en temps réel
- [ ] Upload d'images en cours (progress bar)

### **Moyenne Priorité**
- [ ] Filtres et recherche dans mes produits
- [ ] Export des statistiques (PDF/Excel)
- [ ] Notifications vendeur (nouvelles commandes)
- [ ] Gestion des commandes vendeur

### **Fonctionnalités Avancées**
- [ ] Analytics détaillées (graphiques)
- [ ] Promotions et réductions
- [ ] Messages clients
- [ ] Gestion des retours

## 📖 Utilisation

### **Pour un Vendeur**
1. Se connecter avec un compte `ROLE_SELLER`
2. Aller sur `/profile`
3. Cliquer sur "Accéder à mon espace vendeur"
4. Dans le dashboard, cliquer sur "Ajouter un produit"
5. Remplir le formulaire :
   - Informations produit (titre, marque, modèle, état)
   - Prix et quantité
   - Description
   - **Glisser-déposer ou sélectionner des images**
6. Cliquer sur "Créer le produit"
7. Le produit est créé et les images sont uploadées sur Cloudinary

### **Flow Technique**
```
1. Création du produit → POST /api/admin/products
2. Upload images → POST /api/images/product/{id}/upload/multiple
3. Création listing → POST /api/admin/listings
4. Rechargement liste → GET /api/admin/listings
```

## 🐛 Debug & Logs

### **Console Logs**
- ✅ Erreurs API affichées dans la console
- ✅ Succès confirmés par des alerts
- ✅ Statuts de chargement visibles

### **Erreurs Communes**
```typescript
// Produit non trouvé
"Erreur lors de la création du produit"

// Profil vendeur manquant
"Profil vendeur introuvable"

// Images trop volumineuses
"Format d'image invalide ou fichier trop volumineux"
```

## 🌐 Environnement

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## 📝 Notes Importantes

1. **Cloudinary** : Les images sont stockées sur Cloudinary, pas en local
2. **Permissions** : Le backend vérifie les rôles via `@PreAuthorize`
3. **Validations** : Frontend et backend valident les données
4. **Performance** : Les images sont optimisées automatiquement par Cloudinary

---

**Créé le** : 18 décembre 2025  
**Framework** : Angular 20.3.0 (Standalone Components)  
**Backend** : Spring Boot + Cloudinary  
**Design** : Modern Gradient UI
