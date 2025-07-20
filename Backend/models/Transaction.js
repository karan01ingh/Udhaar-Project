import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  lenderId: {
    type: String,
    required: true,
    index: true
  },
  borrowerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Borrower',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['borrow', 'payment'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  },
  category: {
    type: String,
    default: 'general'
  },
  attachments: [{
    filename: String,
    url: String,
    type: String
  }],
  notes: {
    type: String
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

transactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Transaction', transactionSchema);