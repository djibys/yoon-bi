import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Card, Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap';
import logo from '../assets/logo.png';

interface LoginProps {
  onLogin: () => void;
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
    try {
      const body: any = { motDePasse: password };
      if (email.includes('@')) {
        body.email = email;
      } else {
        body.tel = email;
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Email ou mot de passe incorrect');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setIsLoading(false);
      onLogin();
    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue');
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