import { Request, Response } from "express";
import { register, login } from "../services/authService";

export const registerController = async (req: Request, res: Response) => {
  try {
    const user = await register(req.body);
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
