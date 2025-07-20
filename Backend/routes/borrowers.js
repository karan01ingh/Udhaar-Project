import express from 'express';
import Borrower from '../models/Borrower.js';
import Transaction from '../models/Transaction.js';
import { authenticateToken } from '../middleware/auth.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/:id/transactionsget',verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      borrowerId: req.params.id,
      lenderId: req.user.uid 
    }).sort({ date: -1 });
    
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add transaction for a borrower
router.post('/:id/transactionspost', verifyToken, async (req, res) => {
  try {
    const { type, amount, description, date, category, notes } = req.body;
    
    const borrower = await Borrower.findOne({ 
      _id: req.params.id, 
      lenderId: req.user.uid 
    });
    
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }
    
    const transaction = new Transaction({
      lenderId: req.user.uid,
      borrowerId: req.params.id,
      type,
      amount,
      description,
      date: date || new Date(),
      category,
      notes
    });
    
    await transaction.save();
    
    // Update borrower totals
    if (type === 'borrow') {
      borrower.totalBorrowed += amount;
    } else if (type === 'payment') {
      borrower.totalPaid += amount;
      borrower.lastPaymentDate = transaction.date;
    }
    
    await borrower.save();
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Get all borrowers for a lender
router.get('/', verifyToken, async (req, res) => {
  try {
    const borrowers = await Borrower.find({ lenderId: req.user.id })
      .sort({ updatedAt: -1 });
    
    res.json(borrowers);
  } catch (error) {
    console.error('Get borrowers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get specific borrower details
router.get('/:id/get', verifyToken, async (req, res) => {
  try {
    const borrower = await Borrower.findById(req.params.id);
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }
    res.json(borrower);
  } catch (error) {
    console.error('Get borrower error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new borrower
router.post('/', verifyToken, async (req, res) => {
  try {
    const { borrowerName, borrowerEmail, phoneNumber,totalBorrowed,totalPaid } = req.body;
    const existingBorrower = await Borrower.findOne({
      borrowerEmail: borrowerEmail.toLowerCase()
    });

    if (existingBorrower) {
      return res.status(409).json({ message: 'Borrower with this email already exists' });
    }


    const borrower = new Borrower({
      lenderId: req.user.id,
      borrowerName,
      borrowerEmail,
      borrowerPhone: phoneNumber,
      totalBorrowed,
      totalPaid
       // ✅ Correct mapping
    });

    await borrower.save();
    
    res.status(201).json(borrower);
  } catch (error) {
    console.error('Create borrower error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete borrower
router.delete('/:id/delete', verifyToken, async (req, res) => {
  try {
    const borrower = await Borrower.findOne({ 
      _id: req.params.id, 
      // lenderId: req.user.id 
    });
    
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }
    
    // Delete all transactions for this borrower
    await Transaction.deleteMany({ borrowerId: req.params.id });
    
    // Delete the borrower
    await Borrower.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Borrower deleted successfully' });
  } catch (error) {
    console.error('Delete borrower error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get transactions for a specific borrower
// update the borrower by the amount
router.put('/:id/update', verifyToken, async (req, res) => {
  try {
    const { amount, type } = req.body; // ❌ FIX: req.body() → req.body
    const parsedAmount = parseFloat(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // ✅ FIX: Await this or you'll get a plain object, not a Mongoose document
    const borrower = await Borrower.findOne({ _id: req.params.id });

    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }

    if (type === 'borrow') {
      borrower.totalBorrowed += parsedAmount;
      borrower.totalDue += parsedAmount;
    } else if (type === 'payment') {
      borrower.totalPaid += parsedAmount;
      borrower.totalDue -= parsedAmount;
    } else {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    await borrower.save(); // ✅ This will now work

    res.json(borrower);
  } catch (error) {
    console.error('Update borrower error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;