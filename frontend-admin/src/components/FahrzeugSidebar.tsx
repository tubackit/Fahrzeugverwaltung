import { useState } from 'react';
import clsx from 'clsx';
import * as XLSX from 'xlsx';
import type { Fahrzeug } from '../types';
import Kennzeichen from './Kennzeichen';
import FahrzeugForm from './FahrzeugForm';

interface FahrzeugSidebarProps {
  fahrzeuge: Fahrzeug[];
  selectedFahrzeug: Fahrzeug | null;
  onSelect: (fahrzeug: Fahrzeug) => void;
  onDataChange: () => void;
}

export default function FahrzeugSidebar({
  fahrzeuge,
  selectedFahrzeug,
  onSelect,
  onDataChange,
}: FahrzeugSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredFahrzeuge = fahrzeuge.filter((f) => {
    const search = searchTerm.toLowerCase();
    return (
      f.kennzeichen.toLowerCase().includes(search) ||
      f.hersteller.toLowerCase().includes(search) ||
      f.modell.toLowerCase().includes(search) ||
          (f.nutzer && f.nutzer.toLowerCase().includes(search))
    );
  });

  const handleFormClose = (saved: boolean) => {
    setShowForm(false);
    if (saved) {
      onDataChange();
    }
  };

  const handleExportToExcel = () => {
    // Daten für Export vorbereiten
    const exportData = fahrzeuge.map((f) => ({
      Kennzeichen: f.kennzeichen,
      Hersteller: f.hersteller,
      Modell: f.modell,
      Baureihe: f.baureihe || '',
      FIN: f.fin || '',
      Fahrzeugklasse: f.fahrzeugklasse || '',
      Farbe: f.farbe || '',
      Erstzulassung: f.erstzulassung || '',
      Leistung_PS: f.leistungPs || '',
      Leistung_kW: f.leistungKw || '',
      Kraftstoff: f.kraftstoff || '',
      Hubraum: f.hubraum || '',
      Getriebe: f.getriebe || '',
      Antrieb: f.antrieb || '',
      'Aktueller_km-Stand': f.aktuellerKmStand || '',
      HU_Termin: f.huTermin || '',
      AU_Termin: f.auTermin || '',
      SP_Termin: f.spTermin || '',
      Nutzer: f.nutzer || '',
      Einsatzort: f.einsatzort || '',
      Leasing_Ende: f.leasingEnde || '',
      Autohaus: f.autohaus || '',
      Kostenträger: f.kostentraeger || '',
      Datum_Anschaffung: f.datumAnschaffung || '',
      Vereinbarte_KM: f.vereinbarteKm || '',
      Bemerkungen: f.bemerkungen || '',
      Versicherungsgesellschaft: f.versicherungsgesellschaft || '',
      Versicherungsnummer: f.versicherungsnummer || '',
      Versicherungsart: f.versicherungsart || '',
      Deckungssumme: f.deckungssumme || '',
      Selbstbeteiligung_Teilkasko: f.selbstbeteiligungTeilkasko || '',
      Selbstbeteiligung_Vollkasko: f.selbstbeteiligungVollkasko || '',
      Jahresprämie: f.jahrespraemie || '',
      Vertragsbeginn: f.vertragsbeginn || '',
      Vertragsende: f.vertragsende || '',
      Schadenfreiheitsklasse: f.schadenfreiheitsklasse || '',
    }));

    // Excel-Arbeitsmappe erstellen
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fahrzeuge');

    // Datei herunterladen
    const fileName = `Fahrzeuge_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleImportFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // Daten importieren
        for (const row of jsonData) {
          const fahrzeugData: Partial<Fahrzeug> = {
            kennzeichen: row.Kennzeichen || '',
            hersteller: row.Hersteller || '',
            modell: row.Modell || '',
            baureihe: row.Baureihe || '',
            fin: row.FIN || '',
            fahrzeugklasse: row.Fahrzeugklasse || '',
            farbe: row.Farbe || '',
            erstzulassung: row.Erstzulassung || '',
            leistungPs: row.Leistung_PS || null,
            leistungKw: row.Leistung_kW || null,
            kraftstoff: row.Kraftstoff || '',
            hubraum: row.Hubraum || null,
            getriebe: row.Getriebe || '',
            antrieb: row.Antrieb || '',
            aktuellerKmStand: row['Aktueller_km-Stand'] || null,
            huTermin: row.HU_Termin || '',
            auTermin: row.AU_Termin || '',
            spTermin: row.SP_Termin || '',
            nutzer: row.Nutzer || '',
            einsatzort: row.Einsatzort || '',
            leasingEnde: row.Leasing_Ende || '',
            autohaus: row.Autohaus || '',
            kostentraeger: row.Kostenträger || '',
            datumAnschaffung: row.Datum_Anschaffung || '',
            vereinbarteKm: row.Vereinbarte_KM || null,
            bemerkungen: row.Bemerkungen || '',
            versicherungsgesellschaft: row.Versicherungsgesellschaft || '',
            versicherungsnummer: row.Versicherungsnummer || '',
            versicherungsart: row.Versicherungsart || '',
            deckungssumme: row.Deckungssumme || '',
            selbstbeteiligungTeilkasko: row.Selbstbeteiligung_Teilkasko || '',
            selbstbeteiligungVollkasko: row.Selbstbeteiligung_Vollkasko || '',
            jahrespraemie: row.Jahresprämie || '',
            vertragsbeginn: row.Vertragsbeginn || '',
            vertragsende: row.Vertragsende || '',
            schadenfreiheitsklasse: row.Schadenfreiheitsklasse || '',
          };

          // Fahrzeug per API anlegen
          await fetch('/api/fahrzeuge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fahrzeugData),
          });
        }

        alert(`${jsonData.length} Fahrzeuge erfolgreich importiert!`);
        onDataChange();
        event.target.value = ''; // Input zurücksetzen
      } catch (error) {
        console.error('Import-Fehler:', error);
        alert('Fehler beim Importieren der Excel-Datei');
      }
    };
    reader.readAsBinaryString(file);
  };

  if (showForm) {
    return (
      <div className="w-[280px] h-full bg-white overflow-y-auto p-4">
        <FahrzeugForm fahrzeug={null} onClose={handleFormClose} />
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Hauptaktion - Prominent oben */}
      <div className="p-4 pb-2">
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-gray-400"
          style={{ borderRadius: '16px' }}
          data-test-id="button-add-fahrzeug"
          aria-label="Neues Fahrzeug hinzufügen"
        >
          <span className="text-lg">+</span> Neues Fahrzeug
        </button>
      </div>

      {/* Header */}
      <div className="px-4 pb-3 pt-2">
        <h2 className="font-semibold text-gray-700 text-xs tracking-wide uppercase text-center">
          Fahrzeuge <span className="text-gray-400">({fahrzeuge.length})</span>
        </h2>
      </div>

      {/* Fahrzeugliste */}
      <div className="flex-1 overflow-y-auto">
        {filteredFahrzeuge.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-sm">Keine Fahrzeuge gefunden</p>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {filteredFahrzeuge.map((fahrzeug) => (
              <button
                key={fahrzeug.id}
                onClick={() => onSelect(fahrzeug)}
                className={clsx(
                  'w-full px-4 py-4 transition-all duration-150',
                  selectedFahrzeug?.id === fahrzeug.id 
                    ? 'bg-blue-50' 
                    : 'bg-gray-50 hover:bg-gray-100'
                )}
                style={{ borderRadius: '16px', border: 'none' }}
                data-test-id={`fahrzeug-item-${fahrzeug.id}`}
                aria-label={`Fahrzeug ${fahrzeug.kennzeichen} auswählen`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Kennzeichen kennzeichen={fahrzeug.kennzeichen} size="small" />
                  <div className="text-sm font-medium text-gray-900 text-center">
                    {fahrzeug.hersteller} {fahrzeug.modell}
                  </div>
                      {fahrzeug.nutzer && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span>👤</span> {fahrzeug.nutzer}
                        </div>
                      )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Suche */}
      <div className="p-4 mt-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Suchen..."
          className="w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border border-gray-300 transition-colors"
          style={{ borderRadius: '16px' }}
          data-test-id="input-search"
          aria-label="Fahrzeuge suchen"
        />
      </div>

      {/* Aktionen */}
      <div className="p-4 mt-2 space-y-2">
        {/* Excel Export/Import - Gleich breit mit Border */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportToExcel}
            className="hover:bg-gray-100 text-gray-600 p-2 text-base transition-colors flex items-center justify-center border border-gray-400"
            style={{ borderRadius: '16px', backgroundColor: 'rgb(243 244 246)' }}
            data-test-id="button-export-excel"
            aria-label="Fahrzeuge als Excel exportieren"
            title="Excel Export"
          >
            📊
          </button>

          <label className="hover:bg-gray-100 text-gray-600 p-2 text-base transition-colors flex items-center justify-center cursor-pointer border border-gray-400"
            style={{ borderRadius: '16px', backgroundColor: 'rgb(243 244 246)' }}>
            📥
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportFromExcel}
              className="hidden"
              data-test-id="input-import-excel"
              aria-label="Excel-Datei importieren"
              title="Excel Import"
            />
          </label>
        </div>
        
        {selectedFahrzeug && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Trigger Bearbeiten-Modus im Parent
                const editButton = document.querySelector('[data-test-id="button-edit-fahrzeug"]') as HTMLButtonElement;
                editButton?.click();
              }}
              className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 p-2 text-base transition-colors flex items-center justify-center border border-gray-400"
              style={{ borderRadius: '16px', backgroundColor: 'rgb(243 244 246)' }}
              data-test-id="button-edit-fahrzeug-sidebar"
              aria-label="Fahrzeug bearbeiten"
              title="Bearbeiten"
            >
              ✏️
            </button>
            
            <button
              onClick={async () => {
                if (confirm(`Fahrzeug ${selectedFahrzeug.kennzeichen} wirklich löschen?`)) {
                  try {
                    const response = await fetch(`/api/fahrzeuge/${selectedFahrzeug.id}`, {
                      method: 'DELETE',
                    });
                    if (response.ok) {
                      onDataChange();
                      alert('Fahrzeug erfolgreich gelöscht!');
                    } else {
                      alert('Fehler beim Löschen');
                    }
                  } catch (error) {
                    console.error('Fehler:', error);
                    alert('Verbindungsfehler');
                  }
                }
              }}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 p-2 text-base transition-colors flex items-center justify-center border border-gray-400"
              style={{ borderRadius: '16px' }}
              data-test-id="button-delete-fahrzeug"
              aria-label="Fahrzeug löschen"
              title="Löschen"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

