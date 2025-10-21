import { ReactNode } from 'react';

interface EnterpriseLayoutProps {
  children: ReactNode;
  onStammdatenClick?: () => void;
  onVersicherungClick?: () => void;
  onUnterlagenClick?: () => void;
  activeView?: 'stammdaten' | 'versicherung' | 'unterlagen';
}

interface ToolbarButtonProps {
  icon: string;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

function ToolbarButton({ icon, label, onClick, isActive }: ToolbarButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors border border-gray-400 ${
        isActive 
          ? 'text-gray-700' 
          : 'text-gray-700 hover:bg-gray-100 bg-gray-50'
      }`}
      style={{ 
        borderRadius: '16px',
        backgroundColor: isActive ? '#fed7aa' : undefined
      }}
      data-test-id={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}
      aria-label={label}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default function EnterpriseLayout({ children, onStammdatenClick, onVersicherungClick, onUnterlagenClick, activeView }: EnterpriseLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header / Menüleiste */}
      <header className="bg-white shadow-sm">
        {/* Überschrift - Minimal */}
        <div className="bg-white px-6 py-3 flex justify-center">
          <h1 className="text-base font-medium text-gray-700 px-6 py-2" style={{ borderRadius: '16px', backgroundColor: 'rgb(229 231 235)' }}>Kimmel Zahntechnik - Fahrzeugverwaltung</h1>
        </div>

        {/* Navigation - Tab-Style */}
        <div className="bg-gray-50 px-6 py-2" style={{ paddingBottom: '0.5rem' }}>
          <div className="flex items-center gap-1">
            <ToolbarButton 
              icon="📋" 
              label="Fahrzeug Stammdaten" 
              onClick={onStammdatenClick}
              isActive={activeView === 'stammdaten'}
            />
            <ToolbarButton 
              icon="🛡️" 
              label="Versicherung" 
              onClick={onVersicherungClick}
              isActive={activeView === 'versicherung'}
            />
            <ToolbarButton 
              icon="📁" 
              label="Fahrzeugunterlagen" 
              onClick={onUnterlagenClick}
              isActive={activeView === 'unterlagen'}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Statusleiste */}
      <footer className="bg-gray-200 border-t text-gray-700 px-4 py-1 text-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>Letzte Änderung: {new Date().toLocaleString('de-DE')}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded text-xs">+</button>
          <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded text-xs">-</button>
          <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded text-xs">?</button>
        </div>
        <div className="text-gray-500">
          Copyright © 2024 by Kimmel Fahrzeug Verwaltung
        </div>
      </footer>
    </div>
  );
}

