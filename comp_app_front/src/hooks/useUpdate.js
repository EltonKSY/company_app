import { useState } from 'react';
import { getCookie } from '../helpers/validators';

export const useUpdate = () => {
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
    //2) If request fails display errmessage
    if (!req.ok) setError(res.message);
    setIsPending(false);
  };

  return { updateUser, isPending, error };
};
