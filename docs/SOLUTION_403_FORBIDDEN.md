# 🚨 PROBLÈME IDENTIFIÉ : HTTP 403 Forbidden

## 🔍 Le Diagnostic

Quand Angular essaie de récupérer le passeport :

```bash
GET http://localhost:8080/api/digital-passports/product/1
→ HTTP 403 Forbidden ❌
```

**Cause** : L'endpoint de lecture nécessite une authentification, mais un utilisateur non connecté doit pouvoir voir le passeport d'un produit.

## ✅ La Solution (Backend)

### Option 1 : Modifier le Controller (RECOMMANDÉ)

Dans `DigitalPassportController.java`, l'endpoint GET doit être **PUBLIC** :

```java
@RestController
@RequestMapping("/api/digital-passports")
@CrossOrigin(origins = "http://localhost:4200")
public class DigitalPassportController {

    // ❌ AVANT (nécessite authentification)
    @GetMapping("/product/{productId}")
    @PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    public ResponseEntity<DigitalPassportDto> getByProductId(@PathVariable Long productId) {
        // ...
    }

    // ✅ APRÈS (public - accessible à tous)
    @GetMapping("/product/{productId}")
    // PAS de @PreAuthorize ici !
    public ResponseEntity<DigitalPassportDto> getByProductId(@PathVariable Long productId) {
        log.info("REST request to get digital passport for product: {}", productId);
        DigitalPassportDto passport = digitalPassportService.getByProductId(productId);
        return ResponseEntity.ok(passport);
    }

    // Les endpoints de modification restent protégés
    @PostMapping
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<DigitalPassportDto> create(@Valid @RequestBody CreateDigitalPassportRequest request) {
        // ...
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<DigitalPassportDto> update(@PathVariable Long id, @Valid @RequestBody CreateDigitalPassportRequest request) {
        // ...
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // ...
    }
}
```

### Option 2 : Configurer SecurityConfig

Si vous voulez garder toutes les routes protégées par défaut et autoriser seulement certaines :

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // ✅ Routes publiques
                .requestMatchers("/api/digital-passports/product/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/products/**").permitAll() // Si les produits sont publics
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // 🔒 Toutes les autres routes nécessitent authentification
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults());
            
        return http.build();
    }
}
```

## 🧪 Vérification

Après modification du backend, testez :

```bash
# Doit retourner le JSON du passeport (pas 403)
curl http://localhost:8080/api/digital-passports/product/1
```

**Résultat attendu** :
```json
{
  "id": 1,
  "productId": 1,
  "carbonFootprint": {
    "totalCO2": 42.5,
    "manufacturing": 30.0,
    "transportation": 5.5,
    "usage": 5.0,
    "endOfLife": 2.0,
    "score": "C"
  },
  "traceability": {
    "originCountry": "France",
    "manufacturer": "EcoTech France",
    // ... reste des données
  }
}
```

Si vous voyez ce JSON → **Problème résolu** ✅

## 🎯 Actions Immédiates

### Pour l'équipe Backend :

1. **Ouvrir** `DigitalPassportController.java`
2. **Trouver** la méthode `getByProductId`
3. **Supprimer** le `@PreAuthorize` de cette méthode
4. **Redémarrer** le backend
5. **Tester** : `curl http://localhost:8080/api/digital-passports/product/1`

### Pour toi (Frontend) :

Une fois que le backend aura corrigé le 403 :

1. **Rafraîchir** la page Angular : `http://localhost:4200/products/1/passport`
2. **Le passeport devrait s'afficher** immédiatement

## 📝 Justification

**Pourquoi l'endpoint GET doit être public ?**

1. ✅ Les acheteurs (non connectés) doivent voir l'impact environnemental avant d'acheter
2. ✅ C'est une donnée de transparence, pas une donnée sensible
3. ✅ Comme les fiches produits, le passeport est public
4. 🔒 Mais seuls les VENDEURS peuvent créer/modifier un passeport
5. 🔒 Seuls les ADMINS peuvent supprimer un passeport

**Comparaison** :
```
📖 Lecture du passeport → PUBLIC (tout le monde)
✏️ Création du passeport → SELLER ou ADMIN
📝 Modification du passeport → SELLER ou ADMIN  
🗑️ Suppression du passeport → ADMIN uniquement
```

## 🚀 Après la Correction

Dès que le 403 sera corrigé, votre application Angular affichera automatiquement :

- 🌍 **Empreinte carbone** : 42.5 kg CO₂ (Score C)
- 🏭 **Traçabilité** : Fabriqué par EcoTech France
- ♻️ **Matériaux** : 40% Aluminium recyclé, 30% Plastique bio-sourcé
- 🔧 **Durabilité** : Réparabilité 9.2/10 (Indice A)
- ✅ **Certifications** : Écolabel Européen, Fair Trade
- ♻️ **Recyclage** : 95% recyclable, 3 points de collecte

---

**En résumé** : Le passeport a bien été créé en base de données. Le problème est que Spring Security bloque l'accès en lecture (403). Il faut autoriser l'accès public à l'endpoint GET.
