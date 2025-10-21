import { useState } from 'react';
import type { Fahrzeug } from '../types';

interface FahrzeugFormProps {
  fahrzeug: Fahrzeug | null;
  onClose: (saved: boolean) => void;
}

export default function FahrzeugForm({ fahrzeug, onClose }: FahrzeugFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    kennzeichen: fahrzeug?.kennzeichen || '',
    hersteller: fahrzeug?.hersteller || '',
    modell: fahrzeug?.modell || '',
    fahrzeugklasse: fahrzeug?.fahrzeugklasse || '',
    typ: fahrzeug?.typ || '',
    sitze: fahrzeug?.sitze || '',
    fin: fahrzeug?.fin || '',
    hsn: fahrzeug?.hsn || '',
    tsn: fahrzeug?.tsn || '',
    farbe: fahrzeug?.farbe || '',
    baujahr: fahrzeug?.baujahr || '',
    aktuellerKmStand: fahrzeug?.aktuellerKmStand || '',
    pin: fahrzeug?.pin || '',
    nutzer: fahrzeug?.nutzer || '',
    einsatzort: fahrzeug?.einsatzort || '',
    leasingEnde: fahrzeug?.leasingEnde || '',
    autohaus: fahrzeug?.autohaus || '',
    kostentraeger: fahrzeug?.kostentraeger || '',
    datumAnschaffung: fahrzeug?.datumAnschaffung || '',
    vereinbarteKm: fahrzeug?.vereinbarteKm || '',
    bemerkungen: fahrzeug?.bemerkungen || '',
    // Untersuchungstermine
    huTermin: fahrzeug?.huTermin || '',
    auTermin: fahrzeug?.auTermin || '',
    spTermin: fahrzeug?.spTermin || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = fahrzeug ? `/api/fahrzeuge/${fahrzeug.id}` : '/api/fahrzeuge';
      const method = fahrzeug ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onClose(true);
      } else {
        const data = await response.json();
        alert(data.error || 'Fehler beim Speichern');
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Verbindungsfehler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-400 sticky top-0 bg-white z-10">
        <h2 className="text-2xl font-bold text-gray-900">
          {fahrzeug ? 'Fahrzeug bearbeiten' : 'Neues Fahrzeug'}
        </h2>
        <button
          onClick={() => onClose(false)}
          className="text-gray-400 hover:text-gray-600 text-2xl"
          data-test-id="button-close-form"
          aria-label="Formular schließen"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Grunddaten */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="kennzeichen" className="block text-sm font-medium text-gray-700 mb-2">
              Kennzeichen *
            </label>
            <input
              id="kennzeichen"
              name="kennzeichen"
              type="text"
              value={formData.kennzeichen}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-kennzeichen"
              aria-label="Kennzeichen"
            />
          </div>

          <div>
            <label htmlFor="hersteller" className="block text-sm font-medium text-gray-700 mb-2">
              Hersteller *
            </label>
            <input
              id="hersteller"
              name="hersteller"
              type="text"
              value={formData.hersteller}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-hersteller"
              aria-label="Hersteller"
            />
          </div>

          <div>
            <label htmlFor="modell" className="block text-sm font-medium text-gray-700 mb-2">
              Modell *
            </label>
            <input
              id="modell"
              name="modell"
              type="text"
              value={formData.modell}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-modell"
              aria-label="Modell"
            />
          </div>
        </div>

        {/* Zusätzliche Informationen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fahrzeugklasse" className="block text-sm font-medium text-gray-700 mb-2">
              Fahrzeugklasse
            </label>
            <input
              id="fahrzeugklasse"
              name="fahrzeugklasse"
              type="text"
              value={formData.fahrzeugklasse}
              onChange={handleChange}
              placeholder="z.B. Mittelklasse"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-fahrzeugklasse"
              aria-label="Fahrzeugklasse"
            />
          </div>

          <div>
            <label htmlFor="typ" className="block text-sm font-medium text-gray-700 mb-2">
              Typ
            </label>
            <input
              id="typ"
              name="typ"
              type="text"
              value={formData.typ}
              onChange={handleChange}
              placeholder="z.B. Kombi, Limousine"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-typ"
              aria-label="Typ"
            />
          </div>
        </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="baujahr" className="block text-sm font-medium text-gray-700 mb-2">
              Baujahr
            </label>
            <input
              id="baujahr"
              name="baujahr"
              type="number"
              value={formData.baujahr}
              onChange={handleChange}
              placeholder="z.B. 2020"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-baujahr"
              aria-label="Baujahr"
            />
          </div>

          <div>
            <label htmlFor="farbe" className="block text-sm font-medium text-gray-700 mb-2">
              Farbe
            </label>
            <input
              id="farbe"
              name="farbe"
              type="text"
              value={formData.farbe}
              onChange={handleChange}
              placeholder="z.B. Schwarz-Metallic"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-farbe"
              aria-label="Farbe"
            />
          </div>

          <div>
            <label htmlFor="sitze" className="block text-sm font-medium text-gray-700 mb-2">
              Anzahl Sitze
            </label>
            <input
              id="sitze"
              name="sitze"
              type="number"
              value={formData.sitze}
              onChange={handleChange}
              placeholder="z.B. 5"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-sitze"
              aria-label="Anzahl Sitze"
            />
          </div>
        </div>

        {/* Technische Daten */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="fin" className="block text-sm font-medium text-gray-700 mb-2">
              FIN (Fahrzeug-ID)
            </label>
            <input
              id="fin"
              name="fin"
              type="text"
              value={formData.fin}
              onChange={handleChange}
              placeholder="17-stellig"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-fin"
              aria-label="FIN"
            />
          </div>

          <div>
            <label htmlFor="hsn" className="block text-sm font-medium text-gray-700 mb-2">
              HSN
            </label>
            <input
              id="hsn"
              name="hsn"
              type="text"
              value={formData.hsn}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-hsn"
              aria-label="HSN"
            />
          </div>

          <div>
            <label htmlFor="tsn" className="block text-sm font-medium text-gray-700 mb-2">
              TSN
            </label>
            <input
              id="tsn"
              name="tsn"
              type="text"
              value={formData.tsn}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-tsn"
              aria-label="TSN"
            />
          </div>
        </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="aktuellerKmStand" className="block text-sm font-medium text-gray-700 mb-2">
              Aktueller KM-Stand
            </label>
            <input
              id="aktuellerKmStand"
              name="aktuellerKmStand"
              type="number"
              step="0.1"
              value={formData.aktuellerKmStand}
              onChange={handleChange}
              placeholder="z.B. 50000"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-km-stand"
              aria-label="Kilometerstand"
            />
          </div>

          <div>
            <label htmlFor="nutzer" className="block text-sm font-medium text-gray-700 mb-2">
              Zugewiesener Nutzer
            </label>
            <input
              id="nutzer"
              name="nutzer"
              type="text"
              value={formData.nutzer}
              onChange={handleChange}
              placeholder="z.B. Max Mustermann"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-nutzer"
              aria-label="Nutzer"
            />
          </div>

          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
              PIN (für Nutzer-Login)
            </label>
            <input
              id="pin"
              name="pin"
              type="text"
              value={formData.pin}
              onChange={handleChange}
              placeholder="4-stellig"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-pin"
              aria-label="PIN"
            />
          </div>

          <div>
            <label htmlFor="einsatzort" className="block text-sm font-medium text-gray-700 mb-2">
              Einsatzort
            </label>
            <input
              id="einsatzort"
              name="einsatzort"
              type="text"
              value={formData.einsatzort}
              onChange={handleChange}
              placeholder="z.B. Hauptsitz"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-einsatzort"
              aria-label="Einsatzort"
            />
          </div>

          <div>
            <label htmlFor="leasingEnde" className="block text-sm font-medium text-gray-700 mb-2">
              Leasing Ende
            </label>
            <input
              id="leasingEnde"
              name="leasingEnde"
              type="date"
              value={formData.leasingEnde}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-leasing-ende"
              aria-label="Leasing Ende"
            />
          </div>

          <div>
            <label htmlFor="autohaus" className="block text-sm font-medium text-gray-700 mb-2">
              Autohaus
            </label>
            <input
              id="autohaus"
              name="autohaus"
              type="text"
              value={formData.autohaus}
              onChange={handleChange}
              placeholder="z.B. Autohaus Müller"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-autohaus"
              aria-label="Autohaus"
            />
          </div>

          <div>
            <label htmlFor="kostentraeger" className="block text-sm font-medium text-gray-700 mb-2">
              Kostenträger
            </label>
            <input
              id="kostentraeger"
              name="kostentraeger"
              type="text"
              value={formData.kostentraeger}
              onChange={handleChange}
              placeholder="z.B. Abteilung Vertrieb"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-kostentraeger"
              aria-label="Kostenträger"
            />
          </div>

          <div>
            <label htmlFor="datumAnschaffung" className="block text-sm font-medium text-gray-700 mb-2">
              Datum Anschaffung
            </label>
            <input
              id="datumAnschaffung"
              name="datumAnschaffung"
              type="date"
              value={formData.datumAnschaffung}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-datum-anschaffung"
              aria-label="Datum Anschaffung"
            />
          </div>

          <div>
            <label htmlFor="vereinbarteKm" className="block text-sm font-medium text-gray-700 mb-2">
              Vereinbarte KM
            </label>
            <input
              id="vereinbarteKm"
              name="vereinbarteKm"
              type="number"
              value={formData.vereinbarteKm}
              onChange={handleChange}
              placeholder="z.B. 15000"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
              data-test-id="input-vereinbarte-km"
              aria-label="Vereinbarte KM"
            />
          </div>
        </div>

        {/* Untersuchungstermine */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-gray-400 rounded-lg p-4 shadow-md">
          <h3 className="text-sm font-bold text-red-800 mb-4 flex items-center gap-2">
            <span>📅</span> Nächste Untersuchungstermine (TÜV, AU, SP)
          </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="huTermin" className="block text-sm font-medium text-red-700 mb-2">
                HU (Hauptuntersuchung / TÜV)
              </label>
              <input
                id="huTermin"
                name="huTermin"
                type="date"
                value={formData.huTermin}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-gray-400 outline-none transition"
                data-test-id="input-hu-termin"
                aria-label="HU Termin"
              />
            </div>

            <div>
              <label htmlFor="auTermin" className="block text-sm font-medium text-red-700 mb-2">
                AU (Abgasuntersuchung)
              </label>
              <input
                id="auTermin"
                name="auTermin"
                type="date"
                value={formData.auTermin}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-gray-400 outline-none transition"
                data-test-id="input-au-termin"
                aria-label="AU Termin"
              />
            </div>

            <div>
              <label htmlFor="spTermin" className="block text-sm font-medium text-red-700 mb-2">
                SP (Sicherheitsprüfung)
              </label>
              <input
                id="spTermin"
                name="spTermin"
                type="date"
                value={formData.spTermin}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-gray-400 outline-none transition"
                data-test-id="input-sp-termin"
                aria-label="SP Termin"
              />
            </div>
          </div>
        </div>

        {/* Bemerkungen */}
        <div>
          <label htmlFor="bemerkungen" className="block text-sm font-medium text-gray-700 mb-2">
            Bemerkungen
          </label>
          <textarea
            id="bemerkungen"
            name="bemerkungen"
            value={formData.bemerkungen}
            onChange={handleChange}
            rows={3}
            placeholder="Zusätzliche Informationen..."
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition resize-none"
            data-test-id="textarea-bemerkungen"
            aria-label="Bemerkungen"
          />
        </div>
        </div>

        {/* Buttons - Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-400 p-6 pt-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-md"
              data-test-id="button-cancel"
              aria-label="Abbrechen"
            >
              ❌ Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-3 rounded-lg font-bold transition shadow-md hover:shadow-lg"
              data-test-id="button-save"
              aria-label="Speichern"
            >
              {loading ? 'Wird gespeichert...' : '💾 Speichern'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

