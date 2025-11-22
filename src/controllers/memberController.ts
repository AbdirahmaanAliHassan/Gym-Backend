import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const getAllMembers = async (req: Request, res: Response) => {
  try {
    const members = await prisma.member.findMany();
    res.json(members);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const createMember = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone, membershipExpiresAt } = req.body;

    const member = await prisma.member.create({
      data: {
        firstName,
        lastName,
        phone,
        membershipExpiresAt: membershipExpiresAt
          ? new Date(membershipExpiresAt)
          : null,
      },
    });

    res.json(member);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getMemberById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        payments: true,
        attendance: true,
        assignments: true,
      },
    });

    res.json(member);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const updated = await prisma.member.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
