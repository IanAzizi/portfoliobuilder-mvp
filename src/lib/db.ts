// src/lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI in .env.local');
}

// اعلام global و اضافه کردن تایپ به mongoose
declare global {
  // اگر این پراپرتی وجود نداشت، اضافه‌اش کن
  // نوعش یا باید null باشه یا این آبجکت
  // برای کش کردن اتصال mongoose
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

// مقدار کش را از global بخوان یا اگر نبود مقدار اولیه قرار بده
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // می‌تونی اینجا تنظیمات دیگه mongoose بذاری اگر لازم بود
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
