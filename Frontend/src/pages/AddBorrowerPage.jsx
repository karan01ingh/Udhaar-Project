import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../utils/axios";
import { toast } from 'react-hot-toast';
export default function AddBorrowerPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    borrowerName: '',
    borrowerEmail: '',
    phoneNumber: '',
    totalBorrowed: '',
    totalPaid: '',
    status: 'active',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [load, setload] = useState(false);
  const otpRefs = Array.from({ length: 6 }, () => useRef(null));

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "totalPaid") {
      const borrowed = parseFloat(formData.totalBorrowed || 0);
      const paid = parseFloat(value || 0);
      if (paid > borrowed) {
        toast.error("Total paid cannot be greater than total borrowed");
        return;
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (value, index) => {
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs[index + 1].current.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
      } else if (index > 0) {
        newOtp[index - 1] = '';
        otpRefs[index - 1].current.focus();
      }
      setOtp(newOtp);
    }
  };

  const sendOtp = async () => {
    if (!formData.borrowerEmail) return toast.error('Enter email first');
    setload(true);
    try {
      await axios.post('https://udhaar-project.onrender.com/api/Otp/send-otp', { email: formData.borrowerEmail });
      toast.success('OTP sent');
      setOtpSent(true);
    } catch (err) {
      toast.error('Failed to send OTP');
    }
    finally{
      setload(false);
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return toast.error('Enter full OTP');
    setVerifyingOtp(true);
    setload(true);
    try {
      await axios.post('https://udhaar-project.onrender.com/api/Otp/verify-otp', { email: formData.borrowerEmail, otp: otpCode });
      toast.success('Email verified!');
      setOtpVerified(true);
      console.log("OTP Verified");
    } catch (err) {
      console.log(err);
      toast.error('Incorrect OTP');
    }
    finally {
      setload(false);
      setVerifyingOtp(false);
    }
  }

  // const handleSubmit = async (e) => {
  //   setload(true);
  //   e.preventDefault();
  //   if(formData.phoneNumber.length!=10){
  //     setload(false);
  //     return toast.error("Phone number should be 10 digits");
  //   }
  //   if (!otpVerified){
  //     setload(false);
  //         return toast.error('Verify email before submitting');
  //   }
      


  //   try {
  //     const res = await axios.post('http://localhost:3001/api/borrowers', {
  //       ...formData,
  //       totalBorrowed: parseFloat(formData.totalBorrowed || 0),
  //       totalPaid: parseFloat(formData.totalPaid || 0),
  //       totalDue: (formData.totalBorrowed || 0) - (formData.totalPaid || 0),
  //       createdAt: new Date().toISOString(),
  //     }, { withCredentials: true });
  //     toast.success('Borrower added!');
  //     navigate('/dashboard');
  //     const newBorrower = res.data;
  //     //  transaction details
  //     const initialTransaction = {
  //       borrowerId: newBorrower._id,
  //       amount: parseFloat(formData.totalBorrowed || 0), // or totalPaid based on type
  //       type: 'borrow', // or 'taken', depending on the logic
  //       date: new Date().toISOString(),
  //       description: 'Initial borrow on account creation'
  //     };
  //     await axios.post(
  //       'http://localhost:3001/api/transactions/',
  //       initialTransaction,
  //       { withCredentials: true }
  //     );
  //   } catch (err) {
  //     toast.error('Failed to add borrower');
  //   }
  //   finally {
  //     setload(false);
  //   }
  // };

  const handleSubmit = async (e) =>{
  e.preventDefault();
  setload(true);

  if (formData.phoneNumber.length !== 10) {
    setload(false);
    return toast.error("Phone number should be 10 digits");
  }

  if (!otpVerified) {
    setload(false);
    return toast.error('Verify email before submitting');
  }

  try {
    const res = await axios.post(
      'https://udhaar-project.onrender.com/api/borrowers',
      {
        ...formData,
        totalBorrowed: parseFloat(formData.totalBorrowed || 0),
        totalPaid: parseFloat(formData.totalPaid || 0),
        totalDue:
          parseFloat(formData.totalBorrowed || 0) -
          parseFloat(formData.totalPaid || 0),
        createdAt: new Date().toISOString(),
      },
      { withCredentials: true }
    );

    toast.success('Borrower added!');
    const newBorrower = res.data;
    const borrowerId = newBorrower._id;

    // Initial borrow transaction if applicable
    if (parseFloat(formData.totalBorrowed || 0) > 0) {
      const borrowTransaction = {
        borrowerId,
        amount: parseFloat(formData.totalBorrowed),
        type: 'borrow', // Make sure this matches your backend logic
        date: new Date().toISOString(),
        description: 'Initial borrow on account creation',
      };
      await axios.post(
        'http://udhaar-project.onrender.com/api/transactions/',
        borrowTransaction,
        { withCredentials: true }
      );
    }

    // Initial paid transaction if applicable
    if (parseFloat(formData.totalPaid || 0) > 0) {
      const paidTransaction = {
        borrowerId,
        amount: parseFloat(formData.totalPaid),
        type: 'payment', // Use 'taken' if that matches your backend
        date: new Date().toISOString(),
        description: 'Initial payment on account creation',
      };
      await axios.post(
        'https://udhaar-project.onrender.com/api/transactions/',
        paidTransaction,
        { withCredentials: true }
      );
    }

    navigate('/dashboard');
  } catch (err){
    if (err.response && err.response.status === 409) {
      toast.error("Borrower with this email already exists!");
    } else {
      toast.error("Something went wrong. Try again.");
    }
  } finally {
    setload(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-[#960018]">Add New Borrower</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="borrowerName"
              value={formData.borrowerName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#960018] focus:border-[#960018]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="flex gap-2 mt-1">
              <input
                type="email"
                name="borrowerEmail"
                value={formData.borrowerEmail}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#960018] focus:border-[#960018]"
              />
              {!otpVerified && (
                <button
                  type="button"
                  onClick={sendOtp}
                  className="px-4 py-2 bg-[#960018] text-white rounded-md hover:bg-[#7a0013]"
                >
                  {otpSent ? 'Resend' : 'OTP'}
                </button>
              )}
            </div>

            {otpSent && !otpVerified && (
              <div className="mt-2 flex flex-col items-center justify-center">
                <div className="flex gap-2 justify-center mb-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      ref={otpRefs[i]}
                      className="w-8 h-10 text-center border border-gray-300 rounded"
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={verifyingOtp}
                  className="px-4 py-2 bg-[#960018] text-white rounded-md hover:bg-[#7a0013]"
                >
                  {verifyingOtp ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#960018] focus:border-[#960018]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Borrowed</label>
              <input
                type="number"
                name="totalBorrowed"
                value={formData.totalBorrowed}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#960018] focus:border-[#960018]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Total Paid</label>
              <input
                type="number"
                name="totalPaid"
                value={formData.totalPaid}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#960018] focus:border-[#960018]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#960018] focus:border-[#960018]"
            >
              <option value="active">Active</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#960018] text-white py-2 px-4 rounded-md hover:bg-[#7a0013] transition-colors"
          >
            Add Borrower
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
// tmperaroily disable the verify email functionality . i wnat to check my backend and  yhe sevre r
