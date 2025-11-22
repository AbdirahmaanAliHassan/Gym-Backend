import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

interface TokenPayload {
  name : string;
  userId: number;
  role: string;
  iat?: number;
  exp?: number;
}

export default async function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'no_secret') as TokenPayload;
    const user = await prisma.user.findUnique({ where: { id: payload.userId }});
    if (!user) return res.status(401).json({ message: 'User not found' });
    (req as any).user = user;
    next();
  } catch (err:any) {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
}
