# 🚀 Déploiement sur Vercel - Guide simplifié

## ⚠️ Configuration ZERO fichier

**Pas de vercel.json, pas de _redirects, rien.**
Vercel détecte automatiquement Vite.

## 📋 Étapes (5 minutes)

### 1. Push le code

```bash
cd "c:\Users\hp\Desktop\projet fin\front\yoon-bi\yoon-bi-frontend"
git add .
git commit -m "Ready for Vercel"
git push origin main
```

### 2. Créer/Connecter compte Vercel

1. Aller sur https://vercel.com/signup
2. **Continue with GitHub**
3. Autoriser Vercel

### 3. Nouveau projet (IMPORTANT: config propre)

#### Si tu as déjà un projet avec des erreurs:
1. Dashboard → Ton projet → Settings
2. Scroll en bas → **Delete Project**
3. Confirmer

#### Créer un nouveau projet:

1. **Dashboard** → **Add New** → **Project**

2. **Import Git Repository:**
   - Chercher: `djibys/yoon-bi`
   - Cliquer sur **Import**

3. **Configure Project:**

   **Project Name:** `yoon-bi-admin` (ou autre nom)
   
   **Framework Preset:** Vite (devrait être auto-détecté)
   
   **Root Directory:** 
   - Cliquer sur **Edit**
   - Sélectionner: `front/yoon-bi/yoon-bi-frontend`
   - Continuer
   
   **Build and Output Settings:**
   ```
   Build Command: npm run build:prod
   Output Directory: dist
   Install Command: npm install (défaut)
   
   ⚠️ IMPORTANT: Bien mettre "npm run build:prod" (pas juste "vite build")
   ```

4. **Environment Variables (CRITIQUE):**
   
   Cliquer sur **Environment Variables** (dérouler la section)
   
   Ajouter:
   ```
   Key: VITE_API_PREFIX
   Value: https://yoon-bi-backend.onrender.com/api
   ```
   
   **Environments à cocher:**
   - ✓ Production
   - ✓ Preview
   - ✓ Development (optionnel)

5. **NE RIEN configurer d'autre** (pas de rewrites, redirects, etc.)

6. Cliquer sur **Deploy**

7. Attendre 2-3 minutes ⏳

### 4. Vérifier le déploiement

Une fois terminé:
- Vercel affiche l'URL: `https://yoon-bi-admin.vercel.app`
- Cliquer sur l'URL
- **Si page blanche:** Aller à l'étape 5

### 5. Si page blanche (troubleshooting)

#### A. Vérifier la console (F12)

1. Ouvrir l'URL (page blanche)
2. Appuyer sur **F12**
3. Onglet **Console**
4. Chercher les erreurs rouges

**Erreurs courantes:**

##### "VITE_API_PREFIX is not defined"
→ Variable ENV manquante, retour à l'étape 3.4

##### "Failed to fetch" ou erreur CORS
→ Configurer le backend (voir étape 6)

##### "Failed to load module"
→ Cache de build, voir étape 7

#### B. Vérifier les variables d'environnement

1. Project Settings → Environment Variables
2. Vérifier que `VITE_API_PREFIX` existe
3. Si manquant: ajouter et **Redeploy**

#### C. Vérifier les logs de build

1. Deployments → Dernier déploiement
2. Onglet **Building**
3. Chercher des erreurs

### 6. Configurer le backend (CORS)

Le backend doit autoriser les requêtes depuis Vercel.

#### Sur Render:

1. Dashboard → Service backend
2. **Environment** → Add Environment Variable
3. Ajouter:
   ```
   Key: CORS_ORIGIN
   Value: https://yoon-bi-admin.vercel.app
   ```
   (Remplace par ton URL Vercel réelle)

4. **Manual Deploy** → Deploy latest commit

**Alternative (autoriser tous les domaines):**
```
CORS_ORIGIN=*
```

### 7. Si problème persiste: Clear cache

1. Deployments → ⋯ (trois points) → **Redeploy**
2. Cocher **"Use existing Build Cache"** → DÉCOCHER
3. Redeploy

### 8. Tests finaux

1. **Page login** s'affiche ✅
2. **Connexion:** `admin@yoon-bi.sn` / `admin123`
3. **Dashboard** s'affiche
4. **Navigation** entre pages fonctionne
5. **F12 → Network:** Requêtes vers `yoon-bi-backend.onrender.com`
6. **Actualiser** une page → reste sur la page (pas de 404)

## 🔄 Redéploiements futurs

Vercel redéploie automatiquement à chaque `git push origin main`.

Pour forcer:
- Deployments → Redeploy

## 🌐 Domaine personnalisé (optionnel)

1. Project Settings → Domains
2. Add Domain
3. Suivre les instructions DNS

## 🐛 Troubleshooting

### "vite: command not found" ou "Command exited with 127"
**Cause:** Build Command incorrecte ou vite non installé

**Solution:**
1. Vérifier que Build Command = `npm run build:prod` (pas `vite build`)
2. Le `package.json` a été corrigé pour utiliser `npx vite build`
3. Commit et push le nouveau `package.json`:
   ```bash
   git add package.json
   git commit -m "Fix: Use npx for vite build"
   git push origin main
   ```
4. Sur Vercel: Redeploy

### Build échoue
- Vérifier que `npm run build:prod` fonctionne localement
- Vérifier les logs de build sur Vercel

### Page 404
- Vérifier que Framework = Vite
- Vercel gère automatiquement le SPA

### API ne répond pas
- Vérifier `VITE_API_PREFIX` dans Environment Variables
- Vérifier CORS sur le backend Render
- F12 → Network → voir les requêtes

### "routes cannot be present"
- Vérifier qu'il n'y a **AUCUN** fichier `vercel.json`
- Vérifier qu'il n'y a **AUCUN** fichier `_redirects`
- Si l'erreur persiste: supprimer et recréer le projet (étape 3)

## ✅ Checklist finale

Avant de déployer:
- [ ] Aucun `vercel.json` dans le repo
- [ ] Aucun `netlify.toml` dans le repo
- [ ] Aucun `_redirects` dans le repo
- [ ] Code push sur GitHub

Pendant le déploiement:
- [ ] Framework = Vite
- [ ] Root = `front/yoon-bi/yoon-bi-frontend`
- [ ] Build = `npm run build:prod`
- [ ] Output = `dist`
- [ ] `VITE_API_PREFIX` configuré

Après le déploiement:
- [ ] Backend CORS configuré
- [ ] Page login s'affiche
- [ ] Connexion fonctionne
- [ ] Console (F12) sans erreurs

## 🎯 Résumé

1. **Supprimer** l'ancien projet Vercel si erreurs
2. **Créer** un nouveau projet propre
3. **Configurer** Root Directory et Build Command
4. **Ajouter** VITE_API_PREFIX
5. **Configurer** CORS sur backend
6. **Tester**

**Temps total: 5 minutes si tout est propre** ⏱️

Si problème, envoie-moi:
- URL Vercel
- Erreurs console (F12)
- Logs de build
