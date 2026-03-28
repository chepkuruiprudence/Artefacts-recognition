import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client"; // Adjusted path for standard setups
import bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('Connecting via Driver Adapter...');
  
  const password = 'adminpassword'; 
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'chepkuruiprudence403@gmail.com' },
    update: {
      role: 'ADMIN' 
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