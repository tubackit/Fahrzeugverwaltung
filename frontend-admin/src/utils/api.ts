/**
 * API Utility - Zentralisiert die API-URL Konfiguration
 * 
 * Auf Vercel: Setze Environment Variable VITE_API_URL
 * Lokal: Verwendet Vite Proxy (siehe vite.config.ts)
 */

const getApiUrl = (): string => {
  // In Produktion (Vercel): Verwende Environment Variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Lokal: Verwende relative Pfade (Vite Proxy leitet weiter)
  return '';
};

export const API_URL = getApiUrl();

/**
 * Helper-Funktion für API-Aufrufe
 */
export const apiFetch = async (endpoint: string, options?: RequestInit): Promise<Response> => {
  const url = API_URL ? `${API_URL}${endpoint}` : endpoint;
  return fetch(url, options);
};
