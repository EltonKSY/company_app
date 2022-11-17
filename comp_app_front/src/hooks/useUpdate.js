import { useState, useEffect, useContext } from 'react';
import { getCookie } from '../helpers/validators';

export const useUpdate = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const updateUser = async updatedUser => {
    setIsPending(true);
    const cookie = getCookie('comp_app_JWT');
    //1) Send request with new user info
    const req = await fetch(`http://localhost:3001/Employees/${updateUser.UID}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: cookie,
      },
      body: JSON.stringify(updatedUser),
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
  return { updateUser, isPending, error };
};
