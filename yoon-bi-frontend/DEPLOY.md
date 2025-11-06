# 🚀 Déploiement Frontend - Vercel

## Configuration minimale - Zéro fichier de config

Vercel détecte automatiquement Vite et gère le SPA fallback.

**Pas besoin de:**
- ❌ vercel.json
- ❌ _redirects (Netlify)
- ❌ _headers (Netlify)

Vercel fait tout automatiquement.

## 📋 Étapes

### 1. Push le code sur GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Déployer sur Vercel

#### A. Créer le projet
1. https://vercel.com → **New Project**
2. **Import Git Repository:** djibys/yoon-bi
3. **Configure Project:**
   - Framework Preset: **Vite** (auto-détecté)
   - Root Directory: **front/yoon-bi/yoon-bi-frontend**
   - Build Command: **npm run build:prod**
   - Output Directory: **dist**
   - Install Command: npm install (par défaut)

#### B. Variables d'environnement
Dans **Environment Variables**, ajouter:

| Variable | Value |
|----------|-------|
| `VITE_API_PREFIX` | `https://yoon-bi-backend.onrender.com/api` |

**Environments:** Production + Preview

#### C. Deploy
Cliquer sur **Deploy** et attendre 2-3 minutes.

### 3. Configuration Backend (CORS)
Dans Render → Backend → Environment Variables:
```
CORS_ORIGIN=https://ton-projet.vercel.app
```
Redéployer le backend.

## ✅ Tests

1. **Login:** https://ton-projet.vercel.app
2. **Connexion:** admin@yoon-bi.sn / admin123
3. **Navigation:** Toutes les pages
4. **API (F12):** Vérifier les appels vers yoon-bi-backend.onrender.com
5. **Refresh:** Actualiser → rester sur la page (pas de 404)

## 🔧 Troubleshooting

### 404 sur les routes
Vercel gère automatiquement le SPA. Si problème:
- Vérifier que Framework = Vite
- Redéployer avec "Clear cache"

### API ne fonctionne pas
- Vérifier `VITE_API_PREFIX` dans Environment Variables
- Redéployer après modification des variables

### Erreur CORS
- Ajouter `CORS_ORIGIN` côté backend Render
- Valeur: URL complète du frontend Vercel

## 🔄 Redéploiement

Vercel redéploie automatiquement à chaque push sur `main`.

Pour forcer:
- Deployments → ⋯ → Redeploy
- Cocher "Clear cache and redeploy"

## 🌐 Domaine personnalisé

Settings → Domains → Add Domain → Suivre les instructions DNS
