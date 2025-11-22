import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function register(data: { email:string, password:string, role?:any, firstName?:string, lastName?:string }) {
  const { email, password, role='MEMBER', firstName, lastName } = data;
  const existing = await prisma.user.findUnique({ where: { email }});
  if (existing) throw new Error('Email exists');
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash: hash, role, firstName, lastName }
  });
  return user;
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email }});
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'no_secret', { expiresIn: '7d' });
  return { token, user };
}
