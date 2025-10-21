interface KennzeichenProps {
  kennzeichen: string;
  size?: 'small' | 'medium' | 'large';
}

export default function Kennzeichen({ kennzeichen, size = 'medium' }: KennzeichenProps) {
  const sizeClasses = {
    small: 'h-6 text-xs px-1',
    medium: 'h-8 text-sm px-2',
    large: 'h-12 text-2xl px-3',
  };

  return (
    <div 
      className={`inline-flex items-center bg-white rounded overflow-hidden ${sizeClasses[size]}`}
      style={{ 
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        border: 'none',
        boxShadow: 'none',
      }}
    >
      {/* Blauer EU-Balken */}
      <div 
        className="h-full flex flex-col items-center justify-center px-1 bg-blue-600 text-white"
        style={{ minWidth: size === 'small' ? '12px' : size === 'medium' ? '16px' : '20px' }}
      >
        <div className="text-yellow-400" style={{ fontSize: size === 'small' ? '5px' : size === 'medium' ? '7px' : '10px', lineHeight: '1.2' }}>
          ★★★<br/>★★★
        </div>
        <div className="font-bold mt-0.5" style={{ fontSize: size === 'small' ? '6px' : size === 'medium' ? '8px' : '10px' }}>
          D
        </div>
      </div>
      
      {/* Kennzeichen-Text */}
      <div className="px-2 text-black font-bold tracking-wider" style={{ fontSize: size === 'large' ? '1.5rem' : size === 'medium' ? '0.875rem' : '0.75rem' }}>
        {kennzeichen}
      </div>
    </div>
  );
}

