import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
  uid:{
    type:String,
    unique:true,
    sparse:true
  },
  password: {
    type: String,
    required:function(){
    // Only require password if uid (Google ID) is not present
          return !this.uid;
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required:function () {
        return !this.uid; 
    }
  },
  photoURL: {
    type: String
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiresAt: {
    type: Date
  },
  totalLent: {
    type: Number,
    default: 0
  },
  totalReceived: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
},{timestamps:true});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.__v;
  return user;
};

export default mongoose.model('User', userSchema);