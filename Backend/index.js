import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connect from './DataBase/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import borrowerRoutes from './routes/borrowers.js';
import paymentRoutes from './routes/payments.js';
import otpRoutes from "./routes/Otp.js";
import cookieParser from 'cookie-parser';
import transactionRoutes from './routes/transaction.js'
import "./routes/reminderScheduler.js";
import './routes/overViewScheduler.js';
dotenv.config();
const DEBUG_URL = process.env.DEBUG_URL;
const app = express();
app.use(cors({
  origin: 'https://udhaar-project.vercel.app', 
  credentials: true                      
}));
app.use(cookieParser());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 
});
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// connecting db
connect();
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/Otp',otpRoutes);
app.use('/api/transactions',transactionRoutes);
app.get("/", (req, res) => {
  res.send("Udhaar backend is live!");
});
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });
  // Error handling middleware
  app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ 
          message: 'Something went wrong!',
          error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
