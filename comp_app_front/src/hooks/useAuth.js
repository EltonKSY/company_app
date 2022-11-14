import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FullContext } from '../components/FullContext';

export const useAuth = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const navigate = useNavigate();
  const ctx = useContext(FullContext);
  const login = async (username, password) => {
    console.log('log');
    setIsPending(true);

    //1) Send request with username & PW
    const req = await fetch('http://localhost:3001/Authenticate', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name: username,
        password: password,
      }),
    });

    const res = await req.json();
    //2a) If PW or Username is invalid, display errmessage
    if (!req.ok) setError(res.message);
    //2b) Set JWT in cookie for future request
    else {
      document.cookie = `comp_app_JWT=Bearer ${res.token}; expires=${new Date('December 17, 2025 03:24:00').toUTCString()}`;
      setError('');
      ctx.dispatch({ type: 'AUTH_READY', payload: res.result });
    }
    setIsPending(false);
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, isPending, error };
};