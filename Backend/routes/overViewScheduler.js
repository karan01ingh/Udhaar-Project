// utils/markOverdueBorrowers.js

import Borrower from '../models/Borrower.js';
import cron from 'node-cron';

export const markOverdueBorrowers = async () => {
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  const result = await Borrower.updateMany(
    { status: 'active', createdAt: { $lt: twoMonthsAgo } },
    { $set: { status: 'overdue' } }
  );
};

// ⏰ Automatically run daily at midnight
cron.schedule('0 0 * * *', () => {
  markOverdueBorrowers();
});
