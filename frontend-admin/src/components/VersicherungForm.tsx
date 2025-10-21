import { useState } from 'react';
import type { Fahrzeug } from '../types';

interface VersicherungFormProps {
  fahrzeug: Fahrzeug;
  onClose: (saved: boolean) => void;
}

export default function VersicherungForm({ fahrzeug, onClose }: VersicherungFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    versicherungsgesellschaft: fahrzeug.versicherungsgesellschaft || '',
    versicherungsnummer: fahrzeug.versicherungsnummer || '',
    versicherungsart: fahrzeug.versicherungsart || '',
    deckungssumme: fahrzeug.deckungssumme || '',
    selbstbeteiligungTeilkasko: fahrzeug.selbstbeteiligungTeilkasko || '',
    selbstbeteiligungVollkasko: fahrzeug.selbstbeteiligungVollkasko || '',
    jahrespraemie: fahrzeug.jahrespraemie || '',
    vertragsbeginn: fahrzeug.vertragsbeginn || '',
    vertragsende: fahrzeug.vertragsende || '',
    schadenfreiheitsklasse: fahrzeug.schadenfreiheitsklasse || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/fahrzeuge/${fahrzeug.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Versicherungsdaten erfolgreich gespeichert!');
        onClose(true);
      } else {
        alert('Fehler beim Speichern der Versicherungsdaten');
      }
    } catch (error) {
      console.error('Fehler:', error);
      alert('Verbindungsfehler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-400 sticky top-0 bg-white z-10">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>🛡️</span>
          Versicherungsdaten bearbeiten - {fahrzeug.kennzeichen}
        </h2>
        <button
          onClick={() => onClose(false)}
          className="text-gray-500 hover:text-gray-700 text-2xl"
          data-test-id="button-close-versicherung-form"
          aria-label="Formular schließen"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Vertragsdaten */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-gray-400 rounded-lg p-4 shadow-md">
          <h3 className="text-sm font-bold text-blue-800 mb-4 flex items-center gap-2">
            <span>📄</span> Vertragsdaten
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="versicherungsgesellschaft" className="block text-sm font-medium text-gray-700 mb-2">
                Versicherungsgesellschaft
              </label>
              <input
                id="versicherungsgesellschaft"
                name="versicherungsgesellschaft"
                type="text"
                value={formData.versicherungsgesellschaft}
                onChange={handleChange}
                placeholder="z.B. Allianz, HUK-Coburg"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
                data-test-id="input-versicherungsgesellschaft"
                aria-label="Versicherungsgesellschaft"
              />
            </div>

            <div>
              <label htmlFor="versicherungsnummer" className="block text-sm font-medium text-gray-700 mb-2">
                Versicherungsnummer/Police
              </label>
              <input
                id="versicherungsnummer"
                name="versicherungsnummer"
                type="text"
                value={formData.versicherungsnummer}
                onChange={handleChange}
                placeholder="z.B. 123456789"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
                data-test-id="input-versicherungsnummer"
                aria-label="Versicherungsnummer"
              />
            </div>

            <div>
              <label htmlFor="versicherungsart" className="block text-sm font-medium text-gray-700 mb-2">
                Versicherungsart
              </label>
              <select
                id="versicherungsart"
                name="versicherungsart"
                value={formData.versicherungsart}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
                data-test-id="select-versicherungsart"
                aria-label="Versicherungsart"
              >
                <option value="">Bitte wählen...</option>
                <option value="Haftpflicht">Haftpflicht</option>
                <option value="Teilkasko">Teilkasko</option>
                <option value="Vollkasko">Vollkasko</option>
              </select>
            </div>

            <div>
              <label htmlFor="schadenfreiheitsklasse" className="block text-sm font-medium text-gray-700 mb-2">
                Schadenfreiheitsklasse (SF)
              </label>
              <input
                id="schadenfreiheitsklasse"
                name="schadenfreiheitsklasse"
                type="text"
                value={formData.schadenfreiheitsklasse}
                onChange={handleChange}
                placeholder="z.B. SF 12"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
                data-test-id="input-schadenfreiheitsklasse"
                aria-label="Schadenfreiheitsklasse"
              />
            </div>

            <div>
              <label htmlFor="vertragsbeginn" className="block text-sm font-medium text-gray-700 mb-2">
                Vertragsbeginn
              </label>
              <input
                id="vertragsbeginn"
                name="vertragsbeginn"
                type="date"
                value={formData.vertragsbeginn}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
                data-test-id="input-vertragsbeginn"
                aria-label="Vertragsbeginn"
              />
            </div>

            <div>
              <label htmlFor="vertragsende" className="block text-sm font-medium text-gray-700 mb-2">
                Vertragsende
              </label>
              <input
                id="vertragsende"
                name="vertragsende"
                type="date"
                value={formData.vertragsende}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
                data-test-id="input-vertragsende"
                aria-label="Vertragsende"
              />
            </div>
          </div>
        </div>

        {/* Deckung & Kosten */}
        <div className="bg-gradient-to-br from-green-50 to-yellow-50 border border-gray-400 rounded-lg p-4 shadow-md">
          <h3 className="text-sm font-bold text-green-800 mb-4 flex items-center gap-2">
            <span>💰</span> Deckung & Kosten
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="deckungssumme" className="block text-sm font-medium text-gray-700 mb-2">
                Deckungssumme (€)
              </label>
              <input
                id="deckungssumme"
                name="deckungssumme"
                type="number"
                step="0.01"
                value={formData.deckungssumme}
                onChange={handleChange}
                placeholder="z.B. 100000000"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-gray-400 outline-none transition"
                data-test-id="input-deckungssumme"
                aria-label="Deckungssumme"
              />
            </div>

            <div>
              <label htmlFor="jahrespraemie" className="block text-sm font-medium text-gray-700 mb-2">
                Jahresprämie (€)
              </label>
              <input
                id="jahrespraemie"
                name="jahrespraemie"
                type="number"
                step="0.01"
                value={formData.jahrespraemie}
                onChange={handleChange}
                placeholder="z.B. 850.00"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-gray-400 outline-none transition"
                data-test-id="input-jahrespraemie"
                aria-label="Jahresprämie"
              />
            </div>

            <div>
              <label htmlFor="selbstbeteiligungTeilkasko" className="block text-sm font-medium text-gray-700 mb-2">
                Selbstbeteiligung Teilkasko (€)
              </label>
              <input
                id="selbstbeteiligungTeilkasko"
                name="selbstbeteiligungTeilkasko"
                type="number"
                step="0.01"
                value={formData.selbstbeteiligungTeilkasko}
                onChange={handleChange}
                placeholder="z.B. 150.00"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-gray-400 outline-none transition"
                data-test-id="input-selbstbeteiligung-teilkasko"
                aria-label="Selbstbeteiligung Teilkasko"
              />
            </div>

            <div>
              <label htmlFor="selbstbeteiligungVollkasko" className="block text-sm font-medium text-gray-700 mb-2">
                Selbstbeteiligung Vollkasko (€)
              </label>
              <input
                id="selbstbeteiligungVollkasko"
                name="selbstbeteiligungVollkasko"
                type="number"
                step="0.01"
                value={formData.selbstbeteiligungVollkasko}
                onChange={handleChange}
                placeholder="z.B. 500.00"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-gray-400 outline-none transition"
                data-test-id="input-selbstbeteiligung-vollkasko"
                aria-label="Selbstbeteiligung Vollkasko"
              />
            </div>
          </div>
        </div>
        </div>

        {/* Buttons - Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-400 p-6 pt-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-md"
              data-test-id="button-cancel-versicherung"
              aria-label="Abbrechen"
            >
              ❌ Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-3 rounded-lg font-bold transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              data-test-id="button-save-versicherung"
              aria-label="Versicherungsdaten speichern"
            >
              {loading ? 'Wird gespeichert...' : '💾 Speichern'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

