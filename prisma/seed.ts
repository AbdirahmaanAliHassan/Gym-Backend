import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gym.com';
  const password = 'admin123'; 
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  if (existingAdmin) {
    console.log('Admin already exists');
    return;
  }

  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email,
      password: hashedPassword,
      Role: 'admin',
    } as any,
  });

  console.log('Admin created:', admin);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
