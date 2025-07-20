import express, { json } from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import bcryptjs from 'bcryptjs';
// import { messaging } from 'firebase-admin';
const router = express.Router();
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware/verifyToken.js';

// Signup
router.post('/signup', async (req, res) => {
  try{
    const { email, username, phone, password} = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(405).json({ message: 'User already exists' });
    }
    // password enc
    // Create new user
    const user = new User({
      email,
      username,
      phone,
      password:bcryptjs.hashSync(password,10)
    });

    await user.save();
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    const datatosend={id:user._id,user: user.username,email:user.email,isPremium:user.isPremium,totalLent:user.totalLent,totalReceived:user.totalReceived,photoURL:user.photoURL,phone:user.phone}
    res.status(201).cookie('access_token', token, {
       httpOnly: true,
      secure:true,
      sameSite:'None'
    }).json(
      {message: 'Signup successful',
      datatosend
  });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!! TRY AGAIN' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;

    // 1. Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        uid,
        email,
        username: displayName || 'Google User',
        photoURL,
        password: '', // optional
      });
      await user.save();
    }

    // 2. Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 3. Set JWT token in HttpOnly cookie
    res.cookie('access_token', token, {
      httpOnly: true,
      secure:true,
      sameSite:'None'
    });

    // 4. Send back user info (optional)
    return res.status(200).json({ user, message: 'Google login/signup successful' });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user
router.get('/me',verifyToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user.uid;

    const user = await User.findOne({
      $or: [
        { _id: userId },  // traditional signup
        { uid: userId }   // google signup
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      _id,
      uid,
      username,
      email,
      isPremium,
      totalLent,
      totalReceived,
      photoURL
    } = user;

    return res.status(200).json({
      id: _id,
      uid: uid || null,
      username,
      email,
      isPremium,
      totalLent,
      totalReceived,
      photoURL
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// login
router.post('/login',async(req,res)=>{
  // cout<<"login request";
  try {
    const {email,password}=req.body;
    const Userexist=await User.findOne({email});
    if(!Userexist){
      return res.status(401).json({message:"User Doesn't exixst.. Please Login"});
    }
    const decryptedPassword=bcryptjs.compareSync(password, Userexist.password);
    if(!decryptedPassword){
      return res.status(402).json({message:"Password is incorrect"});
    } 
    const datatoSend={ id:Userexist._id,user: Userexist.username,email:Userexist.email,isPremium:Userexist.isPremium,totalLent:Userexist.totalLent,totalReceived:Userexist.totalReceived,photoURL:Userexist.photoURL,phone:Userexist.phone};
    const token = jwt.sign(
            { id:Userexist._id,user: Userexist.username,email:Userexist.email},
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
    );
    return res.status(201).cookie('access_token',token,{ httpOnly: true,secure:true,sameSite:'None'}).json({message:"Login Successfylly",datatoSend});
  } catch (error) {
    return res.json({message:"Login Failed !! INTERNAL ERROR"});
  }
});
// logout
router.post('/logout', async (req, res) => {
  try {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure:true,
      sameSite:'None'
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error){
    return res.status(500).json({ message: "Internal server error during logout" });
  }
});
export default router;
