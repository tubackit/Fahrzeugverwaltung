interface DataCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export default function DataCard({ title, icon, children, className = '' }: DataCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-8 ${className}`}>
      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-6 flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {title}
      </h3>
      <div>
        {children}
      </div>
    </div>
  );
}

interface DataFieldProps {
  label: string;
  value: string | number | null | undefined;
  className?: string;
}

export function DataField({ label, value, className = '' }: DataFieldProps) {
  if (!value) return null;
  
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs" style={{ color: 'black', fontWeight: '900' }}>{label}</span>
      <span className="text-base text-gray-900 font-bold">{value}</span>
    </div>
  );
}

