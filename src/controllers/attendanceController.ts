import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const checkIn = async (req: Request, res: Response) => {
  try {
    const { memberId, source } = req.body;

    const record = await prisma.attendance.create({
      data: { memberId, source },
    });

    res.json(record);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const checkOut = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.body;

    const latest = await prisma.attendance.findFirst({
      where: { memberId, checkOut: null },
      orderBy: { checkIn: "desc" },
    });

    if (!latest) {
      return res.status(404).json({ message: "No active check-in" });
    }

    const updated = await prisma.attendance.update({
      where: { id: latest.id },
      data: { checkOut: new Date() },
    });

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.query;

    const where: any = {};
    if (memberId) where.memberId = Number(memberId);

    const list = await prisma.attendance.findMany({ where });

    res.json(list);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
