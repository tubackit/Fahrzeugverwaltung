// Import shared types from backend
export interface Fahrzeug {
  id: number;
  kennzeichen: string;
  hersteller: string;
  modell: string;
  fahrzeugklasse?: string;
  aktuellerKmStand?: number;
  bemerkungen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Schadensmeldung {
  id?: number;
  fahrzeugId: number;
  datum?: string;
  kmStand: number;
  beschreibung: string;
  schadensart: 'Unfall' | 'Kratzer' | 'Delle' | 'Technisch' | 'Sonstiges';
  schweregrad: 'Leicht' | 'Mittel' | 'Schwer';
  melder?: string;
  bemerkungen?: string;
}

export interface WartungsMeldung {
  id?: number;
  fahrzeugId: number;
  datum?: string;
  kmStand: number;
  beschreibung: string;
  dringlichkeit: 'Niedrig' | 'Mittel' | 'Hoch' | 'Sofort';
  melder?: string;
  bemerkungen?: string;
}

export interface LoginResponse {
  success: boolean;
  fahrzeug?: Fahrzeug;
  message?: string;
}


