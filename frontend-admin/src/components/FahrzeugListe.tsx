import { useState, useEffect } from 'react';
import type { Fahrzeug } from '../types';
import FahrzeugForm from './FahrzeugForm';

export default function FahrzeugListe() {
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedFahrzeug, setSelectedFahrzeug] = useState<Fahrzeug | null>(null);

  const loadFahrzeuge = async () => {
    try {
      const response = await fetch('/api/fahrzeuge');
      const data = await response.json();
      setFahrzeuge(data);
    } catch (error) {
      console.error('Fehler beim Laden der Fahrzeuge:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFahrzeuge();
  }, []);

  const handleAdd = () => {
    setSelectedFahrzeug(null);
    setShowForm(true);
  };

  const handleEdit = (fahrzeug: Fahrzeug) => {
    setSelectedFahrzeug(fahrzeug);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Möchten Sie dieses Fahrzeug wirklich löschen?')) {
      return;
    }

    try {
      const response = await fetch(`/api/fahrzeuge/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadFahrzeuge();
      } else {
        alert('Fehler beim Löschen');
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      alert('Verbindungsfehler');
    }
  };

  const handleFormClose = (saved: boolean) => {
    setShowForm(false);
    setSelectedFahrzeug(null);
    if (saved) {
      loadFahrzeuge();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Lädt Fahrzeuge...</div>
      </div>
    );
  }

  if (showForm) {
    return (
      <FahrzeugForm
        fahrzeug={selectedFahrzeug}
        onClose={handleFormClose}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fahrzeugverwaltung</h2>
          <p className="text-sm text-gray-600 mt-1">
            {fahrzeuge.length} Fahrzeug{fahrzeuge.length !== 1 ? 'e' : ''} im System
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg flex items-center gap-2"
          data-test-id="button-add-fahrzeug"
          aria-label="Fahrzeug hinzufügen"
        >
          <span className="text-xl">+</span>
          Fahrzeug hinzufügen
        </button>
      </div>

      {fahrzeuge.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Noch keine Fahrzeuge
          </h3>
          <p className="text-gray-600 mb-6">
            Fügen Sie Ihr erstes Fahrzeug hinzu, um loszulegen.
          </p>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            data-test-id="button-add-first-fahrzeug"
            aria-label="Erstes Fahrzeug hinzufügen"
          >
            Erstes Fahrzeug hinzufügen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fahrzeuge.map((fahrzeug) => (
            <div
              key={fahrzeug.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {fahrzeug.kennzeichen}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {fahrzeug.hersteller} {fahrzeug.modell}
                  </p>
                </div>
                <div className="text-3xl">🚗</div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                {fahrzeug.fahrzeugklasse && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Klasse:</span>
                    <span className="font-medium">{fahrzeug.fahrzeugklasse}</span>
                  </div>
                )}
                {fahrzeug.baujahr && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Baujahr:</span>
                    <span className="font-medium">{fahrzeug.baujahr}</span>
                  </div>
                )}
                {fahrzeug.aktuellerKmStand !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">KM-Stand:</span>
                    <span className="font-medium">
                      {fahrzeug.aktuellerKmStand.toLocaleString('de-DE')} km
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(fahrzeug)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                  data-test-id={`button-edit-${fahrzeug.id}`}
                  aria-label="Fahrzeug bearbeiten"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDelete(fahrzeug.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition"
                  data-test-id={`button-delete-${fahrzeug.id}`}
                  aria-label="Fahrzeug löschen"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


