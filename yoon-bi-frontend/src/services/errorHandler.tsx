import { ErrorBoundary as ErrorBoundaryComponent } from '../components/ErrorBoundary';
import type { ComponentType, ErrorInfo as ReactErrorInfo, ReactNode, FC } from 'react';

// Types pour la fonction withErrorBoundary

type ErrorLevel = 'error' | 'warning' | 'info';

interface ErrorContext {
  component?: string;
  userId?: string;
  [key: string]: unknown;
}

interface ErrorPayload {
  message: string;
  level?: ErrorLevel;
  error?: unknown;
  context?: ErrorContext;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private listeners: Array<(error: ErrorPayload) => void> = [];
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.setupGlobalErrorHandlers();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalErrorHandlers(): void {
    // Gestion des erreurs non capturées
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        error: event.error,
        level: 'error',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Gestion des promesses non capturées
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason || 'Une erreur inconnue est survenue dans une promesse';
      this.handleError({
        message: error instanceof Error ? error.message : String(error),
        error: error instanceof Error ? error : new Error(String(error)),
        level: 'error',
      });
    });
  }

  public handleError(payload: ErrorPayload): void {
    const { message, level = 'error', error, context = {} } = payload;
    
    // Journalisation en mode développement
    if (this.isDevelopment) {
      const logMessage = `[${level.toUpperCase()}] ${message}`;
      const logContext = { ...context } as Record<string, unknown>;
      
      if (error instanceof Error) {
        (logContext as Record<string, unknown>).stack = error.stack;
      }
      
      switch (level) {
        case 'error':
          console.error(logMessage, logContext);
          break;
        case 'warning':
          console.warn(logMessage, logContext);
          break;
        default:
          console.log(logMessage, logContext);
      }
    }

    // En production, envoyer l'erreur à un service de suivi (ex: Sentry, LogRocket, etc.)
    // this.logToExternalService({ message, level, error, context });

    // Notifier les écouteurs
    this.notifyListeners({ message, level, error, context });
  }

  public addListener(callback: (error: ErrorPayload) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
    };
  }

  private notifyListeners(payload: ErrorPayload): void {
    this.listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (e) {
        console.error('Erreur dans le gestionnaire d\'erreurs:', e);
      }
    });
  }

  // Méthodes utilitaires
  public createError(message: string, error?: unknown, context?: ErrorContext): Error {
    const errorObj = error instanceof Error ? error : new Error(message);
    if (context) {
      Object.assign(errorObj, { context });
    }
    return errorObj;
  }

  public wrapErrorHandler<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: ErrorContext
  ): (...args: T) => Promise<R> {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handleError({
          message: error instanceof Error ? error.message : 'Une erreur inconnue est survenue',
          error,
          level: 'error',
          context: {
            ...context,
            functionName: fn.name || 'fonction anonyme',
          },
        });
        throw error; // Propager l'erreur pour une gestion ultérieure si nécessaire
      }
    };
  }
}

export const errorHandler = ErrorHandler.getInstance();

export function withErrorBoundary<T extends Record<string, unknown>>(
  Component: ComponentType<T>,
  options?: {
    FallbackComponent?: ComponentType<{ error?: Error }>;
    onError?: (error: Error, errorInfo: ReactErrorInfo) => void;
  }
): FC<T> {
  const WrappedComponent: FC<T> = (props) => {
    const { FallbackComponent, onError: _onError } = options || {};
    
    const fallback = FallbackComponent ? (
      <FallbackComponent />
    ) : (
      <div className="alert alert-danger">
        Une erreur est survenue. Veuillez recharger la page.
      </div>
    );

    return (
      <ErrorBoundaryComponent fallback={fallback}>
        <Component {...(props as T)} />
      </ErrorBoundaryComponent>
    );
  };

  // Ajouter un nom d'affichage pour le débogage
  const displayName = (Component as any).displayName || (Component as any).name || 'Component';
  (WrappedComponent as any).displayName = `withErrorBoundary(${displayName})`;

  return WrappedComponent;
}
