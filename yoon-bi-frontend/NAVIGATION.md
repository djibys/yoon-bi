# Système de Navigation et Redirection

## Architecture

### 1. Composant ProtectedRoute
**Fichier:** `src/components/ProtectedRoute.tsx`

Ce composant protège les routes qui nécessitent une authentification :
- Vérifie si l'utilisateur est authentifié
- Vérifie si l'utilisateur est un ADMIN
- Redirige vers `/login` si non autorisé
- Sauvegarde la page demandée pour y revenir après connexion

### 2. Gestion de l'authentification
**Fichier:** `src/App.tsx`

#### Au démarrage (useEffect)
```typescript
// TEMPORAIRE : Nettoie le localStorage au démarrage
// À supprimer une fois que la connexion fonctionne correctement
localStorage.removeItem('token');
localStorage.removeItem('user');
```

#### Logique normale (commentée pour l'instant)
- Vérifie le token dans localStorage
- Valide le format JWT
- Vérifie l'expiration
- Vérifie que l'utilisateur est ADMIN

### 3. Navigation entre les pages

#### handleNavigate
```typescript
const handleNavigate = (page: string) => {
  navigate(`/${page}`, { replace: false });
};
```

Cette fonction est passée à `AdminLayout` et utilisée par la sidebar pour naviguer entre les pages.

#### currentPage
```typescript
const currentPage = location.pathname.split('/')[1] || 'dashboard';
```

Calculé automatiquement depuis l'URL, pas besoin de state séparé.

### 4. Routes définies

#### Route publique
- `/login` - Page de connexion (redirige vers dashboard si déjà connecté)

#### Routes protégées (nécessitent authentification ADMIN)
- `/` - Redirige vers `/dashboard`
- `/dashboard` - Tableau de bord
- `/users` - Gestion des utilisateurs
- `/drivers` - Gestion des chauffeurs
- `/trips` - Trajets et réservations
- `/financial` - Gestion financière
- `/reports` - Signalements
- `/profile` - Profil utilisateur
- `/settings` - Paramètres

#### Route wildcard
- `*` - Redirige vers `/dashboard` (si authentifié) ou `/login` (si non authentifié)

## Flux de connexion

1. **Utilisateur non connecté accède à une route protégée**
   - `ProtectedRoute` détecte l'absence d'authentification
   - Redirige vers `/login` avec `state.from` = page demandée

2. **Utilisateur se connecte**
   - `handleLogin` vérifie que c'est un ADMIN
   - Stocke token et user dans localStorage
   - Met à jour les states `isAuthenticated` et `currentUser`
   - Redirige vers la page demandée ou `/dashboard`

3. **Utilisateur navigue dans l'app**
   - Clique sur un lien de la sidebar
   - `handleNavigate` est appelé avec le nom de la page
   - `navigate()` change l'URL
   - React Router affiche le composant correspondant
   - `currentPage` est recalculé automatiquement depuis l'URL

4. **Utilisateur se déconnecte**
   - `handleLogout` nettoie le localStorage
   - Réinitialise les states
   - Redirige vers `/login`

## Logs de débogage

Tous les logs sont préfixés pour faciliter le débogage :
- `[AUTH]` - Vérification d'authentification
- `[LOGIN]` - Processus de connexion
- `[NAV]` - Navigation entre pages
- `[PROTECTED]` - Vérification des routes protégées

## Pour réactiver la persistance de session

Une fois que la connexion fonctionne correctement :

1. Dans `src/App.tsx`, supprimer les lignes 44-48 :
```typescript
// SUPPRIMER CES LIGNES
localStorage.removeItem('token');
localStorage.removeItem('user');
console.log('[AUTH] LocalStorage nettoyé - redémarrage propre');
setIsLoading(false);
return;
```

2. Décommenter les lignes 50-98 (logique normale)

3. L'application gardera alors la session active entre les rechargements
