import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import memberRoutes from './routes/members';
import paymentRoutes from './routes/payments';
import attendanceRoutes from './routes/attendance';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/attendance', attendanceRoutes);

app.get('/', (req, res) => {
  res.send('Gym APIs successfully running');
});

export default app;
