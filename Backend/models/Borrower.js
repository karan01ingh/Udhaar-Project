import mongoose from 'mongoose';

const borrowerSchema = new mongoose.Schema({
  lenderId: {
    type: String,
    required: true,
    index: true
  },
  borrowerName: {
    type: String,
    required: true,
    trim: true
  },
  borrowerEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  borrowerPhone: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  totalBorrowed: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  totalDue: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'paid', 'overdue'],
    default: 'active'
  },
  lastPaymentDate: {
    type: Date,
    default: Date.now
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

borrowerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.totalDue = Math.max(0, this.totalBorrowed - this.totalPaid);
  
  if (this.totalDue === 0) {
    this.status = 'paid';
  } else if (this.totalDue > 0) {
    // Check if overdue (example: 30 days past due)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (this.lastPaymentDate < thirtyDaysAgo) {
      this.status = 'overdue';
    } else {
      this.status = 'active';
    }
  }
  
  next();
});

export default mongoose.model('Borrower', borrowerSchema);