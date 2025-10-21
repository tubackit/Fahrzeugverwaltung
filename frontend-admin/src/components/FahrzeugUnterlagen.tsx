import { useState } from 'react';
import type { Fahrzeug } from '../types';

interface FahrzeugUnterlagenProps {
  fahrzeug: Fahrzeug;
}

type FolderType = 'versicherung' | 'kauf' | 'rechnung' | 'sonstiges';

interface Document {
  id: string;
  name: string;
  folder: FolderType;
  uploadDate: string;
  size: string;
  fileUrl: string;
  fileType: string;
}

export default function FahrzeugUnterlagen({ fahrzeug }: FahrzeugUnterlagenProps) {
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);

  const folders = [
    { id: 'versicherung', label: 'Versicherung', icon: '🛡️', color: 'from-blue-50 to-blue-100' },
    { id: 'kauf', label: 'Kauf', icon: '💰', color: 'from-green-50 to-green-100' },
    { id: 'rechnung', label: 'Rechnung', icon: '🧾', color: 'from-yellow-50 to-yellow-100' },
    { id: 'sonstiges', label: 'Sonstiges', icon: '📄', color: 'from-gray-50 to-gray-100' },
  ] as const;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, folder: FolderType) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileUrl = e.target?.result as string;
          const newDoc: Document = {
            id: Date.now().toString() + Math.random(),
            name: file.name,
            folder: folder,
            uploadDate: new Date().toLocaleDateString('de-DE'),
            size: `${(file.size / 1024).toFixed(1)} KB`,
            fileUrl: fileUrl,
            fileType: file.type,
          };
          setDocuments((prev) => [...prev, newDoc]);
        };
        reader.readAsDataURL(file);
      });
      event.target.value = '';
    }
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
  };

  const handleViewDocument = (doc: Document) => {
    if (doc.fileType === 'application/pdf') {
      // Konvertiere Base64 zu Blob
      const byteCharacters = atob(doc.fileUrl.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      
      // Öffne PDF in neuem Tab
      window.open(blobUrl, '_blank');
      
      // Aufräumen nach 1 Minute
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } else if (doc.fileType.startsWith('image/')) {
      // Bild in neuem Tab anzeigen
      const imgWindow = window.open('', '_blank');
      if (imgWindow) {
        imgWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${doc.name}</title>
              <meta charset="UTF-8">
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  background: #2d3748; 
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                }
                h2 { 
                  color: white; 
                  margin-bottom: 20px;
                  font-family: system-ui, -apple-system, sans-serif;
                }
                img { 
                  max-width: 95%; 
                  max-height: 85vh;
                  height: auto; 
                  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                  border-radius: 8px;
                  background: white;
                }
              </style>
            </head>
            <body>
              <h2>${doc.name}</h2>
              <img src="${doc.fileUrl}" alt="${doc.name}" />
            </body>
          </html>
        `);
        imgWindow.document.close();
      }
    } else {
      // Andere Dateitypen direkt öffnen oder herunterladen
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFolderDocuments = (folder: FolderType) => {
    return documents.filter((doc) => doc.folder === folder);
  };

  return (
    <div className="details-container h-full overflow-y-auto bg-white">
      {/* Content */}
      <div className="p-6 pr-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 section-divider pb-4">
          <span>📁</span> Fahrzeugunterlagen - {fahrzeug.kennzeichen}
        </h3>

        {/* Ordner-Tabs */}
        <div className="flex gap-3 mb-6 section-divider pb-6">
          {folders.map((folder) => {
            const folderDocs = getFolderDocuments(folder.id as FolderType);
            const isActive = selectedFolder === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id as FolderType)}
                className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-green-600 text-white shadow-lg scale-105' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{ 
                  borderRadius: '16px',
                  border: isActive ? '2px solid #16a34a' : '1px solid #9ca3af' 
                }}
              >
                <span className="text-2xl">{folder.icon}</span>
                <div className="text-left">
                  <div className="text-sm">{folder.label}</div>
                  <div className={`text-xs ${isActive ? 'text-green-100' : 'text-gray-500'}`}>
                    {folderDocs.length} Dokument(e)
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Upload-Bereich */}
        {selectedFolder && (
          <div className="mb-6">
            <label className="block">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e, selectedFolder)}
              />
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg text-center transition cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-3">
                <span className="text-2xl">📤</span>
                <span>Dokument hochladen ({folders.find(f => f.id === selectedFolder)?.label})</span>
              </div>
            </label>
          </div>
        )}

        {/* Dokumente-Liste */}
        {selectedFolder ? (
          <div>
            {getFolderDocuments(selectedFolder).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-lg font-semibold">Noch keine Dokumente in diesem Ordner</p>
                <p className="text-sm">Laden Sie Ihr erstes Dokument hoch!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFolderDocuments(selectedFolder).map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                    style={{ border: '2px solid #e5e7eb' }}
                  >
                    {/* Vorschau */}
                    <div 
                      className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleViewDocument(doc)}
                    >
                      {doc.fileType.startsWith('image/') ? (
                        <img 
                          src={doc.fileUrl} 
                          alt={doc.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : doc.fileType === 'application/pdf' ? (
                        <div className="text-center">
                          <div className="text-7xl mb-3">📄</div>
                          <div className="text-red-600 text-xl font-bold">PDF</div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-6xl mb-2">📄</div>
                          <div className="text-gray-600 text-sm">Dokument</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Footer */}
                    <div className="p-3 bg-white section-divider">
                      <p className="text-sm font-bold text-gray-900 truncate mb-1" title={doc.name}>
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        {doc.uploadDate} • {doc.size}
                      </p>
                      
                      {/* Aktionen */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDocument(doc)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <span>👁️</span> Öffnen
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors"
                          data-test-id={`delete-doc-${doc.id}`}
                          aria-label="Dokument löschen"
                          title="Dokument löschen"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-lg font-semibold">Wählen Sie einen Ordner aus</p>
            <p className="text-sm">Klicken Sie oben auf einen der Ordner, um Dokumente zu verwalten</p>
          </div>
        )}
      </div>
    </div>
  );
}

