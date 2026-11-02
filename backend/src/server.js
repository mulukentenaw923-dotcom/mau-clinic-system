import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import ehrRoutes from './routes/ehrRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import patientRoutes from './routes/patientRoutes.js';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 characters.');
}

const app = express();
const port = Number(process.env.PORT || 4000);

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
app.use((request, _response, next) => {
  request.body ??= {};
  next();
});

app.get('/api/health', (_request, response) => {
  const connected = mongoose.connection.readyState === 1;
  return response.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'unavailable' });
});

app.use('/api/auth', authRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/ehr', ehrRoutes);
app.use('/api/inventory', inventoryRoutes);

app.use((_request, response) => response.status(404).json({ error: 'Route not found.' }));
app.use((error, _request, response, _next) => {
  void _next;
  console.error('API request failed.', error);
  if (error.code === 11000) {
    return response.status(409).json({ error: 'A record with those details already exists.' });
  }
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return response.status(400).json({ error: 'The request contains invalid data.' });
  }
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'Request body must contain valid JSON.' });
  }
  return response.status(500).json({ error: 'An unexpected server error occurred.' });
});

let server;

async function startServer() {
  await connectDatabase();
  server = app.listen(port, () => console.log(`MAU Clinic API listening on port ${port}.`));
}

async function shutdown() {
  if (!server) return disconnectDatabase();
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer().catch((error) => {
  console.error('Could not start the MAU Clinic API.', error);
  process.exitCode = 1;
});
