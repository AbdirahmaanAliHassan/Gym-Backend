import { Router } from 'express';
import prisma from '../utils/prisma';
import auth from '../middleware/auth';
import { permit } from '../middleware/roles';

const router = Router();

router.post('/check-in', auth, permit('ADMIN','STAFF'), async (req, res) => {
  const { memberId, source } = req.body;
  const record = await prisma.attendance.create({ data: { memberId, source }});
  res.json(record);
});

router.post('/check-out', auth, permit('ADMIN','STAFF'), async (req, res) => {
  const { memberId } = req.body;
  const latest = await prisma.attendance.findFirst({ where: { memberId, checkOut: null }, orderBy: { checkIn: 'desc' }});
  if (!latest) return res.status(404).json({ message: 'No active check-in' });
  const updated = await prisma.attendance.update({ where: { id: latest.id }, data: { checkOut: new Date() }});
  res.json(updated);
});

router.get('/', auth, permit('ADMIN','STAFF'), async (req, res) => {
  const { memberId } = req.query;
  const where:any = {};
  if (memberId) where.memberId = Number(memberId);
  const list = await prisma.attendance.findMany({ where });
  res.json(list);
});

export default router;
