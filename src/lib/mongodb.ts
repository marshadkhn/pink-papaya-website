import dns from 'dns';
import mongoose from 'mongoose';
import { env } from './env';
import getLogger from './logger';

const logger = getLogger('DB');

/**
 * On some Windows setups Node's c-ares resolver defaults its DNS server to
 * loopback (127.0.0.1) where nothing is listening, so every lookup — including
 * the SRV query for `mongodb+srv://` — fails with ECONNREFUSED even though the
 * OS resolver works fine. Detect that broken state and point the resolver at
 * public DNS. This is a no-op on a correctly-configured host (e.g. the VPS).
 */
function ensureUsableDnsServers() {
  try {
    const servers = dns.getServers();
    const allLoopback =
      servers.length === 0 ||
      servers.every((s) => s === '127.0.0.1' || s === '::1' || s.startsWith('127.'));
    if (allLoopback) {
      const publicDns = ['8.8.8.8', '1.1.1.1'];
      // The callback API and the promises API each have their own resolver
      // instance; the MongoDB driver resolves SRV via dns.promises, so both
      // must be pointed at working servers.
      dns.setServers(publicDns);
      dns.promises.setServers(publicDns);
      logger.warn('DNS resolver was pointed at loopback; overrode with public DNS', {
        was: servers,
        now: dns.getServers(),
      });
    }
  } catch (e: any) {
    logger.error('Failed to inspect/override DNS servers', { error: e?.message });
  }
}


const MONGODB_URI = env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Run in the same thread/context as mongoose.connect so the fix applies to
    // the resolver the driver actually uses (each worker thread has its own).
    ensureUsableDnsServers();

    const opts = {
      bufferCommands: false,
      dbName: env.MONGODB_DB_NAME,
    };

    logger.info('Initializing new MongoDB connection...');
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      logger.info('MongoDB connection established successfully');
      return mongoose;
    }).catch(err => {
      logger.error('Failed to connect to MongoDB', { error: err.message });
      throw err;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
