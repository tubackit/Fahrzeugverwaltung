// Shared types for Admin Dashboard
export interface Fahrzeug {
  id: number;
  kennzeichen: string;
  hersteller: string;
  modell: string;
  fahrzeugklasse?: string;
  typ?: string;
  sitze?: number;
  fin?: string;
  hsn?: string;
  tsn?: string;
  farbe?: string;
  aufbau?: string;
  tueren?: number;
  motorart?: string;
  kraftstoffart?: string;
  leergewicht?: number;
  zulaessigesGesamtgewicht?: number;
  hubraum?: number;
  leistungKW?: number;
  leistungPS?: number;
  laenge?: number;
  breite?: number;
  baujahr?: number;
  anschaffungsjahr?: number;
  erstzulassung?: string;
  zulassungAm?: string;
  zulassungsart?: string;
  aktuellerKmStand?: number;
  bemerkungen?: string;
  bildUrl?: string;
  pin?: string;
  nutzer?: string;
  // Weitere Stammdaten
  einsatzort?: string;
  leasingEnde?: string;
  autohaus?: string;
  kostentraeger?: string;
  datumAnschaffung?: string;
  vereinbarteKm?: number;
  // Untersuchungstermine
  huTermin?: string;
  auTermin?: string;
  spTermin?: string;
  // Versicherungsdaten
  versicherungsgesellschaft?: string;
  versicherungsnummer?: string;
  versicherungsart?: string;
  deckungssumme?: number;
  selbstbeteiligungTeilkasko?: number;
  selbstbeteiligungVollkasko?: number;
  jahrespraemie?: number;
  vertragsbeginn?: string;
  vertragsende?: string;
  schadenfreiheitsklasse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Schadensmeldung {
  id: number;
  fahrzeugId: number;
  datum: string;
  kmStand: number;
  beschreibung: string;
  schadensart: 'Unfall' | 'Kratzer' | 'Delle' | 'Technisch' | 'Sonstiges';
  schweregrad: 'Leicht' | 'Mittel' | 'Schwer';
  status: 'Gemeldet' | 'In Bearbeitung' | 'Repariert' | 'Abgeschlossen';
  melder?: string;
  bildUrls?: string;
  bemerkungen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WartungsMeldung {
  id: number;
  fahrzeugId: number;
  datum: string;
  kmStand: number;
  beschreibung: string;
  dringlichkeit: 'Niedrig' | 'Mittel' | 'Hoch' | 'Sofort';
  status: 'Gemeldet' | 'Bestätigt' | 'Geplant' | 'Erledigt';
  melder?: string;
  bemerkungen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tankbuchung {
  id: number;
  fahrzeugId: number;
  datum: string;
  kmStand: number;
  liter: number;
  kosten: number;
  tankstelle?: string;
  vollTankung: boolean;
  bemerkungen?: string;
  createdAt: string;
}


