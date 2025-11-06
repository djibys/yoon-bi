# Configuration Vercel

## Option 1: Avec vercel.json (actuel)

```json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist"
}
```

Vercel détecte automatiquement Vite et gère le SPA fallback.

## Option 2: Sans vercel.json (recommandé si erreur persiste)

Supprimer `vercel.json` et configurer dans le dashboard Vercel:

### Settings → General
- **Framework Preset:** Vite
- **Build Command:** `npm run build:prod`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Settings → Rewrites (pour SPA)
Si la navigation ne fonctionne pas, ajouter dans le dashboard:
- Source: `/(.*)`
- Destination: `/index.html`

## Option 3: Utiliser redirects au lieu de rewrites

Si tu préfères utiliser `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/:path((?!_next|api|favicon.ico).*)",
      "destination": "/index.html",
      "permanent": false
    }
  ]
}
```

## Variables d'environnement

Dans Vercel Dashboard → Environment Variables:
- `VITE_API_PREFIX` = `https://yoon-bi-backend.onrender.com/api`

## Troubleshooting

### Si l'erreur "routes cannot be present" persiste:
1. Supprimer complètement `vercel.json`
2. Vider le cache Git: `git rm --cached vercel.json`
3. Commit: `git commit -m "Remove vercel.json"`
4. Push: `git push origin main`
5. Reconfigurer dans le dashboard Vercel

### Si 404 sur les routes:
Vérifier que Vercel gère bien le SPA:
- Project Settings → Functions → (pas de config spéciale nécessaire)
- Vercel détecte automatiquement Vite et configure le fallback

### Si API ne fonctionne pas:
Vérifier la variable d'environnement `VITE_API_PREFIX` dans Vercel.
