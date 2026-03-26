import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Prisma Client Singleton for Prisma 7
 */
class Database {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      // 1. Setup the native PostgreSQL connection pool
      const pool = new pg.Pool({ 
        connectionString: process.env.DATABASE_URL 
      });

      // 2. Wrap it in the Prisma Driver Adapter
      const adapter = new PrismaPg(pool);

      // 3. Initialize the client with the adapter
      Database.instance = new PrismaClient({
        adapter, // This is the required field in Prisma 7
        log: process.env.NODE_ENV === 'development' 
          ? ['query', 'error', 'warn'] 
          : ['error'],
      });

      console.log('✅ Prisma 7 Client initialized with Driver Adapter');
    }

    return Database.instance;
  }

  public static async testConnection(): Promise<void> {
    try {
      const prisma = Database.getInstance();
      // In Prisma 7, $connect is often handled lazily by the adapter, 
      // but calling a simple query is the best way to test the pool.
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    if (Database.instance) {
      await Database.instance.$disconnect();
      console.log('📤 Database disconnected');
    }
  }
}

export const prisma = Database.getInstance();
export default Database;