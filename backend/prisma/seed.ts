import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 1. Manually point to the root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('Connecting via Driver Adapter...');
  
  // 2. Get the password from env
  const rawPassword = process.env.ADMIN_SEED_PASSWORD;

  // 3. FIXED LOGIC: Error if NOT rawPassword
  if (!rawPassword) {
    console.error("❌ ERROR: ADMIN_SEED_PASSWORD is not defined in .env!");
    process.exit(1);
  }

  console.log(`🌱 Seeding with password from .env: ${rawPassword}`);
  
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'chepkuruiprudence403@gmail.com' },
    update: {
      role: 'ADMIN',
      password: hashedPassword // Update password too in case it changed
    },
    create: {
      email: 'chepkuruiprudence403@gmail.com',
      name: 'Admin Elder',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Seed successful! Admin created/updated:', admin.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });