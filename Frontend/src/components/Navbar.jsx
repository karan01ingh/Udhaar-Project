import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, userProfile } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success("Logout Successfully");
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || 'Signup failed';
          toast.error(errorMessage);
      // console.error('Signup error:', error);
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#960018] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Udhhar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-[#960018] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/premium" 
                  className="text-gray-700 hover:text-[#960018] px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <Crown className="w-4 h-4" />
                  <span>Premium</span>
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#960018] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      {userProfile?.photoURL ? (
                        <img 
                          src={userProfile.photoURL} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <span>{userProfile?.username || 'Profile'}</span>
                  </button>
                  
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200"
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Profile Settings</span>
                          </div>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-[#960018] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-[#960018] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#7a0013] transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#960018] p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#960018] hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/premium"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#960018] hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4" />
                      <span>Premium</span>
                    </div>
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#960018] hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#960018] hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 text-base font-medium text-white bg-[#960018] hover:bg-[#7a0013] rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}