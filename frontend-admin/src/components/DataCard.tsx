interface DataCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export default function DataCard({ title, icon, children, className = '', headerAction }: DataCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-8 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          {title}
        </h3>
        {headerAction && (
          <div>
            {headerAction}
          </div>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

interface DataFieldProps {
  label: string;
  value: string | number | null | undefined;
  type?: 'email' | 'date' | 'text' | 'tel';
  className?: string;
}

// Hilfsfunktion um zu prüfen, ob ein Wert eine E-Mail-Adresse ist
const isEmail = (value: string | number | null | undefined): boolean => {
  if (!value || typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

// Hilfsfunktion um zu prüfen, ob ein Wert eine Telefonnummer ist
const isPhone = (value: string | number | null | undefined): boolean => {
  if (!value || typeof value !== 'string') return false;
  // Einfache Prüfung: enthält Ziffern und typische Telefonzeichen
  return /^[\d\s\-\+\(\)]+$/.test(value) && value.length >= 6;
};

export function DataField({ label, value, type, className = '' }: DataFieldProps) {
  if (!value) return null;
  
  // Wenn type="email" oder der Wert eine E-Mail-Adresse ist, als Link anzeigen
  const isEmailValue = type === 'email' || isEmail(value);
  // Wenn type="tel" oder der Wert eine Telefonnummer ist, als Link anzeigen
  const isPhoneValue = type === 'tel' || isPhone(value);
  
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs" style={{ color: 'black', fontWeight: '900' }}>{label}</span>
      {isEmailValue && typeof value === 'string' ? (
        <a 
          href={`mailto:${value}`}
          className="text-base text-blue-600 font-bold hover:text-blue-800 hover:underline transition"
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </a>
      ) : isPhoneValue && typeof value === 'string' ? (
        <a 
          href={`tel:${value.replace(/\s/g, '')}`}
          className="text-base text-blue-600 font-bold hover:text-blue-800 hover:underline transition"
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </a>
      ) : (
        <span className="text-base text-gray-900 font-bold">{value}</span>
      )}
    </div>
  );
}

