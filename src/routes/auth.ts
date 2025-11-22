import { Router } from 'express';
import { register, login } from '../services/authService';
const router = Router();

router.post('/register', async (req, res) => {
  try {
    const user = await register(req.body);
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (err:any) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
  } catch (err:any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
