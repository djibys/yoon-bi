# 🚀 Guide de déploiement sur Vercel

## ✅ Fichiers préparés

- ✓ `.env.production` - Variables d'environnement pour la production
- ✓ `vercel.json` - Configuration Vercel (build + SPA fallback)
- ✓ `public/_redirects` - Fallback pour SPA (Netlify compatible)
- ✓ `vite.config.prod.ts` - Config build production (sans console.log)
- ✓ `vite.config.ts` - Config dev avec proxy

## 📋 Étapes de déploiement

### 1. Pousser le code sur GitHub

```bash
# Dans le dossier frontend
cd "c:\Users\hp\Desktop\projet fin\front\yoon-bi\yoon-bi-frontend"

# Ajouter les fichiers
git add .
git commit -m "Prêt pour déploiement Vercel"
git push origin main
```

### 2. Créer un projet sur Vercel

1. Aller sur https://vercel.com
2. Cliquer sur "New Project"
3. Importer le repo GitHub du frontend
4. Vercel détecte automatiquement Vite

### 3. Configuration du projet Vercel

**Framework Preset:** Vite

**Build & Development Settings:**
- Build Command: `npm run build:prod`
- Output Directory: `dist`
- Install Command: `npm install`

**Root Directory:** 
- Si monorepo: `front/yoon-bi/yoon-bi-frontend`
- Si repo séparé: laisser vide (`.`)

### 4. Variables d'environnement

Dans Vercel → Project Settings → Environment Variables, ajouter:

| Key | Value | Environments |
|-----|-------|--------------|
| `VITE_API_PREFIX` | `https://yoon-bi-backend.onrender.com/api` | Production, Preview |

**Important:** Les variables `VITE_*` sont injectées au build. Après modification, redéployer.

### 5. Déployer

- Cliquer sur "Deploy"
- Attendre la fin du build (~2-3 min)
- Vercel fournit une URL: `https://ton-projet.vercel.app`

## 🧪 Tests après déploiement

### 1. Page de login
- Ouvrir `https://ton-projet.vercel.app`
- La page de login doit s'afficher

### 2. Connexion
- Email: `admin@yoon-bi.sn`
- Mot de passe: `admin123`
- Doit rediriger vers le dashboard

### 3. Navigation
- Tester toutes les pages du menu
- L'URL doit changer
- Actualiser la page → doit rester sur la même page (SPA)

### 4. API (F12 → Network)
- Les requêtes doivent partir vers:
  - `https://yoon-bi-backend.onrender.com/api/...`
- Statut 200 pour les requêtes réussies
- Vérifier les logs `[AUTH]`, `[API GET]`, `[FINANCE]`

### 5. Gestion financière
- Aller sur "Gestion financière"
- Les KPI doivent s'afficher
- La liste des paiements doit se charger
- Les trajets en attente doivent apparaître

## 🔧 Configuration backend (CORS)

Si tu as des erreurs CORS, ajoute dans Render (backend):

**Environment Variables:**
```
CORS_ORIGIN=https://ton-projet.vercel.app
```

Puis redéploie le backend.

## 📝 Commandes utiles

### Build local (test avant déploiement)
```bash
npm install
npm run build:prod
```

### Preview local du build
```bash
npm run preview
```

### Nettoyer le cache
```bash
rm -rf node_modules dist
npm install
npm run build:prod
```

## 🐛 Dépannage

### Erreur: BODY_NOT_A_STRING_FROM_FUNCTION
- **Cause:** Proxy `/api` côté Vercel
- **Solution:** Supprimer les rewrites `/api` dans `vercel.json` (déjà fait)

### Erreur: 404 sur les routes
- **Cause:** Fallback SPA manquant
- **Solution:** Vérifier `vercel.json` routes (déjà configuré)

### Erreur: API non accessible
- **Cause:** `VITE_API_PREFIX` mal configuré
- **Solution:** Vérifier la variable d'env dans Vercel

### Erreur: CORS
- **Cause:** Backend refuse les requêtes du domaine Vercel
- **Solution:** Ajouter `CORS_ORIGIN` dans Render backend

### Page blanche
- **Cause:** Erreur de build ou JS
- **Solution:** 
  - Vérifier les logs de build Vercel
  - Ouvrir F12 → Console pour voir les erreurs
  - Tester le build local: `npm run build:prod && npm run preview`

## 🎯 Checklist finale

- [ ] Code poussé sur GitHub
- [ ] Projet créé sur Vercel
- [ ] Build command: `npm run build:prod`
- [ ] Output directory: `dist`
- [ ] Variable `VITE_API_PREFIX` configurée
- [ ] Déploiement réussi
- [ ] Page login s'affiche
- [ ] Connexion fonctionne
- [ ] Navigation entre pages OK
- [ ] Actualisation page OK (pas de 404)
- [ ] API calls vers Render OK
- [ ] Gestion financière charge les données
- [ ] CORS configuré si nécessaire

## 🎉 Déploiement réussi !

Une fois tous les points validés:
- Frontend: `https://ton-projet.vercel.app`
- Backend: `https://yoon-bi-backend.onrender.com`
- API Docs: `https://yoon-bi-backend.onrender.com/api-docs`

## 🔄 Redéploiement automatique

Vercel redéploie automatiquement à chaque push sur `main`.

Pour désactiver:
- Vercel → Project Settings → Git → Ignored Build Step

## 📚 Ressources

- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev/guide/
- React Router: https://reactrouter.com/

## 💡 Conseils

1. **Preview Deployments:** Chaque branche/PR a une URL de preview
2. **Environment Variables:** Différentes par environnement (Production/Preview/Development)
3. **Analytics:** Activer Vercel Analytics pour suivre les performances
4. **Domaine custom:** Ajouter un domaine personnalisé dans Project Settings
