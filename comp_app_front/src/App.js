import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import ListingPage from './pages/ListingPage';
import { FullContext } from './components/FullContext';

import './App.css';

function App() {
  const ctx = useContext(FullContext);

  return (
    <>
      {ctx.authIsReady && (
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={ctx.user ? <Navigate to="/listing" /> : <AuthPage />} />
            <Route path="/listing" element={ctx.user ? <ListingPage /> : <Navigate to="/auth" />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
