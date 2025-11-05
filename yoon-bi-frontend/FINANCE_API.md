# API Gestion Financière - Documentation

## ✅ Corrections appliquées

### 1. Logs de débogage ajoutés

**Frontend (`src/services/api.ts`)**
- Logs pour chaque appel GET avec l'URL
- Logs du statut HTTP de la réponse
- Logs des données reçues
- Logs d'erreurs détaillés

**Frontend (`src/components/admin/Financial.tsx`)**
- Logs pour le chargement des stats
- Logs pour le chargement des paiements
- Logs pour le chargement des trajets en attente
- Affichage d'erreur visible dans l'UI

### 2. Structure de l'API Finance

#### Endpoints disponibles

**Backend (`src/routes/finance.routes.js`)**

1. **GET `/api/admin/finance/stats`**
   - Statistiques financières agrégées
   - Paramètres: `period` (month|quarter|year|custom), `from`, `to`
   - Retourne: KPI + statistiques mensuelles

2. **GET `/api/admin/finance/payments`**
   - Liste paginée des paiements
   - Paramètres: `status` (all|success|pending), `page`, `limit`, `search`
   - Retourne: Liste des paiements avec pagination

3. **GET `/api/admin/finance/pending-trips`**
   - Trajets payés en attente de validation client
   - Retourne: Liste des trajets en attente

### 3. Format des données

#### Stats Response
```json
{
  "success": true,
  "kpi": {
    "totalRevenue": 150000,
    "commission": 22500,
    "paidToDrivers": 127500,
    "pendingValidation": 25000
  },
  "monthly": {
    "completedTrips": 45,
    "totalTripPrice": 150000,
    "commission": 22500,
    "netPaid": 127500
  }
}
```

#### Payments Response
```json
{
  "success": true,
  "items": [
    {
      "id": "PAY-12345",
      "date": "05/11/2025 14:30:00",
      "driver": "Fatou Sall",
      "driverAvatar": "FS",
      "trip": "Dakar → Thiès",
      "client": "Moussa Diop",
      "totalPrice": 5000,
      "commission": 750,
      "amountPaid": 4250,
      "paymentMethod": "Wave",
      "phone": "771234567",
      "status": "success"
    }
  ],
  "total": 100,
  "totalPages": 10,
  "page": 1
}
```

#### Pending Trips Response
```json
{
  "success": true,
  "items": [
    {
      "trip": "Dakar → Saint-Louis",
      "client": "Awa Diallo",
      "driver": "Ibrahima Fall",
      "tripDate": "05/11/2025",
      "amount": 8000
    }
  ]
}
```

## 🔍 Débogage

### Console logs à vérifier

#### Au chargement de la page Financial

```
[FINANCE] Chargement des stats pour période: month
[API GET] /api/admin/finance/stats?period=month
[API GET] Statut: 200 /api/admin/finance/stats?period=month
[API GET] ✓ Succès: /api/admin/finance/stats?period=month {...}
[FINANCE] Stats reçues: {...}
[FINANCE] ✓ Stats calculées: { totalRevenue: 0, commission: 0, ... }

[FINANCE] Chargement paiements: { filtreStatut: 'all', pageCourante: 1, recherche: '' }
[API GET] /api/admin/finance/payments?status=all&page=1&limit=10&search=
[API GET] Statut: 200 /api/admin/finance/payments?status=all&page=1&limit=10&search=
[API GET] ✓ Succès: /api/admin/finance/payments?status=all&page=1&limit=10&search= {...}
[FINANCE] Paiements reçus: {...}
[FINANCE] ✓ Paiements chargés: 0

[FINANCE] Chargement trajets en attente...
[API GET] /api/admin/finance/pending-trips
[API GET] Statut: 200 /api/admin/finance/pending-trips
[API GET] ✓ Succès: /api/admin/finance/pending-trips {...}
[FINANCE] Trajets en attente reçus: [...]
[FINANCE] ✓ Trajets en attente chargés: 0
```

### En cas d'erreur

