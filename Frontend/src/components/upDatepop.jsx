import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from "../utils/axios";

export default function UpdateTransactionModal({ isOpen, onClose, borrower, refresh }) {
  const formRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(formRef.current);
    const amount = parseFloat(form.get('amount'));
    const description = form.get('description')?.trim();
    const type = form.get('type');

    if (!amount || amount <= 0) return toast.error('Enter valid amount');
    if (type === 'taken' && parseFloat(value) > borrower.totalDue) {
      return toast.error(`Cannot take more than ₹${borrower.totalDue}`);
    }
    if (description.split(/\s+/).length > 20)
      return toast.error('Keep description under 20 words');

    try {
      await axios.post(
        '/transactions',
        {
          borrowerId: borrower._id,
          amount,
          type,
          description,
          date: new Date().toISOString(),
        },
        { withCredentials: true }
      );
       await axios.put(
      `/borrowers/${borrower._id}/update`,
      {
        amount,
        type,
      },
      { withCredentials: true }
    );
      toast.success('Transaction saved!');
      await 
      onClose();
      refresh?.(); // optional callback to refetch borrower list
    } catch (err) {
      console.error(err);
      toast.error('Failed to save transaction');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={(e) => e.target.id === 'backdrop' && onClose()}
          id="backdrop"
          className="fixed inset-0 z-50  bg-white/80 backdrop-blur-md flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* bg-[#960018]  */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md relative border-2 border-gray-400"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-[#960018] mb-4 text-center">
              Update Transaction
            </h2>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <select
                name="type"
                defaultValue="payment"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#960018] focus:border-[#960018]"
              >
                <option value="payment">payment</option>
                <option value="borrow"> borrow</option>
              </select>

              <input
                type="number"
                name="amount"
                placeholder="Amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#960018] focus:border-[#960018]"
                required
              />

              <textarea
                name="description"
                placeholder="Short description (max 20 words)"
                maxLength={100}
                className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-[#960018] focus:border-[#960018]"
              />

              <button
                type="submit"
                className="w-full bg-[#960018] text-white py-2 px-4 rounded-md hover:bg-[#7a0013] transition-colors"
              >
                Save Transaction
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
