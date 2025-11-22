import { Router } from 'express';
import prisma from '../utils/prisma';
import auth from '../middleware/auth';
import { permit } from '../middleware/roles';

const router = Router();

router.post('/', auth, permit('ADMIN','STAFF'), async (req, res) => {
  const { memberId, planId, amount, method, transactionRef } = req.body;
  const payment = await prisma.payment.create({
    data: {
      memberId,
      membershipPlanId: planId || null,
      amount,
      method,
      transactionRef,
      status: 'PAID'
    }
  });

  if (planId) {
    const plan = await prisma.membershipPlan.findUnique({ where: { id: planId }});
    if (plan) {
      const member = await prisma.member.findUnique({ where: { id: memberId }});
      const current = member?.membershipExpiresAt ?? new Date();
      const start = current > new Date() ? current : new Date();
      const newExpiry = new Date(start);
      newExpiry.setDate(newExpiry.getDate() + plan.durationDays);
      await prisma.member.update({ where: { id: memberId }, data: { membershipExpiresAt: newExpiry, status: 'ACTIVE' }});
    }
  }

  res.json(payment);
});

router.get('/', auth, permit('ADMIN','STAFF'), async (req, res) => {
  const payments = await prisma.payment.findMany({ orderBy: { paidAt: 'desc' }});
  res.json(payments);
});

export default router;
