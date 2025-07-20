import React, { createContext, use, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../config/firebase.js';
import axios from '../utils/axios';

// Create AuthContext without TypeScript typing
const AuthContext = createContext(undefined);

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// AuthProvider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up a user
  async function signup(email, password, userData) {
    // const res = await axios((auth, email, password));
    // const newUser = res.user;
    // await sendEmailVerification(newUser);

    // Send user data to backend
    await axios.post('https://udhaar-project.onrender.com/api/auth/signup',{
      email: email,
      password:password,
      ...userData
    });
  }


  // Log in with email/password
  //   async function login(email, password) {
  //     await axios.post('http://localhost:3001/api/auth/login',{
  //     email: email,
  //     password:password
  //   }); 
  //   setUser(res.data); 
  // }
  async function login(email, password) {
  try {
    const res = await fetch('https://udhaar-project.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Important if your backend sets cookies
      body: JSON.stringify({ email, password })
    });
    console.log(res);
    const data = await res.json();
    console.log("data",data);
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    console.log(data);
    setUser(data);
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

  // async function login(email, password) {
  //   await signInWithEmailAndPassword(auth, email, password);
  // }

  // Google login
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const googleUser = result.user;
    try {
      const res=await axios.post('https://udhaar-project.onrender.com/api/auth/google', {
        uid: googleUser.uid,
        email: googleUser.email,
        displayName: googleUser.displayName,
        photoURL: googleUser.photoURL
      },
      {withCredentials:true});
      setUser(res.data.user);
    } catch (error) {
      console.error('Error syncing with backend:', error);
    }
  }

  // Logout user
async function logout(){
  setUser(null);
  setUserProfile(null);
  await axios.post('https://udhaar-project.onrender.com/api/auth/logout', null, {
    withCredentials: true  // This ensures cookies (like access_token) are sent
  });
}


  // Observe authentication state
 const checkAuthWithBackend = async () => {
  try {
    const response = await axios.get('https://udhaar-project.onrender.com/api/auth/me', {
      withCredentials: true, // include cookies (JWT)
    });
    const user = response.data;
    
    if (user) {
      setUser(user);
      setUserProfile(user);
    } else {
      // If API responded without user data
      setUser(null);
      setUserProfile(null);
    }

  } catch (error) {
    // Avoid logging 401s (common if user not logged in)
    if (error.response?.status !== 401) {
      console.error('Auth check failed:', error.response?.data?.message || error.message);
    }
    setUser(null);
    setUserProfile(null);
  } finally {
    setLoading(false);
  }
};

// Run it on mount
useEffect(() => {
  checkAuthWithBackend();
}, []);



  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    userProfile,
    setUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
