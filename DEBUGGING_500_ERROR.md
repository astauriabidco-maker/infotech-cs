# 🔍 DÉBOGAGE ERREUR 500 - Backend

## ✅ PROGRÈS RÉALISÉS

**Avant** : ❌ 403 Forbidden (pas les bonnes permissions)  
**Maintenant** : ⚠️ 500 Internal Server Error (backend fonctionne mais erreur dans le code)

**C'est bon signe !** L'authentification et les endpoints fonctionnent. Il y a juste un bug à corriger.

---

## 🎯 PROCHAINES ÉTAPES POUR DÉBOGUER

### **1. Vérifier les Logs Backend Spring Boot** ⭐ URGENT

Dans votre console/terminal où tourne Spring Boot, vous devriez voir :
```
ERROR ... : ...
Stack trace: ...
```

**Les erreurs courantes à chercher** :

#### **A) NullPointerException - Profil Vendeur manquant**
```java
java.lang.NullPointerException
  at SellerProductController.createProduct(...)
  at line: sellerProfile.getId()...
```

**Cause** : L'utilisateur connecté n'a pas de `SellerProfile` associé

**Solution** :
```sql
-- Vérifier si l'utilisateur a un profil vendeur
SELECT * FROM seller_profile WHERE user_id = 46;

-- Si vide, créer le profil vendeur
INSERT INTO seller_profile (user_id, shop_name, created_at, updated_at) 
VALUES (46, 'Ma Boutique', NOW(), NOW());
```

#### **B) Repository Method Not Found**
```java
java.lang.IllegalArgumentException: No property 'findByUser' found
```

**Cause** : La méthode `findByUser()` n'existe pas dans `SellerProfileRepository`

**Solution** : Ajouter dans `SellerProfileRepository.java`
```java
Optional<SellerProfile> findByUser(User user);
```

#### **C) Category Not Found**
```java
java.lang.NullPointerException: category is null
```

**Cause** : Pas de catégorie dans la base de données

**Solution** : 
```sql
-- Créer des catégories par défaut
INSERT INTO category (name, description) VALUES 
('Électronique', 'Smartphones, tablettes, ordinateurs'),
('Informatique', 'PC, composants, périphériques'),
('Téléphonie', 'Téléphones et accessoires');
```

---

## 📋 CHECKLIST DE VÉRIFICATION

### **Étape 1 : Logs Backend**
```bash
# Dans le terminal où tourne Spring Boot
# Copier TOUTE la stack trace de l'erreur et me la partager
```

### **Étape 2 : Vérifier la Base de Données**
```sql
-- 1. L'utilisateur existe-t-il ?
SELECT * FROM users WHERE email = 'vendeur@gmail.com';

-- 2. A-t-il un profil vendeur ?
SELECT * FROM seller_profile WHERE user_id = 46;

-- 3. Y a-t-il des catégories ?
SELECT * FROM category;

-- 4. Y a-t-il des produits ?
SELECT * FROM product;
```

### **Étape 3 : Vérifier le Contrôleur**

**SellerProductController.java** doit ressembler à :
```java
@RestController
@RequestMapping("/api/seller/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
public class SellerProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SellerProfileRepository sellerProfileRepository; // ⚠️ Important
    private final UserRepository userRepository; // ⚠️ Important

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(
            @RequestBody CreateProductRequest req,
            Authentication authentication // ⚠️ Important pour récupérer l'utilisateur
    ) {
        // 1. Récupérer l'utilisateur connecté
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // 2. Récupérer son profil vendeur
        SellerProfile sellerProfile = sellerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller profile not found"));
        
        // 3. Récupérer la catégorie (optionnel)
        Category cat = null;
        if (req.getCategoryId() != null) {
            cat = categoryRepository.findById(req.getCategoryId()).orElse(null);
        }
        
        // 4. Créer le produit
        Product p = Product.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .brand(req.getBrand())
                .model(req.getModel())
                .condition(req.getCondition())
                .category(cat)
                .build();
        
        p = productRepository.save(p);
        
        // 5. Retourner le DTO
        ProductDto dto = ProductDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .brand(p.getBrand())
                .model(p.getModel())
                .condition(p.getCondition())
                .description(p.getDescription())
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .images(p.getImages() != null ? 
                        p.getImages().stream()
                            .map(ProductImage::getUrl)
                            .collect(Collectors.toList()) 
                        : new ArrayList<>())
                .build();
        
        return ResponseEntity.ok(dto);
    }
}
```

---

## 🔧 CORRECTIONS POSSIBLES

### **Solution 1 : Créer le Profil Vendeur Manquant**

Si l'erreur dit "Seller profile not found" :

```sql
-- Créer le profil vendeur pour l'utilisateur ID 46
INSERT INTO seller_profile (
    user_id, 
    shop_name, 
    description, 
    rating,
    created_at, 
    updated_at
) VALUES (
    46, 
    'Boutique de vendeur@gmail.com', 
    'Ma boutique de produits reconditionnés',
    0.0,
    NOW(), 
    NOW()
);
```

