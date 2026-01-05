# Guide d'intégration - Passeport Numérique Produit

## 📋 Vue d'ensemble

Le système de passeport numérique est maintenant complet. Ce document explique comment intégrer les différents composants dans votre application.

---

## 🎯 Composants créés

### 1. **Modèles TypeScript**
- **Fichier**: `/src/app/core/models/digital-passport.model.ts`
- **Contenu**: Interfaces TypeScript pour DigitalPassport, CarbonFootprint, Traceability, Material, etc.

### 2. **Service Angular**
- **Fichier**: `/src/app/core/services/digital-passport.service.ts`
- **Endpoints**:
  - `GET /api/digital-passports/product/{productId}` - Récupérer le passeport d'un produit
  - `POST /api/digital-passports` - Créer un passeport
  - `PUT /api/digital-passports/{id}` - Modifier un passeport
  - `DELETE /api/digital-passports/{id}` - Supprimer un passeport

### 3. **Composant d'affichage**
- **Fichiers**: 
  - `/src/app/features/products/digital-passport/digital-passport.component.ts`
  - `/src/app/features/products/digital-passport/digital-passport.component.html`
  - `/src/app/features/products/digital-passport/digital-passport.component.scss`
- **Usage**: Affiche le passeport numérique avec 5 onglets (Carbone, Matériaux, Durabilité, Certifications, Recyclage)

### 4. **Composant de formulaire**
- **Fichiers**:
  - `/src/app/features/products/digital-passport-form/digital-passport-form.component.ts`
  - `/src/app/features/products/digital-passport-form/digital-passport-form.component.html`
  - `/src/app/features/products/digital-passport-form/digital-passport-form.component.scss`
- **Usage**: Formulaire en 5 étapes pour créer/modifier un passeport numérique

### 5. **Documentation Backend**
- **Fichier**: `/docs/BACKEND_DIGITAL_PASSPORT_SETUP.md`
- **Contenu**: Guide complet pour implémenter le backend Java Spring Boot

---

## 🚀 Étapes d'intégration

### Étape 1: Ajouter les routes

Modifiez le fichier `src/app/app.routes.ts` pour ajouter les nouvelles routes :

```typescript
import { Routes } from '@angular/router';
import { DigitalPassportComponent } from './features/products/digital-passport/digital-passport.component';
import { DigitalPassportFormComponent } from './features/products/digital-passport-form/digital-passport-form.component';

export const routes: Routes = [
  // ... vos routes existantes

  // Route pour afficher le passeport d'un produit
  {
    path: 'products/:id/passport',
    component: DigitalPassportComponent
  },

  // Route pour créer un passeport (vendeurs/admins)
  {
    path: 'seller/products/:id/passport/create',
    component: DigitalPassportFormComponent,
    // canActivate: [SellerGuard] // Ajoutez un guard si nécessaire
  },

  // Route pour modifier un passeport (vendeurs/admins)
  {
    path: 'seller/products/:id/passport/edit',
    component: DigitalPassportFormComponent,
    // canActivate: [SellerGuard]
  }
];
```

### Étape 2: Intégrer dans la page produit

Dans votre composant de détail produit, ajoutez un bouton pour afficher le passeport :

**product-detail.component.html** :
```html
<!-- Dans votre template de détail produit -->
<div class="product-details">
  <!-- ... informations produit ... -->

  <!-- Bouton Passeport Numérique -->
  <div class="passport-section">
    <button 
      class="btn btn-passport" 
      [routerLink]="['/products', product.id, 'passport']">
      🌱 Voir le passeport numérique
    </button>
  </div>
</div>
```

**product-detail.component.scss** :
```scss
.passport-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;

  .btn-passport {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 1.125rem;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }
  }
}
```

### Étape 3: Intégrer dans le formulaire de création de produit

Pour que les vendeurs créent le passeport lors de l'ajout d'un produit :

**create-product.component.ts** :
```typescript
import { Component, signal } from '@angular/core';

export class CreateProductComponent {
  currentStep = signal(1); // 1: Info produit, 2: Images, 3: Passeport numérique
  productId = signal<number | null>(null);

  onProductCreated(id: number): void {
    this.productId.set(id);
    this.currentStep.set(3); // Passer à l'étape passeport
  }

  onPassportSaved(): void {
    // Rediriger vers la liste des produits ou afficher un message
    alert('Produit et passeport numérique créés avec succès !');
    // this.router.navigate(['/seller/products']);
  }
}
```

