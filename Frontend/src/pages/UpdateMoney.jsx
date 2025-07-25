import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../utils/axios";
import { toast } from 'react-hot-toast';

export default function UpdateAmountPage() {
  const navigate = useNavigate();
  const [load,setload]=useState(false);
  const [formData, setFormData] = useState({
        borrowerId: '', 
    totalBorrowed: '',
    totalPaid: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // if(name==)
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    setload(true);
    e.preventDefault();

    const { borrowerId, totalBorrowed, totalPaid } = formData;

    if (!borrowerId || isNaN(totalBorrowed) || isNaN(totalPaid)) {
      return toast.error("All fields are required and must be numbers");
    }

    try {
      const updatedData = {
        totalBorrowed: parseFloat(totalBorrowed),
        totalPaid: parseFloat(totalPaid),
        totalDue: parseFloat(totalBorrowed) - parseFloat(totalPaid),
        updatedAt: new Date().toISOString(),
      };

      await axios.put(`/borrowers/${borrowerId}`, updatedData);
      toast.success("Amount updated successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update amount");
    }
    finally{
      setload(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-[#960018]">Update Borrower Amount</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Borrower ID</label>
            <input
              type="text"
              name="borrowerId"
              value={formData.borrowerId}
              onChange={handleChange}
              required
              placeholder="e.g. 64f7a1c8abc1234567890abc"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#960018] focus:border-[#960018]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Borrowed Amount</label>
            <input
              type="number"
              name="totalBorrowed"
              value={formData.totalBorrowed}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#960018] focus:border-[#960018]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Paid Amount</label>
            <input
              type="number"
              name="totalPaid"
              value={formData.totalPaid}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#960018] focus:border-[#960018]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#960018] text-white py-2 px-4 rounded-md hover:bg-[#7a0013] transition-colors"
          >
            Update Amount
          </button>
        </form>
      </div>
      {load && (
        <div className="fixed inset-0 z-50 bg-transparent backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 border-4 border-[#960018] border-t-transparent rounded-full animate-spin pointer-events-auto"></div>
        </div>
      )}
    </div>
  );
}
