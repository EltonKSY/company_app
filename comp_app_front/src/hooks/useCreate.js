import { useState } from 'react';

export const useCreate = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const createUser = async newUser => {
    setIsPending(true);
    //1) Send request with new user info
    const req = await fetch('http://localhost:3001/Employees', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    const res = await req.json();
    //2a) If PW or Username is invalid, display errmessage
    if (!req.ok) setError(res.message);
    //2b) Set JWT in cookie for future request
    else {
    }
    setIsPending(false);
  };

  return { createUser, isPending, error };
};
