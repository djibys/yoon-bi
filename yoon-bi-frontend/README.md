# 🚗 Yoon-Bi Admin Frontend

Application web d'administration pour la plateforme Yoon-Bi (covoiturage Sénégal).

## 🚀 Démarrage rapide

### Développement local
```bash
npm install
npm run dev
```
Ouvre http://localhost:5173

### Production
```bash
npm run build:prod
npm run preview
```

## 🔧 Configuration

### Variables d'environnement

**Développement (.env.local):**
```env
VITE_API_TARGET=http://localhost:3000
VITE_API_PREFIX=/api
```

**Production (.env.production):**
```env
VITE_API_PREFIX=https://yoon-bi-backend.onrender.com/api
```

## 📦 Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build production (avec logs)
- `npm run build:prod` - Build production optimisé (sans logs)
- `npm run preview` - Preview du build
- `npm run lint` - Vérifier le code

## 🏗️ Structure

```
src/
├── components/        # Composants React
│   ├── admin/        # Pages admin
│   └── ...
├── services/         # API calls
├── types/           # Types TypeScript
└── App.tsx          # Composant principal
```

## 🔐 Connexion

- Email: `admin@yoon-bi.sn`
- Mot de passe: `admin123`

## 📚 Documentation

- [Guide de déploiement Vercel](./DEPLOY_VERCEL.md)

## 🛠️ Technologies

- React 19
- TypeScript
- Vite
- React Router
- Bootstrap 5
- Lucide Icons

## 🌐 Déploiement

Déploiement sur **Vercel**.

Voir [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) pour les instructions complètes.
