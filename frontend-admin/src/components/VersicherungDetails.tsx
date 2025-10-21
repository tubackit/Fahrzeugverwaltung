import { useState } from 'react';
import type { Fahrzeug } from '../types';
import VersicherungForm from './VersicherungForm';
import DataCard, { DataField } from './DataCard';
import Kennzeichen from './Kennzeichen';

interface VersicherungDetailsProps {
  fahrzeug: Fahrzeug;
  onUpdate: () => void;
}

export default function VersicherungDetails({ fahrzeug, onUpdate }: VersicherungDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleFormClose = (saved: boolean) => {
    setIsEditing(false);
    if (saved) {
      onUpdate();
    }
  };

  if (isEditing) {
    return (
      <div className="h-full overflow-y-auto bg-white p-6">
        <VersicherungForm fahrzeug={fahrzeug} onClose={handleFormClose} />
      </div>
    );
  }

  // Prüfen ob Versicherungsdaten vorhanden sind
  const hasInsuranceData = fahrzeug.versicherungsgesellschaft || fahrzeug.versicherungsnummer;

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-5 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🛡️</span>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Versicherung</h1>
              <p className="text-sm text-gray-500">{fahrzeug.hersteller} {fahrzeug.modell}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 font-medium transition-colors shadow-sm flex items-center gap-2"
              style={{ borderRadius: '16px' }}
              data-test-id="button-edit-versicherung"
              aria-label="Versicherung bearbeiten"
            >
              ✏️ Bearbeiten
            </button>
            {hasInsuranceData && fahrzeug.versicherungsgesellschaft && (
              <button
                onClick={() => {
                  const subject = encodeURIComponent(`Anfrage zu Versicherung - ${fahrzeug.kennzeichen} (${fahrzeug.hersteller} ${fahrzeug.modell})`);
                  const body = encodeURIComponent(
                    `Sehr geehrte Damen und Herren,\n\n` +
                    `hiermit wende ich mich bezüglich folgender Versicherung an Sie:\n\n` +
                    `Versicherungsnummer: ${fahrzeug.versicherungsnummer || 'N/A'}\n` +
                    `Fahrzeug: ${fahrzeug.hersteller} ${fahrzeug.modell}\n` +
                    `Kennzeichen: ${fahrzeug.kennzeichen}\n` +
                    `FIN: ${fahrzeug.fin || 'N/A'}\n` +
                    `Versicherungsart: ${fahrzeug.versicherungsart || 'N/A'}\n\n` +
                    `Grund der Anfrage:\n` +
                    `[Bitte hier den Grund eintragen]\n\n` +
                    `Mit freundlichen Grüßen\n` +
                    `Kimmel Zahntechnik`
                  );
                  window.location.href = `mailto:?subject=${subject}&body=${body}`;
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 font-medium transition-colors shadow-sm flex items-center gap-2"
                style={{ borderRadius: '16px' }}
                data-test-id="button-email-versicherung"
                aria-label="E-Mail an Versicherung senden"
              >
                ✉️ E-Mail an Versicherung
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">

        {!hasInsuranceData ? (
          /* Info wenn keine Daten vorhanden */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🛡️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Keine Versicherungsdaten hinterlegt
            </h3>
            <p className="text-sm text-gray-500">
              Klicken Sie auf "Bearbeiten", um Versicherungsinformationen hinzuzufügen.
            </p>
          </div>
        ) : (
          <>
            {/* Vertragsdaten Card */}
            <DataCard title="Vertragsdaten" icon="📄">
              <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                <DataField label="Versicherungsgesellschaft" value={fahrzeug.versicherungsgesellschaft} />
                <DataField label="Versicherungsnummer" value={fahrzeug.versicherungsnummer} />
                <DataField label="Versicherungsart" value={fahrzeug.versicherungsart} />
                <DataField label="Schadenfreiheitsklasse" value={fahrzeug.schadenfreiheitsklasse} />
                <DataField 
                  label="Vertragsbeginn" 
                  value={fahrzeug.vertragsbeginn ? new Date(fahrzeug.vertragsbeginn).toLocaleDateString('de-DE') : undefined} 
                />
                <DataField 
                  label="Vertragsende" 
                  value={fahrzeug.vertragsende ? new Date(fahrzeug.vertragsende).toLocaleDateString('de-DE') : undefined} 
                />
              </div>
            </DataCard>

            {/* Deckung & Kosten Card */}
            <DataCard title="Deckung & Kosten" icon="💰">
              <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                <DataField 
                  label="Deckungssumme" 
                  value={fahrzeug.deckungssumme ? `${Number(fahrzeug.deckungssumme).toLocaleString('de-DE')} €` : undefined} 
                />
                <DataField 
                  label="Jahresprämie" 
                  value={fahrzeug.jahrespraemie ? `${Number(fahrzeug.jahrespraemie).toLocaleString('de-DE')} € / Jahr` : undefined} 
                />
                <DataField 
                  label="Selbstbeteiligung Teilkasko" 
                  value={fahrzeug.selbstbeteiligungTeilkasko ? `${Number(fahrzeug.selbstbeteiligungTeilkasko).toLocaleString('de-DE')} €` : undefined} 
                />
                <DataField 
                  label="Selbstbeteiligung Vollkasko" 
                  value={fahrzeug.selbstbeteiligungVollkasko ? `${Number(fahrzeug.selbstbeteiligungVollkasko).toLocaleString('de-DE')} €` : undefined} 
                />
              </div>
            </DataCard>
          </>
        )}
      </div>
    </div>
  );
}
