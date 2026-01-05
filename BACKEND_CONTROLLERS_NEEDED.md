# 🔧 CONTRÔLEURS BACKEND MANQUANTS - À CRÉER

## ⚠️ PROBLÈME IDENTIFIÉ

Le frontend vendeur essaie d'utiliser les endpoints `/api/admin/*` mais l'utilisateur connecté a seulement `ROLE_SELLER`, pas `ROLE_ADMIN`.

**Erreur actuelle** : `403 Forbidden` lors de la création de produits/listings.

---

## 📋 CONTRÔLEURS À CRÉER CÔTÉ BACKEND

### **1. SellerProductController** ⭐ **URGENT**

```java
package com.n2s.infotech.controller;

import com.n2s.infotech.dto.ProductDto;
import com.n2s.infotech.dto.CreateProductRequest;
import com.n2s.infotech.model.Category;
import com.n2s.infotech.model.Product;
import com.n2s.infotech.repository.ProductRepository;
import com.n2s.infotech.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

/**
 * Contrôleur pour les vendeurs - Gestion des produits
 */
@RestController
@RequestMapping("/api/seller/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
public class SellerProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Créer un nouveau produit (vendeur)
     */
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody CreateProductRequest req) {
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
        
        ProductDto dto = ProductDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .brand(p.getBrand())
                .model(p.getModel())
                .condition(p.getCondition())
                .description(p.getDescription())
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .images(p.getImages().stream()
                        .map(com.n2s.infotech.model.ProductImage::getUrl)
                        .collect(Collectors.toList()))
                .build();
        
        return ResponseEntity.ok(dto);
    }
}
```

---

### **2. SellerListingController** ⭐ **URGENT**

```java
package com.n2s.infotech.controller;

import com.n2s.infotech.dto.ListingDto;
import com.n2s.infotech.dto.CreateListingRequest;
import com.n2s.infotech.model.Listing;
import com.n2s.infotech.model.Product;
import com.n2s.infotech.model.SellerProfile;
import com.n2s.infotech.model.User;
import com.n2s.infotech.repository.ListingRepository;
import com.n2s.infotech.repository.ProductRepository;
import com.n2s.infotech.repository.SellerProfileRepository;
import com.n2s.infotech.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Contrôleur pour les vendeurs - Gestion des listings
 */
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
     * Récupérer MES listings (vendeur connecté uniquement)
     */
    @GetMapping
    public ResponseEntity<List<ListingDto>> getMyListings(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        SellerProfile sellerProfile = sellerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller profile not found"));
        
        List<Listing> listings = listingRepository.findBySeller(sellerProfile);
        
        List<ListingDto> dtos = listings.stream().map(l -> ListingDto.builder()
                .id(l.getId())
                .productId(l.getProduct().getId())
                .productTitle(l.getProduct().getTitle())
                .productBrand(l.getProduct().getBrand())
                .images(l.getProduct().getImages().stream()
                        .map(com.n2s.infotech.model.ProductImage::getUrl)
                        .collect(Collectors.toList()))
                .sellerId(l.getSeller().getId())
                .sellerShopName(l.getSeller().getShopName())
                .price(l.getPrice())
                .quantity(l.getQuantity())
                .conditionNote(l.getConditionNote())
                .active(l.getActive())
                .build())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    /**
     * Créer un listing (vendeur connecté)
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
        
        ListingDto dto = ListingDto.builder()
                .id(l.getId())
                .productId(p.getId())
                .productTitle(p.getTitle())
                .productBrand(p.getBrand())
                .images(p.getImages().stream()
                        .map(com.n2s.infotech.model.ProductImage::getUrl)
                        .collect(Collectors.toList()))
                .sellerId(sellerProfile.getId())
                .sellerShopName(sellerProfile.getShopName())
                .price(l.getPrice())
                .quantity(l.getQuantity())
                .conditionNote(l.getConditionNote())
                .active(l.getActive())
                .build();
        
        return ResponseEntity.ok(dto);
    }

    /**
     * Supprimer MON listing (vérification de propriété)
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
        
        // Vérifier que le listing appartient bien au vendeur connecté
        if (!listing.getSeller().getId().equals(sellerProfile.getId())) {
            throw new RuntimeException("Unauthorized: This listing does not belong to you");
        }
        
        listingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 📝 REPOSITORY MANQUANT

Ajoutez cette méthode dans `ListingRepository` :

```java
public interface ListingRepository extends JpaRepository<Listing, Long> {
    
    // Méthode existante
    // ...
    
    /**
     * Trouver tous les listings d'un vendeur spécifique
     */
    List<Listing> findBySeller(SellerProfile seller);
}
```

---

## 📝 REPOSITORY MANQUANT (SellerProfile)

Ajoutez cette méthode dans `SellerProfileRepository` :

```java
public interface SellerProfileRepository extends JpaRepository<SellerProfile, Long> {
    
    /**
     * Trouver le profil vendeur par utilisateur
     */
    Optional<SellerProfile> findByUser(User user);
}
```

---

## ✅ VÉRIFICATION

Une fois ces contrôleurs créés, testez avec :

### **1. Créer un produit (vendeur)**
```bash
POST http://localhost:8080/api/seller/products
Authorization: Bearer <token_vendeur>
Content-Type: application/json

{
  "title": "iPhone 13 Pro",
  "brand": "Apple",
  "model": "iPhone 13 Pro",
  "condition": "Excellent",
  "description": "iPhone reconditionné"
}
```

### **2. Créer un listing (vendeur)**
```bash
POST http://localhost:8080/api/seller/listings
Authorization: Bearer <token_vendeur>
Content-Type: application/json

{
  "productId": 1,
  "sellerProfileId": 1,
  "price": 699.99,
  "quantity": 3,
  "conditionNote": "Écran neuf"
}
```

### **3. Récupérer mes listings**
```bash
GET http://localhost:8080/api/seller/listings
Authorization: Bearer <token_vendeur>
```

---

## 🔐 SÉCURITÉ

✅ `@PreAuthorize("hasRole('SELLER')")` - Seuls les vendeurs peuvent accéder
✅ Vérification de propriété dans `deleteMyListing` - Un vendeur ne peut supprimer que ses propres listings
✅ Auto-attribution du `SellerProfile` via `Authentication` - Pas de manipulation manuelle de l'ID vendeur

---

## 📊 DIFFÉRENCES ADMIN vs SELLER

| Feature | Admin Endpoint | Seller Endpoint |
|---------|---------------|-----------------|
| Créer produit | `/api/admin/products` | `/api/seller/products` |
| Créer listing | `/api/admin/listings` | `/api/seller/listings` |
| Liste listings | Tous les listings | Seulement MES listings |
| Supprimer | N'importe quel listing | Seulement MES listings |
| Permissions | `ROLE_ADMIN` | `ROLE_SELLER` |

---

## 🚀 PROCHAINES ÉTAPES

Après avoir créé ces contrôleurs :

1. ✅ Redémarrer le backend Spring Boot
2. ✅ Tester avec Postman/Insomnia
3. ✅ Le frontend Angular fonctionnera automatiquement (déjà modifié)
4. ✅ Créer un produit depuis l'interface vendeur

---

**Date de création** : 18 décembre 2025  
**Statut** : À IMPLÉMENTER CÔTÉ BACKEND  
**Priorité** : 🔴 **CRITIQUE** - Bloque la fonctionnalité vendeur
