// Gemeinsame TypeScript Types für Frontend und Backend

export interface Fahrzeug {
  id: number;
  kennzeichen: string;
  hersteller: string;
  modell: string;
  fahrzeugklasse?: string;
  typ?: string;
  sitze?: number;
  fin?: string; // Fahrzeug-Identifizierungsnummer
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
  pin?: string; // Für Nutzer-Login
  nutzer?: string; // Zugewiesener Nutzer
  // Weitere Stammdaten
  einsatzort?: string;
  leasingEnde?: string;
  autohaus?: string;
  kostentraeger?: string;
  datumAnschaffung?: string;
  vereinbarteKm?: number;
  // Untersuchungstermine
  huTermin?: string; // HU (Hauptuntersuchung / TÜV)
  auTermin?: string; // AU (Abgasuntersuchung)
  spTermin?: string; // SP (Sicherheitsprüfung)
  // Versicherungsdaten
  versicherungsgesellschaft?: string;
  versicherungsnummer?: string;
  versicherungsart?: string; // z.B. Haftpflicht, Teilkasko, Vollkasko
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

export interface Fahrtenbuch {
  id: number;
  fahrzeugId: number;
  datum: string;
  kmStart: number;
  kmEnde: number;
  kmGesamt: number;
  nutzer?: string;
  zweck?: string;
  route?: string;
  bemerkungen?: string;
  createdAt: string;
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
  bildUrls?: string[];
  bemerkungen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wartung {
  id: number;
  fahrzeugId: number;
  datum: string;
  kmStand: number;
  wartungsart: 'Inspektion' | 'Ölwechsel' | 'Reifen' | 'TÜV/HU' | 'AU' | 'Sonstiges';
  beschreibung: string;
  kosten?: number;
  werkstatt?: string;
  naechsteWartungKm?: number;
  naechsteWartungDatum?: string;
  status: 'Geplant' | 'Durchgeführt' | 'Überfällig';
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

// API Request/Response Types
export interface CreateFahrzeugRequest {
  kennzeichen: string;
  hersteller: string;
  modell: string;
  pin?: string;
  [key: string]: unknown;
}

export interface UpdateFahrzeugRequest {
  [key: string]: unknown;
}

export interface FahrerLoginRequest {
  kennzeichen: string;
  pin: string;
}

export interface FahrerLoginResponse {
  success: boolean;
  fahrzeug?: Fahrzeug;
  message?: string;
}

export interface CreateSchadensmeldungRequest {
  fahrzeugId: number;
  kmStand: number;
  beschreibung: string;
  schadensart: Schadensmeldung['schadensart'];
  schweregrad: Schadensmeldung['schweregrad'];
  melder?: string;
  bemerkungen?: string;
}

export interface CreateWartungsMeldungRequest {
  fahrzeugId: number;
  kmStand: number;
  beschreibung: string;
  dringlichkeit: WartungsMeldung['dringlichkeit'];
  melder?: string;
  bemerkungen?: string;
}

export interface UpdateKmStandRequest {
  fahrzeugId: number;
  kmStand: number;
}

