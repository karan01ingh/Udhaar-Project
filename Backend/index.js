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
// dotenv.config();
const app = express();
// 

// mongoose.connection.once('open', async () => {
//   try {
//     await mongoose.connection.collection('users').dropIndex('uid_1');
//     console.log('✅ Dropped uid_1 index');
//   } catch (err) {
//     if (err.codeName === 'IndexNotFound') {
//       console.log('ℹ️ Index already dropped');
//     } else {
//       console.error('Error dropping index:', err);
//     }
//   }
// });

// Security middleware
app.use(helmet());
app.use(cors({
  
  origin:['https://udhaar-project.vercel.app', 'http://localhost:5173'], // this must match your frontend
  // credentials: true
  // origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// MongoDB connection
connect();


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/Otp',otpRoutes);
app.use('/api/transactions',transactionRoutes);
// app.use('/api/razorpay',razorpayRoutes);

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
