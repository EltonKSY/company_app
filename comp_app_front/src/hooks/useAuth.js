import { useState, useContext } from 'react';
import { FullContext } from '../components/FullContext';

export const useAuth = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const ctx = useContext(FullContext);
  const login = async (username, password) => {
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

  return { login, isPending, error };
};
