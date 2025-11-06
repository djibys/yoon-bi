# ✅ Checklist Vercel - Configuration finale

## 📁 Fichiers requis

- [x] `.env.production` - Variables d'env pour production
- [x] `vite.config.ts` - Config dev
- [x] `vite.config.prod.ts` - Config production
- [x] `DEPLOY.md` - Guide de déploiement

## ❌ Fichiers à NE PAS avoir (causent des conflits)

- [ ] ~~vercel.json~~ - Vercel auto-détecte Vite
- [ ] ~~netlify.toml~~ - Fichier Netlify
- [ ] ~~public/_redirects~~ - Fichier Netlify (pas Vercel)
- [ ] ~~public/_headers~~ - Fichier Netlify (pas Vercel)

## 🔧 Configuration Vercel Dashboard

### General Settings
```
Framework Preset: Vite
Root Directory: front/yoon-bi/yoon-bi-frontend
Build Command: npm run build:prod
Output Directory: dist
Install Command: npm install
```

### Environment Variables
```
VITE_API_PREFIX = https://yoon-bi-backend.onrender.com/api
```
**Environments:** Production + Preview

### Git Integration
```
Production Branch: main
Auto-deploy: Enabled
```

## 🚀 Commandes de déploiement

```bash
# 1. Vérifier qu'il n'y a pas de vercel.json
ls vercel.json  # Doit retourner: cannot find path

# 2. Commiter
git add .
git commit -m "Ready for Vercel - minimal config"
git push origin main

# 3. Déployer sur Vercel
# Aller sur dashboard et suivre DEPLOY.md
```

## ✅ Tests après déploiement

- [ ] Page login s'affiche
- [ ] Connexion admin fonctionne
- [ ] Dashboard s'affiche
- [ ] Navigation entre pages OK
- [ ] Actualiser une page → pas de 404
- [ ] F12 → Network → API calls vers Render
- [ ] Gestion financière charge les données

## 🐛 Si problème

1. **Erreur de build:** Vérifier logs dans Vercel Deployments
2. **404 sur routes:** Vérifier Framework = Vite
3. **API ne répond pas:** Vérifier VITE_API_PREFIX
4. **CORS:** Ajouter CORS_ORIGIN côté backend Render

## 📊 Architecture finale

```
Frontend (Vercel)
  ↓ https://ton-projet.vercel.app
  ↓ VITE_API_PREFIX
  ↓ https://yoon-bi-backend.onrender.com/api
  ↓
Backend (Render)
  ↓ MONGODB_URI
  ↓ mongodb+srv://...
  ↓
MongoDB Atlas
```

## 🎯 Résumé

- **Pas de vercel.json** - Vercel auto-détecte Vite
- **Variables d'env** dans dashboard Vercel
- **Build command:** npm run build:prod
- **Output:** dist
- **SPA fallback** géré automatiquement par Vercel
