import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  activeTab: 'fahrzeuge' | 'meldungen';
  onTabChange: (tab: 'fahrzeuge' | 'meldungen') => void;
}

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🚗</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Fahrzeug Plus 6 Enterprise
                </h1>
                <p className="text-xs text-gray-500">Admin-Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-4" aria-label="Tabs">
            <button
              onClick={() => onTabChange('fahrzeuge')}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition ${
                activeTab === 'fahrzeuge'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              data-test-id="tab-fahrzeuge"
              aria-label="Fahrzeuge Tab"
            >
              🚗 Fahrzeuge
            </button>
            <button
              onClick={() => onTabChange('meldungen')}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition ${
                activeTab === 'meldungen'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              data-test-id="tab-meldungen"
              aria-label="Meldungen Tab"
            >
              📋 Meldungen
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}


