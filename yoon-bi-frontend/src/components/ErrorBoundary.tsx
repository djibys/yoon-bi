import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Alert, Button } from 'react-bootstrap';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Envoyer l'erreur à un service de suivi (ex: Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    // Recharger la page pour réinitialiser l'état de l'application
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Afficher le fallback personnalisé s'il est fourni
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Sinon, afficher l'UI d'erreur par défaut
      return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="text-center p-4" style={{ maxWidth: '600px' }}>
            <h2 className="text-danger mb-4">Oups ! Quelque chose s'est mal passé</h2>
            <Alert variant="danger" className="text-start">
              <Alert.Heading>Erreur: {this.state.error?.name || 'Erreur inconnue'}</Alert.Heading>
              <p className="mb-0">{this.state.error?.message || 'Une erreur inattendue est survenue.'}</p>
              {import.meta.env.DEV && (
                <details className="mt-3" style={{ whiteSpace: 'pre-wrap' }}>
                  <summary>Détails techniques</summary>
                  <div className="mt-2 p-2 bg-dark text-light rounded">
                    {this.state.error?.stack}
                    <hr />
                    {this.state.errorInfo?.componentStack}
                  </div>
                </details>
              )}
            </Alert>
            <div className="mt-4">
              <Button variant="primary" onClick={this.handleReset}>
                Revenir à l'accueil
              </Button>
              <Button 
                variant="outline-secondary" 
                className="ms-2" 
                onClick={() => window.location.reload()}
              >
                Rafraîchir la page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook personnalisé pour une utilisation plus facile
export const useErrorHandler = (error: unknown): never => {
  if (error) {
    throw error;
  }
  throw new Error('Une erreur inconnue est survenue');
};
