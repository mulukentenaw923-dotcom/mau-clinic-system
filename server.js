import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Clinic management server is running' });
});

const PORT = Number(process.env.PORT || 5001);
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  console.log('Connecting to database...');

  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('MongoDB Database Connected Successfully! 🟢');
      app.listen(PORT, () => {
        console.log('-----------------------------------------');
        console.log('🚀 Server is running successfully!');
        console.log(`🔗 Local Link: http://localhost:${PORT}`);
        console.log('-----------------------------------------');
      });
    })
    .catch((err) => {
      console.error('Database connection error:', err);
      process.exitCode = 1;
    });
} else {
  console.warn('MONGODB_URI is not set. Starting server without a database connection.');
  app.listen(PORT, () => {
    console.log('-----------------------------------------');
    console.log('🚀 Server is running successfully!');
    console.log(`🔗 Local Link: http://localhost:${PORT}`);
    console.log('-----------------------------------------');
  });
}