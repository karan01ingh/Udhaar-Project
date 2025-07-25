import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/verifyToken.js';
import bcrypt from 'bcryptjs';
const router = express.Router();

// Get user profile
router.get('/profile',verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.toJSON());
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { username, phone,userid } = req.body;
    const user = await User.findOne({ _id:userid});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (username) user.username = username;
    if (phone) user.phone = phone;
    // if (photoURL) user.photoURL = photoURL;
    
    await user.save();
    res.json(user.toJSON());
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Update password (placeholder - actual implementation would involve Firebase Auth)

// Upgrade to premium
router.post('/premium', verifyToken, async (req, res) => {
  try {
    const { planType } = req.body; // 'monthly' or 'yearly'
    
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Calculate expiry date
    const expiryDate = new Date();
    if (planType === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }
    
    user.isPremium = true;
    user.premiumExpiresAt = expiryDate;
    await user.save();
    
    res.json({ 
      message: 'Premium upgrade successful',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Premium upgrade error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// router for verify password
router.post('/verify-password', async (req, res) => {
  const { email, currentPassword } = req.body;
  if (!email || !currentPassword) {
    return res.status(400).json({message: 'Email and password are required'});
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password'});
    return res.status(200).json({ message: 'Password verified' });
  } catch (err) {
    console.error('Verify password error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// route for updating password
router.put('/updatePassword',async (req,res)=>{
  try {
    const {userid,password}=req.body;
    if(!userid || !password){
      return res.status(400).json({message:"password may be empty"});
    }
    const data=await User.findById(userid);
    if(!data){
      return res.status(400).json({message:"User is not found with the id"});
    }
    if(password){
      // const newpass=bcrypt.js.hashSync(password,10);
      data.password=bcrypt.hashSync(password,10);
    }
    await data.save();
    res.json({message:"Password Updated Successfully"});
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// route for updating profile
router.put('/updateProfile',async(req,res)=>{
  try {
    const {userid,imageurl}=req.body;
    if(!userid || !imageurl){
      return res.status(400).json({message:"UseriD or ImageUrl is absent"}); 
    }
    const user=await User.findById(userid);
    if(!user){
      return res.status(404).json({message:"NO user is found"});
    }
    user.photoURL=imageurl;
    await user.save();
    return res.status(201).json({data:imageurl,message:"Done with the Profile Upload"});
  } catch (error) {
    return res.json({message:"Error in the profile update"});
  }
});
// route for deleteing profile image
router.put('/deleteProfileImage',async(req,res)=>{
  try {
    const {userId}=req.body;
    if(!userId){
      return res.status(401).json({message:"User Id is null"});
    }
    const user=await User.findById(userId);
    if(!user){
      return res.status(201).json({message:"No borrower is found"});
    }
    user.photoURL='';
    await user.save();
    return res.status(201).json({user});
  } catch (error) {
    return res.status(401).json({message:error});
  }
})
export default router;