**create-product.component.html** :
```html
<div class="create-product-wizard">
  <!-- Étape 1: Informations produit -->
  @if (currentStep() === 1) {
    <app-product-form (saved)="onProductCreated($event)"></app-product-form>
  }

  <!-- Étape 2: Upload images -->
  @if (currentStep() === 2) {
    <!-- Votre composant d'upload d'images -->
  }

  <!-- Étape 3: Passeport numérique -->
  @if (currentStep() === 3 && productId()) {
    <app-digital-passport-form
      [productId]="productId()!"
      (saved)="onPassportSaved()"
      (cancelled)="currentStep.set(2)">
    </app-digital-passport-form>
  }
</div>
```

### Étape 4: Afficher un badge "Éco-responsable"

Dans vos cartes produit, affichez un badge si le produit a un bon score carbone :

**product-card.component.html** :
```html
<div class="product-card">
  <img [src]="product.imageUrl" [alt]="product.name">
  
  <!-- Badge passeport numérique -->
  @if (product.hasDigitalPassport && product.carbonScore === 'A' || product.carbonScore === 'B') {
    <div class="eco-badge">
      🌱 Éco-responsable
    </div>
  }

  <h3>{{ product.name }}</h3>
  <p class="price">{{ product.price }} €</p>

  <!-- Lien vers le passeport -->
  @if (product.hasDigitalPassport) {
    <a [routerLink]="['/products', product.id, 'passport']" class="passport-link">
      Voir l'impact environnemental
    </a>
  }
</div>
```

**product-card.component.scss** :
```scss
.product-card {
  position: relative;

  .eco-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.75rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  }

  .passport-link {
    display: inline-block;
    margin-top: 0.5rem;
    color: #667eea;
    font-size: 0.875rem;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
}
```

### Étape 5: Ajouter un filtre "Éco-responsable"

Dans votre page de liste de produits, ajoutez un filtre :

**product-list.component.html** :
```html
<div class="filters">
  <!-- Autres filtres (catégorie, prix, etc.) -->

  <div class="filter-group">
    <label>
      <input 
        type="checkbox" 
        [(ngModel)]="ecoFriendlyOnly"
        (change)="onFilterChange()">
      🌱 Produits éco-responsables uniquement
    </label>
  </div>
</div>
```

**product-list.component.ts** :
```typescript
export class ProductListComponent {
  ecoFriendlyOnly = false;

  onFilterChange(): void {
    // Filtrer les produits avec hasDigitalPassport = true et carbonScore = A ou B
    this.loadProducts();
  }

  loadProducts(): void {
    const filters = {
      ecoFriendly: this.ecoFriendlyOnly
    };
    
    this.productService.getProducts(filters).subscribe(products => {
      this.products = products;
    });
  }
}
```

---

## 🗂️ Structure finale des fichiers

```
src/app/
├── core/
│   ├── models/
│   │   └── digital-passport.model.ts        ✅ Créé
│   └── services/
│       └── digital-passport.service.ts      ✅ Créé
├── features/
│   └── products/
│       ├── digital-passport/
│       │   ├── digital-passport.component.ts        ✅ Créé
│       │   ├── digital-passport.component.html      ✅ Créé
│       │   └── digital-passport.component.scss      ✅ Créé
│       └── digital-passport-form/
│           ├── digital-passport-form.component.ts   ✅ Créé
│           ├── digital-passport-form.component.html ✅ Créé
│           └── digital-passport-form.component.scss ✅ Créé
└── app.routes.ts                                     ⚠️ À modifier

docs/
└── BACKEND_DIGITAL_PASSPORT_SETUP.md         ✅ Créé
```

---

## 🔧 Backend à implémenter

Suivez le guide complet dans `/docs/BACKEND_DIGITAL_PASSPORT_SETUP.md` pour :

1. Créer les entités JPA (DigitalPassport, CarbonFootprint, etc.)
2. Créer les DTOs
3. Créer le repository
4. Implémenter le service avec la logique métier
5. Créer le controller REST
6. Configurer la base de données
7. Tester les endpoints

