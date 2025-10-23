import { useState } from "react";
import { Login } from "./components/Login";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    // Ici tu peux ajouter la logique de vérification d'identifiants
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="p-4">
      <h1>Bienvenue dans l'administration !</h1>
      <p>Vous êtes connecté.</p>
      {/* Plus tard tu pourras ajouter le Dashboard ici */}
    </div>
  );
}
