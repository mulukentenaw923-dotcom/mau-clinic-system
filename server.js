const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Clinic management server is running' });
});

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI must be configured before starting the server.');
}

console.log('Connecting to database...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB Database Connected Successfully! 🟢');
    
    app.listen(PORT, () => {
      console.log('-----------------------------------------');
      console.log(`🚀 Server is running successfully!`);
      console.log(`🔗 Local Link: http://localhost:${PORT}`);
      console.log('-----------------------------------------');
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });