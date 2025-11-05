import { Login } from './components/Login';
import type { User } from './types/user';

// VERSION DEBUG SIMPLIFIÉE - Pour tester uniquement la page de login
export default function App() {
  const handleLogin = (user: User) => {
    console.log('Login réussi:', user);
    // Stockage
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify(user));
    // Recharger pour tester la vraie version
    window.location.href = '/';
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px' }}>MODE DEBUG - Page de Login</h1>
      <Login onLogin={handleLogin} />
    </div>
  );
}
