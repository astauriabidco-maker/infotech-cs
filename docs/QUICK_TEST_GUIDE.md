# 🚀 Guide de Test Rapide - Passeport Numérique

## ✅ Checklist Backend

Le backend est **COMPLET** ! Tous les fichiers nécessaires sont créés :
- ✅ Entités JPA (DigitalPassport, CarbonFootprint, etc.)
- ✅ DTOs (DigitalPassportDto, CreateDigitalPassportRequest)
- ✅ Repository (DigitalPassportRepository)
- ✅ Service (DigitalPassportService)
- ✅ Controller (DigitalPassportController)

## 📝 Étapes pour tester

### 1. Vérifier que le backend tourne

```bash
# Le backend Spring Boot doit être lancé sur http://localhost:8080
# Vérifiez les logs pour confirmer que les tables sont créées
```

### 2. Créer un passeport numérique via Swagger

1. Ouvrez Swagger UI : **http://localhost:8080/swagger-ui.html**

2. Trouvez la section **"Digital Passports"**

3. Cliquez sur **POST /api/digital-passports**

4. Authentifiez-vous si nécessaire (vendeur ou admin)

5. Utilisez le JSON de test fourni dans `/docs/digital-passport-test-data.json`

6. **IMPORTANT** : Remplacez `"productId": 1` par un ID de produit qui existe vraiment dans votre base de données

7. Cliquez sur **"Execute"**

### 3. Vérifier dans Angular

1. Assurez-vous que Angular tourne : `ng serve`

2. Ouvrez votre navigateur : **http://localhost:4200**

3. Naviguez vers : **http://localhost:4200/products/1/passport** (remplacez 1 par l'ID du produit que vous avez utilisé)

4. Vous devriez voir le passeport numérique avec 5 onglets !

## 🔍 Vérifications si ça ne marche pas

### Problème 1: "Digital passport not found for product: X"

**Cause** : Aucun passeport créé pour ce produit

**Solution** : 
```bash
# Option A : Créer via Swagger (voir étape 2)

# Option B : Créer via curl
curl -X POST http://localhost:8080/api/digital-passports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @docs/digital-passport-test-data.json
```

### Problème 2: Erreur CORS

**Cause** : Le backend bloque les requêtes depuis Angular

**Solution** : Le `@CrossOrigin` est déjà configuré dans le controller, mais vérifiez que c'est bien activé

### Problème 3: 401 Unauthorized lors de la création

**Cause** : Vous devez être authentifié en tant que SELLER ou ADMIN

**Solution** :
1. Connectez-vous via `/auth/login`
2. Récupérez le token JWT
3. Ajoutez-le dans Swagger (bouton "Authorize")

### Problème 4: "Materials percentages must sum to 100%"

**Cause** : La somme des pourcentages de matériaux n'est pas exactement 100

**Solution** : Vérifiez que dans votre JSON :
```json
"materials": [
  { "percentage": 40.0 },  // 40%
  { "percentage": 30.0 },  // 30%
  { "percentage": 25.0 },  // 25%
  { "percentage": 5.0 }    // 5%
]
// Total = 100% ✅
```

## 🗄️ Alternative : Insertion directe en base de données

Si vous préférez insérer directement via SQL (plus complexe) :

```sql
-- 1. Créer CarbonFootprint
INSERT INTO carbon_footprints (total_co2, manufacturing, transportation, usage, end_of_life, score)
VALUES (42.5, 30.0, 5.5, 5.0, 2.0, 'C');

-- 2. Créer Traceability
INSERT INTO traceability (origin_country, manufacturer, factory, transparency_score)
VALUES ('France', 'EcoTech France', 'Usine de Lyon', 95);

-- 3. Etc... (très fastidieux, préférez Swagger !)
```

## 🎯 Test Complet

### Scénario 1 : Consultation (PUBLIC - pas besoin d'authentification)

