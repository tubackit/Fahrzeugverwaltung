import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDatabase, closeDatabase } from './db/database';
import fahrzeugeRouter from './routes/fahrzeuge';
import fahrerRouter from './routes/fahrer';

// Umgebungsvariablen laden
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logging
app.use((req: Request, _res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Datenbank initialisieren
getDatabase();

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Fahrzeug Plus 6 Enterprise API',
    version: '1.0.0',
    endpoints: {
      fahrzeuge: '/api/fahrzeuge',
      fahrer: '/api/fahrer'
    }
  });
});

app.use('/api/fahrzeuge', fahrzeugeRouter);
app.use('/api/fahrer', fahrerRouter);

// Error Handler
app.use((err: Error, _req: Request, res: Response, _next: unknown) => {
  console.error('Unbehandelter Fehler:', err);
  res.status(500).json({ error: 'Interner Serverfehler' });
});

// Server starten
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Backend-Server läuft auf http://localhost:${PORT}`);
  console.log(`📊 API-Endpunkte:`);
  console.log(`   - GET  http://localhost:${PORT}/api/fahrzeuge`);
  console.log(`   - POST http://localhost:${PORT}/api/fahrzeuge`);
  console.log(`   - POST http://localhost:${PORT}/api/fahrer/login`);
  console.log(`\n✅ Bereit für Anfragen!\n`);
});

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Server wird heruntergefahren...');
  server.close(() => {
    closeDatabase();
    console.log('✅ Server erfolgreich beendet');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Server wird heruntergefahren...');
  server.close(() => {
    closeDatabase();
    console.log('✅ Server erfolgreich beendet');
    process.exit(0);
  });
});


