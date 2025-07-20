// routes/transactions.js

import express from "express"
const router = express.Router();
import Transaction from "../models/Transaction.js"; 
// adjust path as needed
import Borrower from "../models/Borrower.js";
import { verifyToken } from "../middleware/verifyToken.js";

router.get('/:borrowerId', verifyToken, async (req, res) => {
  try {
    const borrowerId = req.params.borrowerId;
    // console.log("borrowerID",borrowerId);
    const transactions = await Transaction.find({ borrowerId }).sort({ createdAt: -1 });
    // console.log("transaction",transactions);
    res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching borrower transactions:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      lenderId, // you can get this from the token if not passed
      borrowerId,
      type, // 'borrow' or 'payment'
      amount,
      description,
      date,
      status,
      category,
      attachments,
      notes
    } = req.body;
    // Basic validation
    if (!borrowerId || !type || !amount || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const transaction = new Transaction({
      lenderId: lenderId || req.user.id, // fallback to user from token
      borrowerId,
      type,
      amount,
      description,
      date: date || new Date(),
      status: status || 'completed',
      category: category || 'general',
      attachments: attachments || [],
      notes: notes || ''
    });

    const savedTransaction = await transaction.save();
    // console.log("new transaction",savedTransaction);
    res.status(201).json(savedTransaction);
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