```bash
# Récupérer le passeport du produit 1
curl http://localhost:8080/api/digital-passports/product/1
```

### Scénario 2 : Création (SELLER/ADMIN - authentification requise)

```bash
# Créer un passeport pour le produit 2
curl -X POST http://localhost:8080/api/digital-passports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 2,
    "carbonFootprint": { ... },
    "traceability": { ... },
    ...
  }'
```

### Scénario 3 : Modification (SELLER/ADMIN)

```bash
# Modifier le passeport ID 1
curl -X PUT http://localhost:8080/api/digital-passports/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{ ... }'
```

### Scénario 4 : Suppression (ADMIN uniquement)

```bash
# Supprimer le passeport ID 1
curl -X DELETE http://localhost:8080/api/digital-passports/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎨 Visualisation attendue

Quand tout fonctionne, vous devriez voir :

```
┌────────────────────────────────────────┐
│   🌍 Passeport Numérique Produit      │
│   Transparence et traçabilité totale   │
└────────────────────────────────────────┘

[🌱 Impact Carbone] [📦 Matériaux] [🔧 Durabilité] [✓ Certifications] [♻️ Recyclage]

┌─────────────────────────────────┐
│  Score Carbone: C               │
│  42.5 kg CO₂                    │
│                                 │
│  Répartition:                   │
│  🏭 Fabrication: 30.0 kg CO₂   │
│  🚚 Transport: 5.5 kg CO₂      │
│  ⚡ Utilisation: 5.0 kg CO₂    │
│  ♻️ Fin de vie: 2.0 kg CO₂    │
│                                 │
│  Équivalences:                  │
│  🚗 354 km en voiture          │
│  🌳 2 arbres nécessaires       │
└─────────────────────────────────┘
```

## 🐛 Debugging

### Vérifier les logs backend

```bash
# Cherchez ces logs :
[INFO] Fetching digital passport for product ID: 1
[INFO] Digital passport created with ID: 1
```

### Vérifier la console navigateur

```javascript
// Ouvrez F12 et regardez l'onglet Network
// Vous devriez voir :
GET http://localhost:8080/api/digital-passports/product/1
Status: 200 OK
Response: { id: 1, productId: 1, carbonFootprint: {...}, ... }
```

### Vérifier la base de données

```sql
-- Combien de passeports existent ?
SELECT COUNT(*) FROM digital_passports;

-- Voir tous les passeports
SELECT id, product_id, created_at FROM digital_passports;

-- Détails d'un passeport
SELECT * FROM digital_passports WHERE product_id = 1;
```

## ✅ Checklist finale

- [ ] Backend Spring Boot lancé sur port 8080
- [ ] Angular lancé sur port 4200
- [ ] Au moins un produit existe en BDD (id = 1, 2, 3...)
- [ ] Un passeport créé via Swagger pour ce produit
- [ ] Route testée : http://localhost:4200/products/1/passport
- [ ] Les 5 onglets s'affichent correctement
- [ ] Les données correspondent au JSON envoyé

## 🎉 Succès !

Si vous voyez le passeport avec toutes les informations :
- ✅ Score carbone avec couleur (A=vert, E=rouge)
- ✅ Répartition CO₂ avec barres de progression
- ✅ Liste des matériaux avec badges (renouvelable, recyclé, etc.)
- ✅ Indice de réparabilité
- ✅ Certifications
- ✅ Points de collecte

**Félicitations ! Le système de passeport numérique fonctionne parfaitement ! 🚀**

## 📞 Besoin d'aide ?

Si après avoir suivi ce guide, ça ne marche toujours pas :

1. Vérifiez les logs backend (erreurs ?)
2. Vérifiez la console navigateur (erreurs réseau ?)
3. Vérifiez que le productId utilisé existe vraiment
4. Essayez avec un autre produit
5. Relancez backend ET frontend

---

**Prochaine étape** : Intégrer le bouton "Voir le passeport" dans la page de détail produit !
