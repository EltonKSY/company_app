import React, { useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import ListingPage from './pages/ListingPage';

import './App.css';
import { FullContext } from './components/FullContext';
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

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const getEmployees = async () => {
  const emps = await fetch('http://localhost:3001/Employees', {
    headers: {
      'Content-Type': 'application / json',
      Authorization: getCookie('comp_app_JWT'),
    },
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else throw new Error('Something went wrong');
    })
    .then(res => {
      return res.result;
    })
    .catch(error => {
      console.log(error);
    });
  return emps;
};

function App() {
  const ctx = useContext(FullContext);
  useEffect(() => {
    getEmployees().then(emps => ctx.dispatch({ type: 'ALL_USERS', payload: emps }));
  }, [ctx.user]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/listing" element={<ListingPage />} />
        <Route path="*" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
