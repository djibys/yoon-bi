import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Card, Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap';
import logo from '../assets/logo.png';
import type { User } from '../types/user';

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log('[LOGIN] Début de la connexion...');
    
    try {
      const body: any = { motDePasse: password };
      if (email.includes('@')) {
        body.email = email;
      } else {
        body.tel = email;
      }

      console.log('[LOGIN] Envoi de la requête à /api/auth/login');
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log('[LOGIN] Réponse reçue:', { status: res.status, success: data?.success });
      
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Email ou mot de passe incorrect');
      }

      console.log('[LOGIN] Réponse complète:', data);
      
      if (!data.token) {
        throw new Error('Token manquant dans la réponse');
      }
      
      if (!data.user) {
        throw new Error('Aucune information utilisateur reçue');
      }

      // Nettoyer les données utilisateur (retirer les champs sensibles)
      const { password: _, motDePasse: __, ...safeUserData } = data.user;
      
      // Le backend retourne 'id', pas '_id'
      const userToStore = {
        ...safeUserData,
        // S'assurer que l'id est présent
        id: safeUserData.id,
      };
      
      console.log('[LOGIN] Données utilisateur à stocker:', {
        id: userToStore.id,
        email: userToStore.email,
        prenom: userToStore.prenom,
        nom: userToStore.nom,
        typeUtilisateur: userToStore.typeUtilisateur
      });
      
      // Stocker le token et l'utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userToStore));
      
      console.log('[LOGIN] ✓ Token et utilisateur stockés');
      console.log('[LOGIN] Appel de onLogin...');
      
      // Appeler le callback de connexion
      onLogin(userToStore);
      
      console.log('[LOGIN] ✓ Connexion réussie !');
    } catch (err: any) {
      console.error('[LOGIN] Erreur:', err);
      setError(err?.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center py-4">
      <div className="w-100 px-3 px-sm-0" style={{ maxWidth: '520px' }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <img src={logo} alt="Yoon-Bi" style={{ height: '80px', width: 'auto', borderRadius: '12px' }} />
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border rounded-4">
          <Card.Header className="text-center bg-white border-bottom">
            <Card.Title className="mb-1 fw-bold">Connexion Administrateur</Card.Title>
            <Card.Text className="text-muted small">
              Connectez-vous pour accéder au dashboard
            </Card.Text>
          </Card.Header>
          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label htmlFor="email">Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <Mail size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    id="email"
                    type="email"
                    placeholder="admin@yoon-bi.sn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="password">Mot de passe</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <Lock size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ borderLeft: 'none' }}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </Button>
                </InputGroup>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check
                  type="checkbox"
                  id="remember-me"
                  label="Se souvenir de moi"
                  className="text-muted small"
                />
                <Button 
                  variant="link" 
                  className="p-0 text-decoration-none small"
                  style={{ color: '#00853F' }}
                >
                  Mot de passe oublié ?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-100"
                style={{ backgroundColor: '#00853F', borderColor: '#00853F' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-muted small mb-0">
            © 2025 Yoon-Bi. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}