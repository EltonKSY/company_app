import { useState, useEffect, useContext } from 'react';
import { getCookie } from '../helpers/validators';

export const useCreate = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const createUser = async newUser => {
    setIsPending(true);

    const cookie = getCookie('comp_app_JWT');
    //1) Send request with new user info
    const req = await fetch('http://localhost:3001/Employees', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: cookie,
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
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);
  return { createUser, isPending, error };
};
