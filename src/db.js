import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri || uri.includes('<DB_')) {
    console.log('No MONGO_URI set — running without DB (health-only mode).');
    return null;
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log('Mongo connected:', mongoose.connection.name);
  return mongoose.connection;
}
