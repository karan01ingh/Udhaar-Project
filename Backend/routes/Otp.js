import Otp from '../models/Otp.js';
import express,{json} from 'express';
import nodemailer from 'nodemailer';
const router=express.Router();

router.post('/send-otp',async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // save to DB
  await Otp.create({ email, otp });

  // nodemailer config
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}. It expires in 2 minutes.`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error });
  }
});
router.post('/verify-otp',async(req,res)=>{
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Missing fields' });

  const validOtp = await Otp.findOne({ email, otp });
  if (!validOtp){
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  // optional: delete OTP once verified
  await Otp.deleteOne({ _id: validOtp._id });
  res.status(200).json({ message: 'OTP verified successfully' });
});
export default router;