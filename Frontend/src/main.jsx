// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.jsx';

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </React.StrictMode>
);