---

## 📊 Exemple de flux utilisateur

### Pour les acheteurs :

1. **Navigation** → Liste des produits
2. **Filtre** → "Produits éco-responsables uniquement" (optionnel)
3. **Clic** → Produit avec badge "🌱 Éco-responsable"
4. **Page produit** → Bouton "Voir le passeport numérique"
5. **Passeport** → 5 onglets d'information environnementale
6. **Décision d'achat** éclairée basée sur l'impact environnemental

### Pour les vendeurs :

1. **Création produit** → Formulaire informations de base
2. **Upload images** → Ajout des photos
3. **Passeport numérique** → Formulaire en 5 étapes :
   - Étape 1 : Empreinte carbone (Manufacturing, Transport, Usage, End of Life)
   - Étape 2 : Traçabilité (Pays, Fabricant, Date, Usine)
   - Étape 3 : Matériaux (Composition, Origine, Propriétés)
   - Étape 4 : Durabilité (Durée de vie, Réparabilité, Certifications)
   - Étape 5 : Recyclage (%, Instructions, Programme de reprise)
4. **Validation** → Tous les champs obligatoires remplis
5. **Soumission** → Produit avec passeport numérique créé

---

## ✅ Checklist d'intégration

- [ ] Routes ajoutées dans `app.routes.ts`
- [ ] Bouton "Voir le passeport" dans `product-detail.component`
- [ ] Passeport intégré dans le flux de création produit
- [ ] Badge "Éco-responsable" affiché sur les cartes produits
- [ ] Filtre "Éco-responsable" ajouté à la liste des produits
- [ ] Backend implémenté selon `/docs/BACKEND_DIGITAL_PASSPORT_SETUP.md`
- [ ] Base de données configurée avec les tables nécessaires
- [ ] Tests des endpoints avec Postman/cURL
- [ ] Tests end-to-end du flux complet
- [ ] Documentation utilisateur créée

---

## 🎨 Personnalisation

### Couleurs du thème

Dans les fichiers SCSS, vous pouvez personnaliser les couleurs :

```scss
// Variables à ajouter dans styles.scss
$primary-color: #667eea;
$success-color: #10b981;
$warning-color: #f59e0b;
$error-color: #ef4444;

// Scores carbone
$score-a-color: #10b981;  // Vert foncé
$score-b-color: #84cc16;  // Vert clair
$score-c-color: #f59e0b;  // Orange
$score-d-color: #f97316;  // Orange foncé
$score-e-color: #ef4444;  // Rouge
```

### Labels et textes

Tous les textes sont en français dans les templates. Pour internationalisation (i18n), utilisez `@angular/localize`.

---

## 🐛 Débogage

### Problème: Le passeport ne s'affiche pas

1. Vérifiez que le backend répond à `GET /api/digital-passports/product/{productId}`
2. Ouvrez la console navigateur pour voir les erreurs
3. Vérifiez que le `productId` est correct

### Problème: Le formulaire ne se soumet pas

1. Vérifiez que tous les champs obligatoires sont remplis
2. Vérifiez que la somme des matériaux = 100%
3. Ouvrez la console pour voir les erreurs de validation

### Problème: Erreur CORS

Dans votre backend, configurez CORS :

```java
@CrossOrigin(origins = "http://localhost:4200")
public class DigitalPassportController { ... }
```

---

## 📞 Support

Pour toute question ou problème :
1. Consultez d'abord `/docs/BACKEND_DIGITAL_PASSPORT_SETUP.md`
2. Vérifiez les logs backend et frontend
3. Testez les endpoints avec Postman

---

## 🚀 Prochaines améliorations possibles

- [ ] Graphiques interactifs pour la répartition CO₂
- [ ] Comparaison entre plusieurs produits
- [ ] Historique des mises à jour du passeport
- [ ] API publique pour partager les données environnementales
- [ ] Badge "Vérifié" pour les passeports audités
- [ ] Export PDF du passeport numérique
- [ ] Traduction en plusieurs langues
- [ ] Score global environnemental (agrégé de tous les critères)

---

**Date de création**: {{ date du jour }}  
**Version**: 1.0.0  
**Statut**: ✅ Prêt pour intégration
