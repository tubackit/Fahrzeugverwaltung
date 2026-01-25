import { useState, useEffect } from 'react';
import type { Fahrzeug } from '../types';

interface NotizenModalProps {
  fahrzeug: Fahrzeug;
  isOpen: boolean;
  mode?: 'add' | 'edit'; // 'add' = neue Notiz, 'edit' = bestehende bearbeiten
  onClose: (saved: boolean) => void;
  onUpdate: () => void;
}

export default function NotizenModal({ fahrzeug, isOpen, mode = 'add', onClose, onUpdate }: NotizenModalProps) {
  const [notizen, setNotizen] = useState('');
  const [loading, setLoading] = useState(false);

  // Aktualisiere Notizen basierend auf Mode
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit') {
        // Bearbeiten: Bestehende Notiz laden
        setNotizen(fahrzeug.bemerkungen || '');
      } else {
        // Hinzufügen: Leeres Feld
        setNotizen('');
      }
    }
  }, [fahrzeug.bemerkungen, isOpen, mode]);

  const handleClose = () => {
    // Zurücksetzen basierend auf Mode
    if (mode === 'edit') {
      setNotizen(fahrzeug.bemerkungen || '');
    } else {
      setNotizen('');
    }
    onClose(false);
  };

  // ESC-Taste zum Schließen
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Zurücksetzen basierend auf Mode
        if (mode === 'edit') {
          setNotizen(fahrzeug.bemerkungen || '');
        } else {
          setNotizen('');
        }
        onClose(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, mode, fahrzeug.bemerkungen, onClose]);

  const handleSave = async () => {
    if (!notizen.trim()) {
      alert('Bitte geben Sie eine Notiz ein.');
      return;
    }

    setLoading(true);
    try {
      // Bestehende Notizen holen und neue anhängen
      const bestehendeNotizen = fahrzeug.bemerkungen || '';
      let neueNotizen = '';
      
      if (mode === 'add') {
        // Neue Notiz hinzufügen mit Datum/Zeit
        const datum = new Date().toLocaleString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        if (bestehendeNotizen) {
          neueNotizen = `${bestehendeNotizen}\n\n--- ${datum} ---\n${notizen}`;
        } else {
          neueNotizen = `--- ${datum} ---\n${notizen}`;
        }
      } else {
        // Bearbeiten: Notizen ersetzen
        neueNotizen = notizen;
      }

      const response = await fetch(`/api/fahrzeuge/${fahrzeug.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bemerkungen: neueNotizen }),
      });

      if (response.ok) {
        onUpdate();
        onClose(true);
      } else {
        const data = await response.json();
        alert(data.error || 'Fehler beim Speichern der Notizen');
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Notizen:', error);
      alert('Verbindungsfehler');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* Modal Container - Immer mittig und sichtbar */}
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col"
        style={{ 
          maxHeight: '70vh',
          margin: 'auto',
          position: 'relative',
          transform: 'translateY(0)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Kompakt */}
        <div className="bg-white px-5 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <div>
                <h3 className="text-base font-semibold text-gray-900" id="modal-title">
                  {mode === 'add' ? 'Neue Notiz hinzufügen' : 'Notizen bearbeiten'} - {fahrzeug.kennzeichen}
                </h3>
                <p className="text-xs text-gray-500">
                  {fahrzeug.hersteller} {fahrzeug.modell}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none w-6 h-6 flex items-center justify-center"
              data-test-id="button-close-notizen-modal"
              aria-label="Schließen"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content - Scrollbar nur im Textarea */}
        <div className="bg-white px-5 py-4 flex-shrink-0" style={{ overflow: 'visible' }}>
          <div className="mb-3">
            <label htmlFor="notizen" className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'add' ? 'Neue Notiz' : 'Notizen'}
            </label>
            <textarea
              id="notizen"
              value={notizen}
              onChange={(e) => setNotizen(e.target.value)}
              rows={8}
              placeholder={mode === 'add' ? 'Geben Sie hier Ihre neue Notiz ein...' : 'Bearbeiten Sie die Notizen...'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              style={{ 
                minHeight: '150px',
                maxHeight: '400px',
                resize: 'vertical',
                overflowY: 'auto'
              }}
              data-test-id="textarea-notizen-modal"
              aria-label="Notizen eingeben"
              autoFocus
            />
          </div>
          <div className="text-xs text-gray-500">
            {mode === 'add' ? '💡 Neue Notiz wird mit Datum/Zeit gespeichert und an bestehende Notizen angehängt.' : '💡 Zeilenumbrüche werden beibehalten.'}
          </div>
        </div>

        {/* Footer - Kompakt, immer sichtbar */}
        <div className="bg-gray-50 px-5 py-3 flex items-center justify-end gap-3 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            data-test-id="button-cancel-notizen"
            aria-label="Abbrechen"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors disabled:cursor-not-allowed shadow-sm"
            data-test-id="button-save-notizen"
            aria-label="Notizen speichern"
          >
            {loading ? 'Wird gespeichert...' : '💾 Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}

