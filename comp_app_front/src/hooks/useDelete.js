import { useState } from 'react';

export const useDelete = UID => {
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const deleteUser = async function () {
    setIsPending(true);
    //1) Send request with new user info
    fetch(`http://localhost:3001/Employees/${UID}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.ok) {
          setIsPending(false);
          setDeleted(true);
        } else {
          throw new Error('Something went wrong, Request Failed!');
        }
      })
      .catch(error => setError(error.message));
    setIsPending(false);
  };

  return { deleteUser, deleted, isPending, error };
};
