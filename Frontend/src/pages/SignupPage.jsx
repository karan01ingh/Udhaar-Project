// updated code with the otp functionality 
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, Phone, User } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext.jsx';
import GoogleSignInButton from '../components/GoogleSignInButton.jsx';
import { useEffect, useRef } from 'react';
import axios from  "../utils/axios";
// import { Mail } from 'lucide-react';
export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputsRef = useRef([]);
  const [isEmailVerified, setIsEmailVerified] = useState(false);


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
  if (loading) return;

  if (!isEmailVerified) {
    toast.error("Please verify your email before signing up");
    return;
  }

  setLoading(true);
  try {
    await signup(data.email, data.password, {
      username: data.username,
      phone: data.phone
    });

    toast.success('Signup successful!');
    navigate('/dashboard');
  } catch (error) {
    // ✅ Show backend error message if available
    const errorMessage = error?.response?.data?.message || error.message || 'Signup failed';
    toast.error(errorMessage);
    console.error('Signup error:', error);
  } finally {
    setLoading(false);
  }
};

  const handleSendOtp = async () => {
  const email = watch('email');

  if (!email) return toast.error('Enter a valid email');

  try {
    // const response = await fetch('/Otp/send-otp', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ email })
    // });
    // const response = await axios.post('/Otp/send-otp',{ email },
    // { withCredentials: true });
    // const result = await response.json();
    // if (!response.ok) {
    //   throw new Error(result.message || 'Failed to send OTP');
    // }
    // setEmailForOtp(email);
    // setOtpSent(true);
    // toast.success('OTP sent to your email');
    const response = await axios.post(
    '/Otp/send-otp',
    { email },
    { withCredentials: true }
  );
  const result = response.data;
  setEmailForOtp(email);
  setOtpSent(true);
  toast.success(result.message || 'OTP sent to your email');
  } catch (err) {
    toast.error(err.message || 'Failed to send OTP');
  }
};


  const handleVerifyOtp = async () => {
    const otp = otpDigits.join('');
    if (otp.length < 6) return toast.error('Enter complete OTP');

    try {
      await axios.post('/Otp/verify-otp', { email: emailForOtp, otp });
      toast.success('Email verified!');
      setIsEmailVerified(true);
      setOtpVerified(true);
      setOtpSent(false);
    } catch (err) {
      console.log(err);
      toast.error('Invalid OTP');
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8 "
      // border-gray-300 rounded-xl shadow-lg p-8 i will add in the css of motion div for order
      >
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#960018] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">U</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already registered?{' '}
            <Link
              to="/login"
              className="font-medium text-[#960018] hover:text-[#7a0013]"
            >
              Sign in
            </Link>
          </p>
        </div>

        <GoogleSignInButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative flex gap-2 items-center">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                disabled={otpVerified}
                type="email"
                className={`appearance-none rounded-lg block w-full pl-12 pr-28 py-3 border 
        ${otpVerified ? 'border-green-400 ring-0 ring-green-400' : 'border-gray-300'} 
        placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#960018] focus:border-[#960018] sm:text-sm`}
                placeholder="Email address"
              />
              {
                isEmailVerified ?
                  <button className="absolute right-2 px-3 py-1 text-sm font-medium text-white bg-[#960018] hover:bg-[#7a0013] rounded">verified</button>
                  :
                  <button
                    type="button"
                    onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                    className="absolute right-2 px-3 py-1 text-sm font-medium text-white bg-[#960018] hover:bg-[#7a0013] rounded"
                  >
                    {otpSent ? 'Verify' : 'OTP'}
                  </button>
              }
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* OTP input boxes */}
          {otpSent && !otpVerified && (
            <div className="flex justify-between mt-3 gap-2">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  ref={(el) => (otpInputsRef.current[index] = el)}
                  className="w-10 h-10 text-center border border-gray-300 rounded focus:ring-[#960018] focus:border-[#960018]"
                />
              ))}
            </div>
          )}





          {/* Username */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('username', { required: 'Username is required' })}
              type="text"
              className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#960018] focus:border-[#960018] focus:z-10 sm:text-sm"
              placeholder="Username"
            />
            {errors.username && (
              <p className="text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Enter a valid 10-digit phone number'
                }
              })}
              type="tel"
              className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#960018] focus:border-[#960018] focus:z-10 sm:text-sm"
              placeholder="Phone number"
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              type={showPassword ? 'text' : 'password'}
              className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#960018] focus:border-[#960018] focus:z-10 sm:text-sm"
              placeholder="Password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className='relative'>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-green-400" />
            </div>
            <input
              {...register('confirmPassword', {
                required: 'Confirm your password',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match'
              })}
              type="password"
              className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#960018] focus:border-[#960018] focus:z-10 sm:text-sm"
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#960018] hover:bg-[#7a0013] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#960018] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

