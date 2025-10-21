import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import type { Fahrzeug } from './types';

function App() {
  const [fahrzeug, setFahrzeug] = useState<Fahrzeug | null>(null);

  const handleLoginSuccess = (loggedInFahrzeug: Fahrzeug) => {
    setFahrzeug(loggedInFahrzeug);
  };

  const handleLogout = () => {
    setFahrzeug(null);
  };

  return (
    <>
      {!fahrzeug ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard fahrzeug={fahrzeug} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
