# ⚡ GUIDE EXPRESS - Passeport Numérique

## 🎯 CE QUE VOUS DEVEZ FAIRE MAINTENANT

### Étape 1 : Créer un passeport via Swagger (2 minutes)

1. Ouvrez **http://localhost:8080/swagger-ui.html**

2. Trouvez la section **"Digital Passports"**

3. Cliquez sur **POST /api/digital-passports**

4. Cliquez **"Authorize"** et connectez-vous (SELLER ou ADMIN)

5. Cliquez **"Try it out"**

6. Remplacez le JSON par celui-ci :

```json
{
  "productId": 1,
  "carbonFootprint": {
    "totalCO2": 42.5,
    "manufacturing": 30.0,
    "transportation": 5.5,
    "usage": 5.0,
    "endOfLife": 2.0
  },
  "traceability": {
    "originCountry": "France",
    "manufacturer": "EcoTech France",
    "factory": "Usine de Lyon",
    "supplyChainJourney": ["Extraction - Alsace", "Fabrication - Lyon", "Assemblage - Paris"],
    "transparencyScore": 95
  },
  "materials": [
    { "name": "Aluminium recyclé", "percentage": 40.0, "renewable": false, "recycled": true, "recyclable": true, "origin": "France" },
    { "name": "Plastique bio", "percentage": 30.0, "renewable": true, "recycled": false, "recyclable": true, "origin": "Europe" },
    { "name": "Électronique", "percentage": 25.0, "renewable": false, "recycled": false, "recyclable": true, "origin": "Asie" },
    { "name": "Verre", "percentage": 5.0, "renewable": false, "recycled": true, "recyclable": true, "origin": "Europe" }
  ],
  "durability": {
    "expectedLifespanYears": 7,
    "repairabilityScore": 9.2,
    "sparePartsAvailable": true,
    "warrantyYears": 3,
    "softwareUpdates": true
  },
  "certifications": [
    { "name": "Écolabel Européen", "issuer": "Commission Européenne", "validUntil": "2026-12-31", "logoUrl": "", "verificationUrl": "", "type": "ENVIRONMENTAL" }
  ],
  "recyclingInfo": {
    "recyclablePercentage": 95.0,
    "instructions": "Déposez dans un point de collecte agréé.",
    "takeBackProgram": true,
    "collectionPoints": [
      { "name": "Ecosystem Paris", "address": "15 Rue Montmartre, Paris", "distance": "2 km", "acceptedMaterials": ["Électronique", "Batteries"] }
    ]
  }
}
```

7. **IMPORTANT** : Si le produit ID 1 n'existe pas, changez `"productId": 1` par un ID qui existe

8. Cliquez **"Execute"**

9. Vous devez voir **201 Created** ✅

### Étape 2 : Voir le passeport (30 secondes)

1. Ouvrez votre navigateur

2. Allez sur : **http://localhost:4200/products/1/passport**

3. TADAA ! 🎉 Vous devriez voir le passeport avec 5 onglets !

---

## ❌ SI ÇA NE MARCHE PAS

### Erreur : "Product not found" ou 404

**Problème** : Le produit ID 1 n'existe pas

**Solution** :
```sql
-- Trouvez un produit qui existe
SELECT id, name FROM products LIMIT 5;

-- Utilisez cet ID dans le JSON
```

### Erreur : "Digital passport not found"

**Problème** : Vous n'avez pas créé le passeport via Swagger

**Solution** : Recommencez l'Étape 1 ci-dessus

### Erreur : "Materials percentages must sum to 100%"

**Problème** : Les pourcentages ne font pas 100

**Solution** : Vérifiez que 40 + 30 + 25 + 5 = 100 ✅

### Page blanche

**Problème** : Backend pas lancé ou mauvaise URL

**Solution** :
- Vérifiez que Spring Boot tourne sur port 8080
- Utilisez exactement : `http://localhost:4200/products/1/passport`

---

## 🎯 CE QUI SE PASSE ENSUITE

Une fois que vous voyez le passeport :

1. **Testez les onglets** : Cliquez sur Matériaux, Durabilité, etc.

2. **Créez plus de passeports** : Répétez l'Étape 1 pour d'autres produits

3. **Intégrez dans votre app** :
   - Ajoutez un bouton "Voir passeport" dans product-detail
   - Ajoutez un badge "🌱 Éco" sur les produits qui ont un bon score
   - Ajoutez un filtre "Produits éco-responsables"

4. **Lisez la doc complète** : `docs/DIGITAL_PASSPORT_INTEGRATION_GUIDE.md`

---

## ✅ RÉSUMÉ

```
✅ Backend : FAIT (tout est prêt)
✅ Frontend : FAIT (composant créé)
✅ Route : FAIT (/products/:id/passport)
❌ Données : PAS ENCORE (créez via Swagger !)
```

**Prochaine action** : Créer un passeport via Swagger et tester la route !

---

**Temps total** : 2-3 minutes  
**Difficulté** : Facile  
**Résultat** : Passeport numérique fonctionnel ! 🚀
