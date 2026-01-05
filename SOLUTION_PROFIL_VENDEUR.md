# ✅ SOLUTION - Créer le Profil Vendeur

## 🎯 Problème Identifié

```
java.lang.RuntimeException: Profil vendeur non trouvé. 
Vous devez avoir un profil vendeur pour créer des produits.
```

**Cause** : L'utilisateur `vendeur@gmail.com` (ID: 46) n'a pas de profil vendeur dans la table `seller_profile`.

---

## 🔧 SOLUTION IMMÉDIATE

### **Étape 1 : Créer le profil vendeur dans la base de données**

Exécutez cette requête SQL :

```sql
-- Vérifier d'abord l'ID de l'utilisateur
SELECT id, email, full_name FROM users WHERE email = 'vendeur@gmail.com';

-- Si l'ID est 46, exécuter cette insertion
INSERT INTO seller_profile (
    user_id, 
    shop_name, 
    description, 
    rating,
    created_at, 
    updated_at
) VALUES (
    46,  -- ⚠️ Remplacer par l'ID réel si différent
    'Ma Boutique Infotech', 
    'Boutique de produits électroniques reconditionnés de qualité',
    4.5,
    NOW(), 
    NOW()
);
```

### **Étape 2 : Vérifier que le profil a été créé**

```sql
SELECT * FROM seller_profile WHERE user_id = 46;
```

Vous devriez voir une ligne avec :
- `id`: Un ID auto-généré (ex: 1)
- `user_id`: 46
- `shop_name`: "Ma Boutique Infotech"
- `rating`: 4.5

### **Étape 3 : Tester à nouveau**

1. Retournez sur l'application Angular
2. Allez sur `/seller/products`
3. Cliquez sur "Ajouter un produit"
4. Remplissez le formulaire
5. ✅ Ça devrait fonctionner maintenant !

---

## 🎨 SOLUTION À LONG TERME (Optionnel)

### **Option A : Créer automatiquement le profil au premier login**

Modifier `AuthController.java` pour créer automatiquement un profil vendeur :

```java
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody SignupRequest request) {
    // ... code existant de création utilisateur
    
    // Si l'utilisateur a le rôle SELLER, créer automatiquement le profil
    if (request.getRoles().contains("SELLER")) {
        SellerProfile sellerProfile = SellerProfile.builder()
                .user(newUser)
                .shopName(request.getFullName() + "'s Shop")
                .description("Nouvelle boutique")
                .rating(0.0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        sellerProfileRepository.save(sellerProfile);
    }
    
    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
}
```

### **Option B : Créer un endpoint dédié pour devenir vendeur**

```java
@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerProfileController {

    private final SellerProfileRepository sellerProfileRepository;
    private final UserRepository userRepository;

    /**
     * Créer ou récupérer mon profil vendeur
     */
    @PostMapping("/profile/create")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<SellerProfileDto> createProfile(
            @RequestBody CreateSellerProfileRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Vérifier si le profil existe déjà
        Optional<SellerProfile> existing = sellerProfileRepository.findByUser(user);
        if (existing.isPresent()) {
            return ResponseEntity.ok(toDto(existing.get()));
        }
        
        // Créer le nouveau profil
        SellerProfile profile = SellerProfile.builder()
                .user(user)
                .shopName(request.getShopName())
                .description(request.getDescription())
                .rating(0.0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        profile = sellerProfileRepository.save(profile);
        
        return ResponseEntity.ok(toDto(profile));
    }
    
    /**
     * Récupérer mon profil vendeur
     */
    @GetMapping("/profile/me")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<SellerProfileDto> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        SellerProfile profile = sellerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller profile not found"));
        
        return ResponseEntity.ok(toDto(profile));
    }
    
    private SellerProfileDto toDto(SellerProfile profile) {
        return SellerProfileDto.builder()
                .id(profile.getId())
                .shopName(profile.getShopName())
                .description(profile.getDescription())
                .rating(profile.getRating())
                .build();
    }
}
```

---

## 📊 DONNÉES DE TEST COMPLÈTES

Si vous voulez créer plusieurs vendeurs de test :

```sql
-- Vendeur 1
INSERT INTO seller_profile (user_id, shop_name, description, rating, created_at, updated_at) 
VALUES (46, 'Ma Boutique Infotech', 'Produits électroniques reconditionnés', 4.5, NOW(), NOW());

-- Si vous avez d'autres utilisateurs vendeurs
-- Vendeur 2 (par exemple)
INSERT INTO seller_profile (user_id, shop_name, description, rating, created_at, updated_at) 
VALUES (47, 'TechStore Pro', 'Smartphones et accessoires', 4.8, NOW(), NOW());

-- Vendeur 3
INSERT INTO seller_profile (user_id, shop_name, description, rating, created_at, updated_at) 
VALUES (48, 'Reconditionné Premium', 'Appareils Apple reconditionnés', 4.9, NOW(), NOW());
```

---

## ✅ CHECKLIST DE VÉRIFICATION

Après avoir exécuté la requête SQL :

- [ ] `SELECT * FROM seller_profile WHERE user_id = 46;` retourne une ligne
- [ ] Rafraîchir la page Angular `/seller/products`
- [ ] Cliquer sur "Ajouter un produit"
- [ ] Remplir le formulaire avec des données de test
- [ ] Ajouter une ou plusieurs images
- [ ] Cliquer sur "Créer le produit"
- [ ] ✅ Le produit doit être créé avec succès

---

## 🎯 TESTS RAPIDES

### **Test 1 : Produit Simple**
```
Titre: iPhone 13 Pro 128GB
Marque: Apple
Modèle: iPhone 13 Pro
État: Excellent
Prix: 699.99
Quantité: 3
Description: iPhone 13 Pro reconditionné, état impeccable
Note: Batterie 95%, écran neuf
```

### **Test 2 : Vérifier dans la base**

Après création, vérifier :

```sql
-- Voir le produit créé
SELECT * FROM product ORDER BY id DESC LIMIT 1;

-- Voir le listing créé
SELECT * FROM listing ORDER BY id DESC LIMIT 1;

-- Voir les images uploadées
SELECT * FROM product_image WHERE product_id = (
    SELECT id FROM product ORDER BY id DESC LIMIT 1
);
```

---

## 🚀 RÉSULTAT ATTENDU

Après avoir créé le profil vendeur, vous devriez pouvoir :

1. ✅ Créer des produits sans erreur 500
2. ✅ Uploader des images sur Cloudinary
3. ✅ Voir vos produits dans la grille
4. ✅ Supprimer vos produits
5. ✅ Voir les statistiques dans le dashboard

---

## 💡 AMÉLIORATIONS FUTURES

### **Interface pour créer le profil vendeur**

Créer une page `/seller/setup` pour que l'utilisateur puisse configurer son profil :

```typescript
// seller-setup.component.ts
export class SellerSetupComponent {
  setupForm = {
    shopName: '',
    description: '',
    address: '',
    phone: ''
  };
  
  createProfile() {
    this.sellerService.createProfile(this.setupForm).subscribe({
      next: () => {
        this.router.navigate(['/seller/dashboard']);
      },
      error: (err) => {
        console.error('Erreur création profil:', err);
      }
    });
  }
}
```

---

**Date** : 18 décembre 2025  
**Problème** : Profil vendeur manquant  
**Solution** : Exécuter l'INSERT SQL ci-dessus  
**Statut** : ✅ Prêt à tester
