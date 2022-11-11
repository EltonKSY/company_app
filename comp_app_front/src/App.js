import React, { useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import ListingPage from './pages/ListingPage';
import { FullContext } from './components/FullContext';

import './App.css';

function App() {
  const ctx = useContext(FullContext);

  return (
    <>
      {/* {ctx.authIsReady && ( */}
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={ctx.user ? <ListingPage /> : <AuthPage />} />
          <Route path="/listing" element={ctx.user ? <ListingPage /> : <AuthPage />} />

          <Route path="*" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
      {/* )} */}
    </>
  );
}

export default App;
