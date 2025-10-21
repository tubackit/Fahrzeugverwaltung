interface StatWidgetProps {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'gray';
}

export default function StatWidget({ icon, label, value, unit, color = 'blue' }: StatWidgetProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    gray: 'text-gray-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 text-center">
      <div className="flex flex-col items-center gap-2 mb-3">
        <div className="text-3xl">{icon}</div>
        <div className="text-xs uppercase tracking-wide" style={{ color: 'black', fontWeight: '900' }}>{label}</div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</div>
        {unit && <div className="text-sm text-gray-500 font-medium">{unit}</div>}
      </div>
    </div>
  );
}

