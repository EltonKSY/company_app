import { useState } from 'react';

export const useUpdate = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const updateUser = async updatedUser => {
    setIsPending(true);
    //1) Send request with new user info
    const req = await fetch(`http://localhost:3001/Employees/${updatedUser.UID}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
