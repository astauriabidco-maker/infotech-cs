# Guide d'Intégration - Passeport Numérique

Ce guide explique comment utiliser le système de passeport numérique dans votre application e-commerce.

## 📋 Vue d'ensemble

Le passeport numérique permet d'afficher des informations détaillées sur l'impact environnemental et la durabilité des produits :
- **Empreinte carbone** avec score (A à E)
- **Traçabilité** de la chaîne d'approvisionnement
- **Matériaux** utilisés (renouvelables, recyclés, recyclables)
- **Durabilité** (durée de vie, réparabilité)
- **Certifications** environnementales, éthiques, qualité
- **Recyclage** (instructions, points de collecte)

---

## 🚀 Utilisation actuelle

### 1. Affichage automatique dans la page détail du produit

Le passeport numérique s'affiche **automatiquement** dans la page de détail du produit si un passeport existe pour ce produit.

**Fichier :** `src/app/features/products/product-detail/product-detail.component.ts`

Le composant vérifie automatiquement la présence d'un passeport :

```typescript
ngOnInit() {
  // ... code existant ...
  
  // Charge automatiquement le passeport si disponible
  this.digitalPassportService.getPassportByProductId(this.product.id).subscribe({
    next: (passport) => this.passport.set(passport),
    error: () => this.passport.set(null)
  });
}
```

### 2. Badge éco-responsable sur les cartes produit

Les produits avec un bon score environnemental (A ou B) affichent automatiquement un badge "🌱 Produit éco-responsable".

**Logique :** Si le passeport existe et que `carbonFootprint.score` est 'A' ou 'B', le badge s'affiche.

---

## 📝 Comment créer des passeports numériques

### Option 1 : Via Swagger UI (Recommandé pour les tests)

1. Accédez à Swagger : `http://localhost:8080/swagger-ui/index.html`
2. Authentifiez-vous avec votre token (rôle SELLER ou ADMIN requis)
3. Utilisez l'endpoint `POST /api/digital-passports`
4. Copiez un exemple depuis `docs/DIGITAL_PASSPORT_EXAMPLES.md`
5. Modifiez le `productId` et exécutez

### Option 2 : Via formulaire dans l'application (À implémenter)

**Prochaine étape recommandée** : Intégrer le formulaire de création de passeport dans l'interface vendeur.

#### a) Dans la page de création de produit

Ajouter un onglet "Passeport Numérique" dans le formulaire de création de produit :

```typescript
// src/app/features/seller/create-listing/create-listing.component.html

<!-- Après les onglets existants -->
<div *ngIf="currentStep === 4">
  <h3>Passeport Numérique (Optionnel)</h3>
  <app-digital-passport-form 
    [productId]="createdProductId"
    (passportCreated)="onPassportCreated($event)">
  </app-digital-passport-form>
</div>
```

#### b) Dans la page "Mes produits" du vendeur

Ajouter un bouton "Créer/Modifier Passeport" pour chaque produit :

```html
<!-- src/app/features/seller/my-listings/my-listings.component.html -->

<button (click)="openPassportModal(product.id)">
  📄 {{ product.hasPassport ? 'Modifier' : 'Créer' }} Passeport
</button>
```

---

## 🎨 Personnalisation de l'affichage

### Modifier les couleurs des scores

**Fichier :** `src/app/features/products/digital-passport/digital-passport.component.scss`

```scss
.carbon-score {
  &.score-a { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
  &.score-b { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
  &.score-c { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
  &.score-d { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
  &.score-e { background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%); }
}
```

### Ajouter des traductions

Si vous utilisez i18n, créez un fichier de traduction pour les labels :

```json
{
  "digitalPassport": {
    "title": "Passeport Numérique",
    "carbonFootprint": "Empreinte Carbone",
    "materials": "Matériaux",
    "durability": "Durabilité",
    "certifications": "Certifications",
    "recycling": "Recyclage"
  }
}
```

---

## 🔄 Workflow complet

### Scénario 1 : Vendeur crée un nouveau produit

