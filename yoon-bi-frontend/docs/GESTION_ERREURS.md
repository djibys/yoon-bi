# Gestion des Erreurs Globales

Ce document explique comment utiliser le système de gestion des erreurs global de l'application.

## Table des matières
1. [Introduction](#introduction)
2. [Composant ErrorBoundary](#errorboundary)
3. [Gestionnaire d'erreurs global](#gestionnaire-derreurs)
4. [Utilisation avec les composants](#utilisation-avec-les-composants)
5. [Journalisation des erreurs](#journalisation-des-erreurs)
6. [Bonnes pratiques](#bonnes-pratiques)

## Introduction

L'application utilise une approche à plusieurs niveaux pour la gestion des erreurs :

1. **Error Boundaries** pour capturer les erreurs de rendu React
2. Un **gestionnaire d'erreurs global** pour les erreurs JavaScript asynchrones
3. Un **système de journalisation** pour le suivi des erreurs en production

## ErrorBoundary

Le composant `ErrorBoundary` capture les erreurs JavaScript dans les composants enfants et affiche une UI de secours.

### Utilisation de base

```tsx
import { ErrorBoundary } from '../components/ErrorBoundary';

function MonComposant() {
  return (
    <ErrorBoundary>
      <ComposantQuiPeutPlanter />
    </ErrorBoundary>
  );
}
```

### Personnalisation de l'UI d'erreur

```tsx
<ErrorBoundary
  fallback={
    <div className="alert alert-danger">
      Une erreur est survenue dans ce composant.
    </div>
  }
>
  <ComposantQuiPeutPlanter />
</ErrorBoundary>
```

## Gestionnaire d'erreurs global

Le service `errorHandler` permet de gérer les erreurs de manière centralisée.

### Initialisation

```ts
import { errorHandler } from '../services/errorHandler';

// Pour les erreurs non capturées
errorHandler.setupGlobalHandlers();
```

### Utilisation

```ts
// Pour les erreurs synchrones
try {
  // Code qui peut échouer
} catch (error) {
  errorHandler.handleError({
    message: 'Échec de l\'opération',
    error,
    level: 'error',
    context: { component: 'MonComposant' }
  });
}

// Pour les promesses
fetch('/api/data')
  .then(processData)
  .catch((error) => {
    errorHandler.handleError({
      message: 'Échec du chargement des données',
      error,
      level: 'error'
    });
  });
```

## Utilisation avec les composants

### HOC withErrorBoundary

```tsx
import { withErrorBoundary } from '../services/errorHandler';

function MonComposant() {
  // Votre composant
}

export default withErrorBoundary(MonComposant, {
  FallbackComponent: MonComposantErreur,
  onError: (error, errorInfo) => {
    console.error('Erreur dans MonComposant:', error, errorInfo);
  }
});
```

## Journalisation des erreurs

En mode développement, les erreurs sont affichées dans la console. En production, vous pouvez configurer un service externe (Sentry, LogRocket, etc.) :

```ts
// Dans errorHandler.ts
private logToExternalService(payload: ErrorPayload) {
  if (this.isProduction) {
    // Exemple avec Sentry
    // Sentry.captureException(payload.error, {
    //   level: payload.level,
    //   extra: {
    //     ...payload.context,
    //     message: payload.message
    // }
    // });
  }
}
```

## Bonnes pratiques

1. **Envelopper les composants critiques** avec `ErrorBoundary`
2. **Toujours capturer les erreurs** dans les appels asynchrones
3. **Fournir des messages d'erreur utiles** pour le débogage
4. **Éviter de capturer les erreurs** pour les laisser remonter au gestionnaire global
5. **Tester les scénarios d'erreur** pendant le développement

## Exemple complet

```tsx
import { ErrorBoundary, useErrorHandler } from '../components/ErrorBoundary';
import { errorHandler } from '../services/errorHandler';

function DataFetcher() {
  const handleError = useErrorHandler();
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('Échec de la requête');
      }
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  };

  // ...
}

export default function MonComposant() {
  return (
    <ErrorBoundary>
      <DataFetcher />
    </ErrorBoundary>
  );
}
```
