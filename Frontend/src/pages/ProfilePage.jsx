import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Lock, Camera, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import ProfileImageUploader from "../components/ImageUploader.jsx"
export default function ProfilePage() {
  const { user, userProfile, setUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [load, setload] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { register, getValues, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const [step, setStep] = useState(1); // 1 = current pw, 2 = OTP, 3 = new pw
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const navigate = useNavigate();
  const onSubmitProfile = async (data) => {
    // setLoading(true);
    setload(true);
    try {
      const response = await axios.put('https://udhaar-project.onrender.com/api/users/profile', {
        username: data.username,
        userid: user.id
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const updatedData = response.data;
      setUserProfile(prev => ({
        ...prev,
        ...updatedData
      }));
      // setUserProfile(updatedData);
      reset({
        username: response.data.username || '',
        email: response.data.email || ''
        // phone: response.data.phone || ''
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      // setLoading(false);
      setload(false);
    }
  };
  async function verifyCurrentPassword() {
    setload(true);
    try {
      await axios.post('https://udhaar-project.onrender.com/api/users/verify-password', {
        email: user.email,
        currentPassword: getValues('currentPassword')
      }, { withCredentials: true });
      await axios.post("https://udhaar-project.onrender.com/api/Otp/send-otp", {
        email: user.email
      }, {
        withCredentials: true
      });
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (error) {
      console.log(error);
      toast.error('Invalid password');
    }
    finally {
      // setLoading(false);
      setload(false);
    }
  };
  function handleOtpChange(e, idx) {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return; // only digits or empty

    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    if (value && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };
  async function verifyOtp() {
    // setLoading(true);
    setload(true);
    try {
      const code = otp.join('');
      await axios.post('https://udhaar-project.onrender.com/api/Otp/verify-otp', {
        email: user.email,
        otp: code
      });
      toast.success('OTP verified!');
      // setLoading(false)
      setIsOtpVerified(true);
      setStep(3);
    } catch (error) {
      toast.error('Invalid OTP');
      console.log(error);
    }
    finally {
      // setLoading(false);
      setload(false);
    }
  };
  const onSubmitPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    // setLoading(true);
    setload(true);
    setStep(1);
    register.currentPassword="";
    try {
      await axios.put("https://udhaar-project.onrender.com/api/users/updatePassword", { password: data.newPassword, userid: user.id }, { withCredentials: true });
      toast.success("Password updated Successfully");
      navigate('/profile');
    } catch (error) {
      toast.error("Update Pasword Failed")
      console.log("Error in the update pass", error);
    }
    finally {
      // setLoading(false);
      setload(false);
    }
    // try {
    //   // 1. Send OTP request
    //   await axios.post("http://localhost:3001/api/Otp/send-otp", {
    //     email: user?.email || userProfile?.email
    //   });

    //   toast.success("OTP sent to your email.");
    //   setShowOTPInputs(true); // show OTP fields
    // } catch (error) {
    //   toast.error("Failed to send OTP");
    // } finally {
    //   setLoading(false);
    // }
  };
  function handleOtpKeyDown(e, idx) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };
  useEffect(() => {
  if (userProfile) {
    reset({
      username: userProfile.username || '',
      email: userProfile.email || user?.email || ''
    });
  }
  }, [userProfile, user, reset]);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#960018] to-[#7a0013] px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ProfileImageUploader
                  userProfile={userProfile}
                  setUserProfile={setUserProfile}
                />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{userProfile?.username || 'User'}</h1>
                <p className="text-red-100">{user?.email || userProfile?.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                  ? 'border-[#960018] text-[#960018]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Profile Information
              </button>
              {!userProfile?.uid && (
                <button
                  onClick={() => setActiveTab('security')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'security'
                    ? 'border-[#960018] text-[#960018]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Security
                </button>
              )}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit(onSubmitProfile)}
                className="space-y-6"
              >
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('username', { required: 'Username is required' })}
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#960018] focus:border-[#960018] sm:text-sm"
                    />
                  </div>
                  {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('email')}
                      type="email"
                      disabled
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 sm:text-sm"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Email changes require OTP verification</p>
                </div>

                {/* Phone */}
                {/* deleted */}
                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#960018] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#7a0013] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#960018] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit(onSubmitPassword)}
                className="space-y-6"
              >
                {/* Step 1: Verify Current Password */}
                {step === 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Current Password</label>
                    <input
                      {...register('currentPassword', { required: 'Current password is required' })}
                      type="password"
                      className="w-full border rounded px-3 py-2 border-gray-300"
                    />
                    {errors.currentPassword && <p className="text-red-600 text-sm">{errors.currentPassword.message}</p>}

                    <button
                      type="button"
                      onClick={verifyCurrentPassword}
                      className="mt-4 bg-[#960018] text-white px-4 py-2 rounded"
                    >
                      Verify Current Password
                    </button>
                  </div>
                )}

                {/* Step 2: Enter OTP */}
                {step === 2 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP sent to email</label>
                    <div className="flex space-x-2">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e, idx)}
                          onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                          className="w-10 h-10 text-center border rounded"
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={verifyOtp}
                      className="mt-4 bg-[#960018] text-white px-4 py-2 rounded"
                    >
                      Verify
                    </button>
                    {/* <button
                      type="button"
                      onClick={verifyOtp}
                      className="mt-4 ml-4 bg-[#960018] text-white px-4 py-2 rounded"
                    >
                     Resend
                    </button> */}
                  </div>
                )}

                {/* Step 3: New Password */}
                {step === 3 && isOtpVerified && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        {...register('newPassword', {
                          required: 'New password is required',
                          minLength: { value: 6, message: 'At least 6 characters' }
                        })}
                        type="password"
                        className="w-full border rounded px-3 py-2"
                      />
                      {errors.newPassword && <p className="text-red-600 text-sm">{errors.newPassword.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                      <input
                        {...register('confirmPassword', {
                          required: 'Confirm your password',
                          validate: value => value === watch('newPassword') || 'Passwords do not match'
                        })}
                        type="password"
                        className="w-full border rounded px-3 py-2"
                      />
                      {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#960018] text-white px-6 py-2 rounded mt-4"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </>
                )}
              </motion.form>
            )}

          </div>
        </motion.div>
      </div>
      {load && (
        <div className="fixed inset-0 z-50 bg-transparent backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 border-4 border-[#960018] border-t-transparent rounded-full animate-spin pointer-events-auto"></div>
        </div>
      )}
    </div>
  );
}
