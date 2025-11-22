import { Router } from 'express';
import prisma from '../utils/prisma';
import auth from '../middleware/auth';
import { permit } from '../middleware/roles';

const router = Router();

router.get('/', auth, permit('ADMIN','STAFF'), async (req, res) => {
  const members = await prisma.member.findMany();
  res.json(members);
});

router.post('/', auth, permit('ADMIN','STAFF'), async (req, res) => {
  const { firstName, lastName, phone, membershipExpiresAt } = req.body;
  const member = await prisma.member.create({
    data: { firstName, lastName, phone, membershipExpiresAt: membershipExpiresAt ? new Date(membershipExpiresAt) : null }
  });
  res.json(member);
});

router.get('/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const member = await prisma.member.findUnique({ where: { id }, include: { payments: true, attendance: true, assignments: true }});
  res.json(member);
});

router.put('/:id', auth, permit('ADMIN','STAFF'), async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;
  const member = await prisma.member.update({ where: { id }, data });
  res.json(member);
});

export default router;
