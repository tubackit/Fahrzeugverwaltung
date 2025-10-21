import { useState } from 'react';
import type { Fahrzeug } from '../types';
import FahrzeugForm from './FahrzeugForm';
import Kennzeichen from './Kennzeichen';
import DataCard, { DataField } from './DataCard';

interface FahrzeugDetailsProps {
  fahrzeug: Fahrzeug;
  onUpdate: () => void;
}

export default function FahrzeugDetails({ fahrzeug, onUpdate }: FahrzeugDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleFormClose = (saved: boolean) => {
    setIsEditing(false);
    if (saved) {
      onUpdate();
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        
        // Bild direkt an den Server senden
        try {
          const response = await fetch(`/api/fahrzeuge/${fahrzeug.id}/upload-image`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageData: imageUrl }),
          });
          
          if (response.ok) {
            console.log('Bild erfolgreich hochgeladen für Fahrzeug:', fahrzeug.kennzeichen, file.name);
            // Fahrzeugdaten aktualisieren, damit das Bild angezeigt wird
            onUpdate();
          } else {
            console.error('Fehler beim Hochladen des Bildes');
          }
        } catch (error) {
          console.error('Fehler beim Hochladen des Bildes:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (isEditing) {
    return (
      <div className="h-full bg-white">
        <FahrzeugForm fahrzeug={fahrzeug} onClose={handleFormClose} />
      </div>
    );
  }

  // Fahrzeugbild mit Upload-Möglichkeit - klein und kompakt
  const FahrzeugBild = () => (
    <div className="space-y-2 max-w-[200px]">
          <div className="image-border bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg shadow-md p-1">
        <div className="w-full h-32 relative overflow-hidden rounded">
          {fahrzeug.bildUrl ? (
            <img 
              src={fahrzeug.bildUrl} 
              alt={`${fahrzeug.kennzeichen} - ${fahrzeug.hersteller} ${fahrzeug.modell}`}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-2 rounded">
              <div className="text-3xl mb-1">🚗</div>
              <div className="text-xs font-bold text-blue-800 text-center">{fahrzeug.kennzeichen}</div>
            </div>
          )}
        </div>
      </div>
      
      <button 
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1.5 text-xs font-bold transition shadow-md flex items-center justify-center gap-1"
        style={{ borderRadius: '16px' }}
        onClick={() => document.getElementById('image-upload')?.click()}
        data-test-id="button-upload-image"
        aria-label="Fahrzeugbild hochladen"
      >
        📷 Bild
      </button>
      
      <input 
        id="image-upload"
        type="file" 
        accept="image/*" 
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header mit Bearbeiten-Button */}
      <div className="bg-white px-6 py-5 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Kennzeichen kennzeichen={fahrzeug.kennzeichen} size="large" />
            </div>
            <h1 className="font-semibold text-gray-900" style={{ fontSize: '1.5rem', lineHeight: '1', margin: 0 }}>
              {fahrzeug.hersteller} {fahrzeug.modell}
            </h1>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 font-medium transition-colors shadow-sm flex items-center gap-2"
            style={{ borderRadius: '16px' }}
            data-test-id="button-edit-fahrzeug"
            aria-label="Fahrzeug bearbeiten"
          >
            ✏️ Bearbeiten
          </button>
        </div>
      </div>

      {/* Content - Card-basiertes Layout mit viel Whitespace */}
      <div className="p-8 space-y-6">
        
        {/* Bild-Card - Oben rechts sticky */}
        <div className="float-right ml-4 mb-4">
          <FahrzeugBild />
        </div>

        {/* Stammdaten Card */}
        <DataCard title="Stammdaten" icon="📋">
          <div className="grid grid-cols-2 gap-x-12 gap-y-5">
            <DataField label="Hersteller" value={fahrzeug.hersteller} />
            <DataField label="Modell / Baureihe" value={fahrzeug.modell} />
            <DataField label="Nutzer" value={fahrzeug.nutzer} />
            <DataField label="Farbe" value={fahrzeug.farbe} />
            <DataField label="Erstzulassung" value={fahrzeug.erstzulassung} type="date" />
            <DataField label="Anschaffungsjahr" value={fahrzeug.anschaffungsjahr} />
            <DataField label="Einsatzort" value={fahrzeug.einsatzort} />
            <DataField label="Autohaus" value={fahrzeug.autohaus} />
            <DataField label="Kostenträger" value={fahrzeug.kostentraeger} />
            <DataField label="Datum Anschaffung" value={fahrzeug.datumAnschaffung} type="date" />
            <DataField label="Leasing Ende" value={fahrzeug.leasingEnde} type="date" />
            <DataField label="Vereinbarte KM" value={fahrzeug.vereinbarteKm} />
          </div>
        </DataCard>

        {/* Technische Daten Card */}
        <DataCard title="Technische Daten" icon="🔧">
          <div className="grid grid-cols-3 gap-x-12 gap-y-5">
            <DataField label="FIN" value={fahrzeug.fin} className="col-span-3" />
            <DataField label="HSN" value={fahrzeug.hsn} />
            <DataField label="Kraftstoff" value={fahrzeug.kraftstoff} />
            <DataField label="Hubraum (ccm)" value={fahrzeug.hubraum} />
            <DataField label="TSN" value={fahrzeug.tsn} />
            <DataField label="Leistung (PS)" value={fahrzeug.leistungPs} />
            <DataField label="Leistung (kW)" value={fahrzeug.leistungKw} />
            <DataField label="Getriebe" value={fahrzeug.getriebe} />
            <DataField label="Antrieb" value={fahrzeug.antrieb} />
          </div>
        </DataCard>

        {/* KM-Stand - Sehr prominent */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-md p-8">
          <p className="text-xs mb-4 uppercase tracking-wider" style={{ color: 'black', fontWeight: '900' }}>Aktueller Kilometerstand</p>
          <div className="flex items-baseline gap-3">
            <div className="text-6xl font-bold text-blue-600">
              {fahrzeug.aktuellerKmStand ? fahrzeug.aktuellerKmStand.toLocaleString('de-DE', { minimumFractionDigits: 0 }) : '0'}
            </div>
            <div className="text-2xl font-medium text-gray-400">km</div>
          </div>
        </div>

        {/* Nächste Untersuchungen */}
        <DataCard title="Nächste Untersuchungen" icon="📅">
          <div className="grid grid-cols-3 gap-x-12 gap-y-5">
            <DataField 
              label="HU (TÜV)" 
              value={fahrzeug.huTermin ? new Date(fahrzeug.huTermin).toLocaleDateString('de-DE') : undefined} 
            />
            <DataField 
              label="AU (Abgas)" 
              value={fahrzeug.auTermin ? new Date(fahrzeug.auTermin).toLocaleDateString('de-DE') : undefined} 
            />
            <DataField 
              label="SP (Sicherheit)" 
              value={fahrzeug.spTermin ? new Date(fahrzeug.spTermin).toLocaleDateString('de-DE') : undefined} 
            />
          </div>
        </DataCard>

        {/* Bemerkungen */}
        {fahrzeug.bemerkungen && (
          <DataCard title="Bemerkungen" icon="📝">
            <p className="text-sm text-gray-700 leading-relaxed">
              {fahrzeug.bemerkungen}
            </p>
          </DataCard>
        )}
      </div>
    </div>
  );
}

interface DataRowProps {
  label: string;
  value?: string;
  highlight?: boolean;
}

function DataRow({ label, value, highlight }: DataRowProps) {
  if (!value) return null;

  return (
    <div className={`flex justify-between items-center py-2 border-b border-gray-200 ${highlight ? 'bg-blue-50 px-3 -mx-3 rounded' : ''}`}>
      <span className="text-sm text-gray-600 font-medium">{label}:</span>
      <span className={`text-sm ${highlight ? 'font-bold text-blue-900' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}

