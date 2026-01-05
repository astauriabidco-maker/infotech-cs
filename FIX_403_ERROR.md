# 🔴 ERREUR 403 - SOLUTION COMPLÈTE

## ❌ PROBLÈME

```
Erreur 403 Forbidden sur:
- POST http://localhost:8080/api/admin/products
- POST http://localhost:8080/api/admin/listings

Utilisateur connecté: vendeur@gmail.com
Rôles: ROLE_SELLER, ROLE_USER (PAS ROLE_ADMIN)
```

**Cause** : Les endpoints `/api/admin/*` requièrent `ROLE_ADMIN`, mais les vendeurs n'ont que `ROLE_SELLER`.

---

## ✅ SOLUTION

### **PARTIE 1 : FRONTEND (✅ DÉJÀ CORRIGÉ)**

J'ai modifié les services Angular pour utiliser les bons endpoints :

```typescript
// AVANT (❌ Ne fonctionne pas)
POST /api/admin/products
POST /api/admin/listings

// APRÈS (✅ Fonctionne pour vendeurs)
POST /api/seller/products
POST /api/seller/listings
GET  /api/seller/listings (mes listings uniquement)
DELETE /api/seller/listings/{id} (mes listings uniquement)
```

**Fichiers modifiés :**
- ✅ `product-admin.service.ts` - Ajout `createProductAsSeller()`
- ✅ `listing.service.ts` - Ajout `getMyListings()`, `createListingAsSeller()`, `deleteMyListing()`
- ✅ `seller-dashboard.component.ts` - Utilise `getMyListings()`
- ✅ `seller-products.component.ts` - Utilise les nouvelles méthodes vendeur

---

### **PARTIE 2 : BACKEND (⚠️ À FAIRE PAR VOUS)**

Vous devez créer **2 nouveaux contrôleurs** côté Spring Boot :

#### **1. SellerProductController.java**

📁 Emplacement : `src/main/java/com/n2s/infotech/controller/SellerProductController.java`

```java
@RestController
@RequestMapping("/api/seller/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
public class SellerProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody CreateProductRequest req) {
        // Même logique que ProductAdminController
        Category cat = null;
        if (req.getCategoryId() != null) {
            cat = categoryRepository.findById(req.getCategoryId()).orElse(null);
        }
        
        Product p = Product.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .brand(req.getBrand())
                .model(req.getModel())
                .condition(req.getCondition())
                .category(cat)
                .build();
        
        p = productRepository.save(p);
        
        return ResponseEntity.ok(convertToDto(p));
    }
}
```

#### **2. SellerListingController.java**

📁 Emplacement : `src/main/java/com/n2s/infotech/controller/SellerListingController.java`

```java
@RestController
@RequestMapping("/api/seller/listings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
public class SellerListingController {

    private final ListingRepository listingRepository;
    private final ProductRepository productRepository;
    private final SellerProfileRepository sellerProfileRepository;
    private final UserRepository userRepository;

    /**
     * Récupérer MES listings uniquement
     */
    @GetMapping
    public ResponseEntity<List<ListingDto>> getMyListings(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        SellerProfile sellerProfile = sellerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller profile not found"));
        
        List<Listing> listings = listingRepository.findBySeller(sellerProfile);
        
        return ResponseEntity.ok(listings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList()));
    }

    /**
     * Créer un listing
     */
    @PostMapping
    public ResponseEntity<ListingDto> createListing(
            @RequestBody CreateListingRequest req,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        SellerProfile sellerProfile = sellerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller profile not found"));
        
        Product p = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        Listing l = Listing.builder()
                .product(p)
                .seller(sellerProfile)
                .price(req.getPrice())
                .quantity(req.getQuantity())
                .conditionNote(req.getConditionNote())
                .active(true)
                .build();
        
        l = listingRepository.save(l);
        
        return ResponseEntity.ok(convertToDto(l));
    }

    /**
     * Supprimer MON listing
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMyListing(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        SellerProfile sellerProfile = sellerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller profile not found"));
        
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        
        // Sécurité : vérifier que le listing appartient au vendeur
        if (!listing.getSeller().getId().equals(sellerProfile.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        listingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
```