### **Solution 2 : Modifier le Contrôleur pour Gérer les Cas Null**

```java
@PostMapping
public ResponseEntity<ProductDto> createProduct(
        @RequestBody CreateProductRequest req,
        Authentication authentication
) {
    try {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        
        // Vérifier si le profil vendeur existe
        SellerProfile sellerProfile = sellerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException(
                    "Seller profile not found for user: " + email + 
                    ". Please create a seller profile first."
                ));
        
        // Catégorie optionnelle
        Category cat = null;
        if (req.getCategoryId() != null) {
            cat = categoryRepository.findById(req.getCategoryId()).orElse(null);
        }
        
        // Créer le produit
        Product p = Product.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .brand(req.getBrand())
                .model(req.getModel())
                .condition(req.getCondition())
                .category(cat)
                .build();
        
        p = productRepository.save(p);
        
        // DTO avec vérification null sur images
        List<String> imageUrls = new ArrayList<>();
        if (p.getImages() != null) {
            imageUrls = p.getImages().stream()
                    .map(ProductImage::getUrl)
                    .collect(Collectors.toList());
        }
        
        ProductDto dto = ProductDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .brand(p.getBrand())
                .model(p.getModel())
                .condition(p.getCondition())
                .description(p.getDescription())
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .images(imageUrls)
                .build();
        
        return ResponseEntity.ok(dto);
        
    } catch (Exception e) {
        // Log l'erreur complète
        e.printStackTrace();
        throw new RuntimeException("Error creating product: " + e.getMessage(), e);
    }
}
```

### **Solution 3 : Vérifier SellerProfileRepository**

```java
public interface SellerProfileRepository extends JpaRepository<SellerProfile, Long> {
    
    /**
     * Trouver le profil vendeur par utilisateur
     */
    Optional<SellerProfile> findByUser(User user);
}
```

---

## 📊 DONNÉES DE TEST

### **Créer un Jeu de Données Complet**

```sql
-- 1. Créer des catégories
INSERT INTO category (id, name, description) VALUES 
(1, 'Téléphonie', 'Smartphones et accessoires'),
(2, 'Informatique', 'Ordinateurs et périphériques'),
(3, 'Électronique', 'TV, audio, photo');

-- 2. Vérifier l'utilisateur vendeur
SELECT id, email, full_name FROM users WHERE email = 'vendeur@gmail.com';
-- Si l'ID n'est pas 46, remplacer dans les commandes suivantes

-- 3. Créer le profil vendeur
INSERT INTO seller_profile (id, user_id, shop_name, description, rating, created_at, updated_at) 
VALUES (1, 46, 'Ma Super Boutique', 'Produits reconditionnés de qualité', 4.5, NOW(), NOW());

-- 4. Créer un produit de test manuellement
INSERT INTO product (id, title, brand, model, condition, description, category_id) 
VALUES (1, 'iPhone 13 Pro', 'Apple', 'iPhone 13 Pro', 'Excellent', 'iPhone reconditionné', 1);

-- 5. Créer un listing de test
INSERT INTO listing (id, product_id, seller_id, price, quantity, condition_note, active) 
VALUES (1, 1, 1, 699.99, 5, 'Écran neuf, batterie 95%', true);
```

---

## 🎯 ACTIONS À FAIRE MAINTENANT

1. **Copier la Stack Trace complète** depuis la console Spring Boot
2. **Exécuter ces requêtes SQL** pour vérifier les données :
   ```sql
   SELECT * FROM users WHERE email = 'vendeur@gmail.com';
   SELECT * FROM seller_profile WHERE user_id = 46;
   SELECT * FROM category;
   ```
3. **Me partager les résultats** pour que je puisse vous aider précisément
4. **Vérifier que `SellerProfileRepository.findByUser()` existe**

---

## 💡 ASTUCE DE DÉBOGAGE

Ajouter des logs dans le contrôleur :

```java
@PostMapping
public ResponseEntity<ProductDto> createProduct(
        @RequestBody CreateProductRequest req,
        Authentication authentication
) {
    System.out.println("🔍 DEBUG - Email: " + authentication.getName());
    System.out.println("🔍 DEBUG - Request: " + req);
    
    String email = authentication.getName();
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> {
                System.out.println("❌ ERROR - User not found: " + email);
                return new RuntimeException("User not found");
            });
    
    System.out.println("✅ DEBUG - User found: " + user.getId());
    
    SellerProfile sellerProfile = sellerProfileRepository.findByUser(user)
            .orElseThrow(() -> {
                System.out.println("❌ ERROR - Seller profile not found for user: " + user.getId());
                return new RuntimeException("Seller profile not found");
            });
    
    System.out.println("✅ DEBUG - Seller profile found: " + sellerProfile.getId());
    
    // ... reste du code
}
```

---

**Date** : 18 décembre 2025  
**Erreur** : 500 Internal Server Error  
**Prochaine étape** : Analyser la stack trace backend
