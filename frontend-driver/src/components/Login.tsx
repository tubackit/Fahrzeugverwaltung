import { useState } from 'react';
import type { Fahrzeug, LoginResponse } from '../types';

interface LoginProps {
  onLoginSuccess: (fahrzeug: Fahrzeug) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [kennzeichen, setKennzeichen] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/fahrer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kennzeichen, pin }),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.fahrzeug) {
        onLoginSuccess(data.fahrzeug);
      } else {
        setError(data.message || 'Login fehlgeschlagen');
      }
    } catch (err) {
      setError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🚗 Fahrer-Portal</h1>
          <p className="text-gray-600">Fahrzeug Plus 6 Enterprise</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="kennzeichen"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Kennzeichen
            </label>
            <input
              id="kennzeichen"
              type="text"
              value={kennzeichen}
              onChange={(e) => setKennzeichen(e.target.value.toUpperCase())}
              placeholder="z.B. FZ-PLUS"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              data-test-id="input-kennzeichen"
              aria-label="Kennzeichen eingeben"
            />
          </div>

          <div>
            <label
              htmlFor="pin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              PIN
            </label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              data-test-id="input-pin"
              aria-label="PIN eingeben"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            data-test-id="button-login"
            aria-label="Anmelden"
          >
            {loading ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            <strong>Test-Zugänge:</strong>
          </p>
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p>• FZ-PLUS / PIN: 1234 (Ford Mondeo)</p>
            <p>• TY-AV456 / PIN: 5678 (Toyota Avensis)</p>
          </div>
        </div>
      </div>
    </div>
  );
}


