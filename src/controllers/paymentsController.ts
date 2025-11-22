import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { memberId, planId, amount, method, transactionRef } = req.body;

    // 1. Create payment record
    const payment = await prisma.payment.create({
      data: {
        memberId,
        membershipPlanId: planId || null,
        amount,
        method,
        transactionRef,
        status: "PAID",
      },
    });

    // 2. If plan is selected, extend membership expiry
    if (planId) {
      const plan = await prisma.membershipPlan.findUnique({
        where: { id: planId },
      });

      if (plan) {
        const member = await prisma.member.findUnique({
          where: { id: memberId },
        });

        const currentExpiry = member?.membershipExpiresAt ?? new Date();
        const startDate =
          currentExpiry > new Date() ? currentExpiry : new Date();

        const newExpiry = new Date(startDate);
        newExpiry.setDate(newExpiry.getDate() + plan.durationDays);

        await prisma.member.update({
          where: { id: memberId },
          data: {
            membershipExpiresAt: newExpiry,
            status: "ACTIVE",
          },
        });
      }
    }

    res.json(payment);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { paidAt: "desc" },
    });

    res.json(payments);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
