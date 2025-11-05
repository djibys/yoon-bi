# Système d'Authentification - Documentation

## ✅ Corrections appliquées

### 1. Persistance de session réactivée
**Fichier:** `src/App.tsx` (lignes 40-105)

L'application vérifie maintenant le localStorage au démarrage :
- ✓ Vérifie la présence du token et des données utilisateur
- ✓ Valide le format JWT du token
- ✓ Vérifie l'expiration du token
- ✓ Vérifie que l'utilisateur est ADMIN
- ✓ Restaure la session si tout est valide

**Résultat:** L'application ne redirige plus vers login lors de l'actualisation si vous êtes connecté.

### 2. Cohérence des données API
**Fichier:** `src/components/Login.tsx` (lignes 48-86)

Les données sont maintenant traitées de manière cohérente :
- ✓ Validation stricte de la réponse API
- ✓ Nettoyage des champs sensibles (password, motDePasse)
- ✓ Utilisation de `id` (pas `_id`) comme le backend le retourne
- ✓ Logs détaillés pour le débogage

### 3. Structure des données

#### Backend retourne (auth.controller.js):
```javascript
{
  success: true,
  message: 'Connexion réussie',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  user: {
    id: '507f1f77bcf86cd799439011',  // ← id, pas _id
    prenom: 'Admin',
    nom: 'Yoon-Bi',
    email: 'admin@yoon-bi.sn',
    typeUtilisateur: 'ADMIN',
    photo: '/uploads/...'
  }
}
```

#### Frontend stocke dans localStorage:
```javascript
// localStorage.getItem('token')
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

// localStorage.getItem('user')
{
  "id": "507f1f77bcf86cd799439011",
  "prenom": "Admin",
  "nom": "Yoon-Bi",
  "email": "admin@yoon-bi.sn",
  "typeUtilisateur": "ADMIN",
  "photo": "/uploads/..."
}
```

## Flux d'authentification complet

### 1. Première connexion
```
Utilisateur → /login
  ↓
Saisie email + mot de passe
  ↓
POST /api/auth/login
  ↓
Backend valide et retourne { token, user }
  ↓
Frontend stocke dans localStorage
  ↓
setIsAuthenticated(true)
  ↓
navigate('/dashboard')
```

### 2. Actualisation de la page
```
Rechargement de la page
  ↓
useEffect checkAuth() s'exécute
  ↓
Lit localStorage.getItem('token')
  ↓
Lit localStorage.getItem('user')
  ↓
Valide le token (format + expiration)
  ↓
Vérifie typeUtilisateur === 'ADMIN'
  ↓
setIsAuthenticated(true)
  ↓
setCurrentUser(user)
  ↓
Reste sur la page actuelle (pas de redirection)
```

### 3. Session invalide
```
checkAuth() détecte un problème
  ↓
(token expiré / invalide / utilisateur non ADMIN)
  ↓
localStorage.removeItem('token')
  ↓
localStorage.removeItem('user')
  ↓
setIsAuthenticated(false)
  ↓
ProtectedRoute détecte non authentifié
  ↓
<Navigate to="/login" />
```

## Logs de débogage

### Console lors de la connexion
```
[LOGIN] Début de la connexion...
[LOGIN] Envoi de la requête à /api/auth/login
[LOGIN] Réponse reçue: { status: 200, success: true }
[LOGIN] Réponse complète: { success: true, token: '...', user: {...} }
[LOGIN] Données utilisateur à stocker: { id: '...', email: '...', typeUtilisateur: 'ADMIN' }
[LOGIN] ✓ Token et utilisateur stockés
[LOGIN] Appel de onLogin...
[LOGIN] ✓ Connexion réussie !
[LOGIN] Traitement de la connexion pour: admin@yoon-bi.sn
[LOGIN] Utilisateur admin validé
[LOGIN] Redirection vers: /dashboard
```

### Console lors de l'actualisation
```
[AUTH] Vérification de l'authentification...
[AUTH] Token présent: true
[AUTH] UserData présent: true
[AUTH] Utilisateur chargé: { id: '...', email: '...', typeUtilisateur: 'ADMIN' }
[AUTH] ✓ Authentification réussie
[AUTH] Fin de la vérification - isLoading=false
```

### Console en cas d'erreur
```
[AUTH] Vérification de l'authentification...
[AUTH] Token présent: false
[AUTH] UserData présent: false
[AUTH] Pas de session active
[AUTH] ✗ Erreur: Error: Aucune session active
[AUTH] Fin de la vérification - isLoading=false
[PROTECTED] Non authentifié, redirection vers /login
```

## Tests à effectuer

### ✅ Test 1: Connexion
1. Ouvrir http://localhost:5174
2. Voir la page de connexion
3. Se connecter avec un compte ADMIN
4. Vérifier la redirection vers /dashboard

### ✅ Test 2: Actualisation
1. Une fois connecté, actualiser la page (F5)
2. Vérifier que vous restez connecté
3. Vérifier que vous restez sur la même page

### ✅ Test 3: Navigation
1. Cliquer sur différentes pages dans la sidebar
2. Vérifier que l'URL change
3. Actualiser sur chaque page
4. Vérifier que vous restez sur la page actuelle

### ✅ Test 4: Déconnexion
1. Cliquer sur "Déconnexion"
2. Vérifier la redirection vers /login
3. Vérifier que le localStorage est vidé
4. Essayer d'accéder à /dashboard
5. Vérifier la redirection vers /login

### ✅ Test 5: Session expirée
1. Se connecter
2. Modifier manuellement le token dans localStorage (le corrompre)
3. Actualiser la page
4. Vérifier la redirection vers /login

## Sécurité

### Données sensibles
- ❌ Le mot de passe n'est JAMAIS stocké côté frontend
- ✓ Seul le token JWT est stocké
- ✓ Les données utilisateur sont nettoyées avant stockage

### Validation
- ✓ Format JWT vérifié (regex)
- ✓ Expiration du token vérifiée
- ✓ Type d'utilisateur vérifié (ADMIN uniquement)
- ✓ Nettoyage automatique en cas d'erreur

### Protection des routes
- ✓ Toutes les routes admin sont protégées par `ProtectedRoute`
- ✓ Vérification double : authentification + rôle ADMIN
- ✓ Redirection automatique si non autorisé
