import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI must be configured before starting the API.');

  await mongoose.connect(uri, {
    autoIndex: process.env.NODE_ENV !== 'production',
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`Connected to MongoDB database "${mongoose.connection.name}".`);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