1. Le vendeur remplit le formulaire de création de produit
2. Le produit est créé (sans passeport pour le moment)
3. **[OPTIONNEL]** Le vendeur peut ajouter un passeport via :
   - Formulaire intégré (à implémenter)
   - Swagger UI
   - API directement

### Scénario 2 : Client consulte un produit

1. Le client clique sur un produit
2. La page de détail se charge
3. **Si un passeport existe :**
   - L'onglet "Passeport Numérique" apparaît
   - Le badge éco-responsable s'affiche (si score A/B)
   - Les 5 sections de données sont visibles
4. **Si pas de passeport :**
   - Affichage normal sans l'onglet passeport

---

## 🎯 Recommandations pour la production

### 1. Rendre le passeport obligatoire (ou non)

**Option A - Obligatoire :**
```typescript
// Dans create-listing.component.ts
validateProduct() {
  if (!this.product.digitalPassport) {
    this.error = 'Le passeport numérique est obligatoire';
    return false;
  }
  return true;
}
```

**Option B - Optionnel (actuel) :**
Le passeport reste optionnel, seuls les produits avec passeport affichent le badge éco-responsable.

### 2. Filtrage par score environnemental

Ajoutez un filtre dans la liste des produits :

```html
<!-- product-list.component.html -->
<select [(ngModel)]="ecoFilter">
  <option value="">Tous les produits</option>
  <option value="A">Score A (Excellent)</option>
  <option value="B">Score B (Très bon)</option>
  <option value="eco">Produits éco-responsables (A & B)</option>
</select>
```

### 3. Afficher le score dans les résultats de recherche

Modifiez la carte produit pour afficher le score carbone :

```html
<!-- product-card.component.html -->
<div *ngIf="product.carbonScore" class="carbon-badge" [class]="'score-' + product.carbonScore.toLowerCase()">
  {{ product.carbonScore }}
</div>
```

### 4. Statistiques vendeur

Dans le dashboard vendeur, affichez :
- Nombre de produits avec passeport numérique
- Score moyen de ses produits
- Comparaison avec la moyenne du marché

---

## 🐛 Dépannage

### Le passeport ne s'affiche pas

**Causes possibles :**
1. Aucun passeport n'existe pour ce `productId`
   - Vérifiez dans Swagger : `GET /api/digital-passports/product/{productId}`
2. Erreur CORS ou réseau
   - Vérifiez la console du navigateur (F12)
3. Le produit n'existe pas
   - Vérifiez que le `productId` est valide

### Erreur 401 Unauthorized lors de la création

**Solution :**
- Assurez-vous d'être authentifié avec un rôle `SELLER` ou `ADMIN`
- Vérifiez que votre token est valide

### Les données ne s'affichent pas correctement

**Solution :**
- Vérifiez que les noms de propriétés correspondent exactement au backend
- Ouvrez la console (F12) et regardez les erreurs JavaScript
- Comparez avec les exemples dans `DIGITAL_PASSPORT_EXAMPLES.md`

---

## 📚 Fichiers importants

| Fichier | Description |
|---------|-------------|
| `src/app/core/models/digital-passport.model.ts` | Interfaces TypeScript |
| `src/app/core/services/digital-passport.service.ts` | Service HTTP |
| `src/app/features/products/digital-passport/digital-passport.component.*` | Composant d'affichage |
| `src/app/features/products/digital-passport-form/digital-passport-form.component.*` | Formulaire de création |
| `docs/DIGITAL_PASSPORT_EXAMPLES.md` | Exemples de données |

---

## 🎉 Prochaines fonctionnalités suggérées

1. **Import/Export CSV** - Permettre l'import en masse de passeports
2. **Calcul automatique** - Proposer des valeurs par défaut basées sur la catégorie du produit
3. **Validation par IA** - Vérifier la cohérence des données saisies
4. **Comparaison produits** - Afficher côte à côte les passeports de plusieurs produits
5. **Timeline** - Historique des modifications du passeport
6. **QR Code** - Générer un QR code pour accès rapide au passeport

---

**🌱 Le passeport numérique est maintenant opérationnel ! Utilisez Swagger pour créer vos premiers passeports et observer les résultats dans l'interface utilisateur.**
