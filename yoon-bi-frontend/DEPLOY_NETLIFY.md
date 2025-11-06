# 🚀 Déploiement sur Netlify (Alternative à Vercel)

## Pourquoi Netlify ?
- ✓ Plus simple
- ✓ Pas de conflits de configuration
- ✓ Excellent support Vite
- ✓ Gratuit et fiable

## 📋 Étapes de déploiement

### 1. Push le code
```bash
cd "c:\Users\hp\Desktop\projet fin\front\yoon-bi\yoon-bi-frontend"
git add netlify.toml
git commit -m "Add Netlify config"
git push origin main
```

### 2. Créer un compte Netlify
- Aller sur https://netlify.com
- S'inscrire avec GitHub

### 3. Nouveau site
1. **"Add new site" → "Import an existing project"**
2. **Connect to Git provider:** GitHub
3. **Pick a repository:** djibys/yoon-bi
4. **Configure:**
   ```
   Base directory: front/yoon-bi/yoon-bi-frontend
   Build command: npm run build:prod
   Publish directory: dist
   ```

### 4. Variables d'environnement
Dans **Site settings → Environment variables**, ajouter:
```
VITE_API_PREFIX = https://yoon-bi-backend.onrender.com/api
```

### 5. Deploy
- Cliquer sur "Deploy site"
- Attendre 2-3 min
- Ton site sera sur: `https://ton-site.netlify.app`

## 🔧 Configuration (netlify.toml)

Le fichier `netlify.toml` est déjà créé:
```toml
[build]
  command = "npm run build:prod"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## ✅ Tests après déploiement

1. **Login:** Ouvre l'URL Netlify → page login
2. **Connexion:** `admin@yoon-bi.sn` / `admin123`
3. **Navigation:** Teste toutes les pages
4. **API:** F12 → Network → vérifie les appels vers Render
5. **Refresh:** Actualise une page → doit rester sur la même page

## 🎯 Avantages Netlify

- Déploiements automatiques sur push
- Preview deployments pour les PR
- Logs de build clairs
- Pas de conflits de config
- Domaine custom facile
- HTTPS automatique

## 🔄 Redéploiement

Netlify redéploie automatiquement à chaque push sur `main`.

Pour forcer un redéploiement:
- Dashboard → Deploys → Trigger deploy → Deploy site

## 🌐 Domaine custom

Pour ajouter ton domaine:
1. Site settings → Domain management
2. Add custom domain
3. Suivre les instructions DNS

## 💡 Comparaison Vercel vs Netlify

| Feature | Vercel | Netlify |
|---------|--------|---------|
| Config | Complexe | Simple |
| Vite Support | Bon | Excellent |
| Gratuit | Oui | Oui |
| SPA Fallback | Auto | Facile |
| **Problème actuel** | ❌ Erreur routes | ✅ Fonctionne |

## 📚 Ressources

- Netlify Docs: https://docs.netlify.com
- Vite + Netlify: https://vitejs.dev/guide/static-deploy.html#netlify
