import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css'
import Navbar from './components/Navbar.jsx';
import { AuthProvider ,useAuth} from './contexts/AuthContext.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PremiumPage from './pages/PremiumPage.jsx';
import RecordsPage from './pages/RecordsPage.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddBorrowerPage from './pages/AddBorrowerPage.jsx';
import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import LoadingSpinner from './LoadingSpinner.jsx';
// import LoadingSpinner from "./components/LoadingSpinner.jsx"
// import AddBorrowerPage from './pages/AddBorrower.jsx';
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return !user ? children : <Navigate to="/dashboard" />;
}


function App() {
  const { loading } = useAuth();  
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    // <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />

              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignupPage />
                  </PublicRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/premium"
                element={
                  <ProtectedRoute>
                    <PremiumPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/records/:borrowerId"
                element={
                  <ProtectedRoute>
                    <RecordsPage />
                  </ProtectedRoute>
                }
              />

              {/* Optional: 404 Page */}
              <Route
                path="*"
                element={<h1 className="text-center text-2xl mt-10">404 - Page Not Found</h1>}
              />
              <Route
                    path="/new-borrower"
                    element={
                      <ProtectedRoute>
                        <AddBorrowerPage/>
                      </ProtectedRoute>
                    }
                  />
            </Routes>
          </main>

          <Toaster position="top-right" />
        </div>
      </Router>
    // </AuthProvider>
  );
}

export default App;