#### **3. Ajouter méthode dans ListingRepository**

```java
public interface ListingRepository extends JpaRepository<Listing, Long> {
    List<Listing> findBySeller(SellerProfile seller);
}
```

#### **4. Ajouter méthode dans SellerProfileRepository**

```java
public interface SellerProfileRepository extends JpaRepository<SellerProfile, Long> {
    Optional<SellerProfile> findByUser(User user);
}
```

---

## 🚀 ÉTAPES POUR RÉSOUDRE

### **1. Créer les contrôleurs backend** (5 minutes)
- Créer `SellerProductController.java`
- Créer `SellerListingController.java`
- Ajouter les méthodes dans les repositories

### **2. Redémarrer le backend** (1 minute)
```bash
mvn spring-boot:run
# OU
./mvnw spring-boot:run
```

### **3. Tester** (2 minutes)
- Se connecter comme vendeur : `vendeur@gmail.com`
- Aller sur `/seller/dashboard`
- Cliquer "Ajouter un produit"
- Remplir le formulaire + ajouter images
- Cliquer "Créer le produit"
- ✅ **Ça devrait fonctionner !**

---

## 📋 FICHIER COMPLET BACKEND

J'ai créé un fichier complet avec tout le code : 
📄 **`BACKEND_CONTROLLERS_NEEDED.md`**

Ce fichier contient :
- ✅ Code complet des 2 contrôleurs
- ✅ Code des repositories
- ✅ Exemples de tests avec curl
- ✅ Différences Admin vs Seller
- ✅ Sécurité et permissions

---

## 🎯 RÉSUMÉ

| Composant | Statut | Action |
|-----------|--------|--------|
| **Frontend Angular** | ✅ **FAIT** | Services modifiés pour utiliser `/api/seller/*` |
| **Backend Spring Boot** | ⚠️ **À FAIRE** | Créer `SellerProductController` et `SellerListingController` |
| **Repositories** | ⚠️ **À FAIRE** | Ajouter `findBySeller()` et `findByUser()` |

---

## 💡 POURQUOI CETTE SOLUTION ?

### **Avant (problème)**
```
Vendeur → /api/admin/products → 403 Forbidden
         (requiert ROLE_ADMIN)
```

### **Après (solution)**
```
Vendeur → /api/seller/products → 200 OK
         (requiert ROLE_SELLER)
         
Admin   → /api/admin/products  → 200 OK
         (requiert ROLE_ADMIN)
```

**Avantages** :
- ✅ Séparation des permissions
- ✅ Sécurité renforcée (vendeur ne voit que SES produits)
- ✅ Pas de modification des contrôleurs admin
- ✅ Respect du principe de moindre privilège

---

## 🐛 EN CAS DE PROBLÈME

### **Si ça ne marche toujours pas après création des contrôleurs :**

1. **Vérifier les logs backend**
   ```bash
   # Chercher les erreurs 403
   tail -f logs/application.log | grep 403
   ```

2. **Vérifier le token JWT**
   - Décodez le token sur jwt.io
   - Vérifiez que `roles: ["ROLE_SELLER", "ROLE_USER"]` est présent

3. **Vérifier les endpoints**
   ```bash
   # Tester avec curl
   curl -X POST http://localhost:8080/api/seller/products \
     -H "Authorization: Bearer VOTRE_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","brand":"Apple","model":"iPhone","condition":"Excellent"}'
   ```

4. **Vérifier la console Angular**
   - Ouvrir DevTools (F12)
   - Onglet Network
   - Regarder la requête POST vers `/api/seller/products`
   - Status doit être 200, pas 403

---

**Date** : 18 décembre 2025  
**Statut** : Frontend ✅ | Backend ⚠️ À FAIRE  
**Temps estimé** : 10 minutes pour tout corriger