```
[API GET] /api/admin/finance/stats?period=month
[API GET] Statut: 401 /api/admin/finance/stats?period=month
[API GET] Erreur: 401 {"success":false,"message":"Non autorisé"} /api/admin/finance/stats?period=month
[API GET] ✗ Exception: Error: HTTP 401 for /api/admin/finance/stats?period=month — {"success":false,"message":"Non autorisé"}
[FINANCE] ✗ Erreur stats: Error: HTTP 401 for /api/admin/finance/stats?period=month
```

## 🧪 Tests à effectuer

### Test 1: Vérifier que le backend est démarré
```bash
# Dans le terminal backend
cd c:\Users\hp\Desktop\projet fin\back\yoon-bi-backend
npm start
```

Vérifier que vous voyez:
```
╔═══════════════════════════════════════════════════════════╗
║         🚀 SERVEUR YOON-BI DÉMARRÉ AVEC SUCCÈS           ║
╠═══════════════════════════════════════════════════════════╣
║  Port:        3000                                        ║
║  URL Local:   http://localhost:3000                       ║
╚═══════════════════════════════════════════════════════════╝
```

### Test 2: Vérifier les endpoints manuellement

**Test Stats:**
```bash
curl -H "Authorization: Bearer VOTRE_TOKEN" http://localhost:3000/api/admin/finance/stats?period=month
```

**Test Payments:**
```bash
curl -H "Authorization: Bearer VOTRE_TOKEN" http://localhost:3000/api/admin/finance/payments?status=all&page=1&limit=10
```

**Test Pending Trips:**
```bash
curl -H "Authorization: Bearer VOTRE_TOKEN" http://localhost:3000/api/admin/finance/pending-trips
```

### Test 3: Vérifier dans le frontend

1. **Connectez-vous** avec un compte ADMIN
2. **Naviguez** vers "Gestion financière"
3. **Ouvrez la console** (F12)
4. **Vérifiez les logs** `[FINANCE]` et `[API GET]`
5. **Vérifiez** que les données s'affichent

## 🔧 Problèmes courants

### Erreur 401 (Non autorisé)
- **Cause:** Token manquant ou invalide
- **Solution:** Déconnectez-vous et reconnectez-vous

### Erreur 404 (Route non trouvée)
- **Cause:** Routes finance pas montées dans server.js
- **Solution:** Vérifier ligne 154 de `server.js`
  ```javascript
  app.use('/api/admin/finance', require('./routes/finance.routes'));
  ```

### Erreur CORS
- **Cause:** Backend pas configuré pour accepter les requêtes du frontend
- **Solution:** Vérifier que CORS est activé dans `server.js` (ligne 15)

### Données vides (0 partout)
- **Cause:** Pas de données dans la base de données
- **Solution:** Créer des paiements et réservations de test

### Erreur "fetch failed"
- **Cause:** Backend pas démarré ou URL incorrecte
- **Solution:** 
  1. Vérifier que le backend tourne sur port 3000
  2. Vérifier le proxy Vite dans `vite.config.ts`

## 📊 Modèles de données backend

### Paiement
```javascript
{
  ref: String,           // Référence unique
  reservation: ObjectId, // Référence à la réservation
  montant: Number,       // Montant du paiement
  methode: String,       // Wave, Orange Money, etc.
  statut: String,        // SUCCESS, EN_ATTENTE, ECHEC
  detailsMethode: {
    numeroTelephone: String
  },
  createdAt: Date
}
```

### Reservation
```javascript
{
  trajet: ObjectId,      // Référence au trajet
  client: ObjectId,      // Référence au client
  nbPlaces: Number,      // Nombre de places réservées
  montantTotal: Number,  // Montant total
  etat: String,          // CONFIRMEE, TERMINEE, ANNULEE
  createdAt: Date,
  updatedAt: Date
}
```

### Trajet
```javascript
{
  chauffeur: ObjectId,   // Référence au chauffeur
  depart: String,        // Ville de départ
  arrivee: String,       // Ville d'arrivée
  dateDebut: Date,       // Date du trajet
  prixParPlace: Number,  // Prix par place
  statut: String         // EN_ATTENTE, VALIDE, TERMINE
}
```
