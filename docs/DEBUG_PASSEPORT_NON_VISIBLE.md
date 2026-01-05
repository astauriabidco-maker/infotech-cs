# 🔍 DÉBOGAGE - Passeport créé mais non visible

## ✅ CE QUI FONCTIONNE

Votre backend a bien créé le passeport :
```
✅ REST request to create digital passport for product: 1
✅ Creating digital passport for product ID: 1
```

## 🔍 ÉTAPES DE VÉRIFICATION

### 1️⃣ Vérifier que le passeport existe en BDD

Exécutez cette requête SQL :

```sql
SELECT 
    dp.id,
    dp.product_id,
    cf.total_co2,
    cf.score,
    t.manufacturer
FROM digital_passports dp
LEFT JOIN carbon_footprints cf ON dp.carbon_footprint_id = cf.id
LEFT JOIN traceability t ON dp.traceability_id = t.id
WHERE dp.product_id = 1;
```

**Résultat attendu** :
```
| id | product_id | total_co2 | score | manufacturer    |
|----|------------|-----------|-------|-----------------|
| 1  | 1          | 42.5      | C     | EcoTech France  |
```

Si vous voyez ça → Le passeport est bien en BDD ✅

### 2️⃣ Tester l'endpoint de lecture

Ouvrez un terminal et testez :

```bash
curl http://localhost:8080/api/digital-passports/product/1
```

**OU** ouvrez dans votre navigateur :
```
http://localhost:8080/api/digital-passports/product/1
```

**Résultat attendu** : Vous devez voir un JSON complet avec toutes les données.

Si vous voyez le JSON → L'API fonctionne ✅

### 3️⃣ Vérifier l'URL Angular

Assurez-vous d'utiliser **EXACTEMENT** cette URL :

```
http://localhost:4200/products/1/passport
```

**PAS** :
- ❌ `http://localhost:4200/passport/1`
- ❌ `http://localhost:4200/products/passport/1`
- ❌ `http://localhost:4200/digital-passport/1`

### 4️⃣ Ouvrir la console navigateur (F12)

1. Ouvrez `http://localhost:4200/products/1/passport`
2. Appuyez sur **F12**
3. Allez dans l'onglet **Network**
4. Rechargez la page (**Ctrl+R** ou **Cmd+R**)
5. Cherchez la requête vers `/api/digital-passports/product/1`

**Vérifiez** :

#### Cas A : La requête apparaît avec status 200 ✅
```
GET http://localhost:8080/api/digital-passports/product/1
Status: 200 OK
```
→ **Problème frontend** : Le composant ne s'affiche pas correctement

#### Cas B : La requête apparaît avec status 404 ❌
```
GET http://localhost:8080/api/digital-passports/product/1
Status: 404 Not Found
```
→ **Problème backend** : Le passeport n'a pas été sauvegardé

#### Cas C : La requête n'apparaît pas du tout ❌
→ **Problème de route** : Angular ne charge pas le composant

### 5️⃣ Vérifier l'onglet Console (F12 → Console)

Cherchez des erreurs :

```javascript
// Erreur typique si le passeport n'existe pas :
"Digital passport not found for product: 1"

// Erreur CORS :
"Access to XMLHttpRequest blocked by CORS policy"

// Erreur de connexion :
"Failed to fetch"
```

## 🛠️ SOLUTIONS SELON LE PROBLÈME

### Problème 1 : Status 404 (Not Found)

**Cause** : Le passeport n'a pas été sauvegardé en BDD

**Solution** :
```sql
-- Vérifiez les logs complets du backend
-- Cherchez des erreurs après "Creating digital passport for product ID: 1"

-- Vérifiez manuellement en BDD
SELECT * FROM digital_passports WHERE product_id = 1;

-- Si vide, recréez via Swagger
```

### Problème 2 : La requête HTTP n'apparaît pas

**Cause** : Le composant ne se charge pas

**Vérification** :
1. Ouvrez `http://localhost:4200/products/1/passport`
2. Faites **Ctrl+U** (voir le source)
3. Cherchez "digital-passport"

**Si absent** :
- La route n'est pas configurée
- Le composant n'est pas standalone
- Erreur de compilation Angular

**Solution** : Vérifiez les erreurs Angular dans le terminal où vous avez lancé `ng serve`

### Problème 3 : CORS Error

**Cause** : Le backend bloque les requêtes depuis localhost:4200

**Solution** : Vérifiez que le controller a bien `@CrossOrigin` (déjà fait normalement)

### Problème 4 : La page s'affiche mais reste en loading

**Cause** : Le composant attend indéfiniment la réponse

**Solution** :
1. Vérifiez la console pour des erreurs
2. Vérifiez que le backend est bien sur port 8080
3. Testez manuellement : `curl http://localhost:8080/api/digital-passports/product/1`

## ✅ TEST RAPIDE EN 30 SECONDES

Exécutez ces 3 commandes :

```bash
# 1. Le backend répond-il ?
curl http://localhost:8080/api/digital-passports/product/1

# 2. Angular tourne-t-il ?
curl http://localhost:4200

# 3. La route existe-t-elle ?
curl http://localhost:4200/products/1/passport
```

## 🎯 ACTION IMMÉDIATE

**Faites ceci MAINTENANT** :

1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:8080/api/digital-passports/product/1`
3. Prenez un screenshot de ce que vous voyez
4. Puis allez sur : `http://localhost:4200/products/1/passport`
5. Appuyez sur F12 → Network
6. Rechargez la page
7. Prenez un screenshot

Envoyez-moi les 2 screenshots et je vous dirai exactement quel est le problème.

## 📊 CHECKLIST DE DÉBOGAGE

- [ ] ✅ Passeport créé (logs backend confirment)
- [ ] Passeport existe en BDD (SELECT vérifié)
- [ ] Endpoint backend accessible (curl OK)
- [ ] Angular tourne sur port 4200
- [ ] URL correcte : `/products/1/passport`
- [ ] Console navigateur vérifiée (F12)
- [ ] Onglet Network vérifié (F12)
- [ ] Aucune erreur visible

---

**Si TOUT est ✅ mais toujours rien** :

Essayez de **hard refresh** :
- Windows/Linux : **Ctrl + Shift + R**
- Mac : **Cmd + Shift + R**

Ou videz le cache :
- Chrome : **Ctrl/Cmd + Shift + Delete** → Vider le cache
