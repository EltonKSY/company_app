import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import ListingPage from './pages/ListingPage';

import './App.css';
const mockDataActive = [
  {
    fname: 'User1',
    id: 'User1',
    lname: 'Lucien',
    dob: '2020-12-31',
    email: 'user1@gmail.com',
    skill: ['Front-End Developer'],
    password: 'Password',
    uid: 66,
    isActive: true,
  },
  {
    fname: 'User2',
    id: 'User2',
    lname: 'Lucien',
    dob: '2020-12-31',
    email: 'user1@gmail.com',
    skill: ['Front-End Developer'],
    password: 'Password',
    uid: 66,
    isActive: true,
  },
  {
    fname: 'User3',
    id: 'User3',
    lname: 'Lucien',
    dob: '2020-12-31',
    email: 'user1@gmail.com',
    skill: ['Front-End Developer'],
    password: 'Password',
    password: 'Password',
    uid: 66,
    isActive: true,
  },
];

const mockDataInActive = [
  {
    fname: 'User4',
    id: 'User1',
    lname: 'Lucien',
    dob: '2020-12-31',
    email: 'user1@gmail.com',
    skill: ['Front-End Developer'],
    password: 'Password',
    uid: 66,
    isActive: true,
  },
  {
    fname: 'User5',
    id: 'User2',
    lname: 'Lucien',
    dob: '2020-12-31',
    email: 'user1@gmail.com',
    skill: ['Front-End Developer'],
    password: 'Password',
    uid: 66,
    isActive: true,
  },
  {
    fname: 'User6',
    id: 'User3',
    lname: 'Lucien',
    dob: '2020-12-31',
    email: 'user1@gmail.com',
    skill: ['Front-End Developer'],
    password: 'Password',
    uid: 66,
    isActive: true,
  },
];
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/listing" element={<ListingPage activeEmps={mockDataActive} inactiveEmps={mockDataInActive} />} />
        <Route path="*" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
