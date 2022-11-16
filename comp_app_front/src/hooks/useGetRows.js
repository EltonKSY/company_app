import { useEffect, useState } from 'react';
import { getCookie } from '../helpers/validators';

export const useGetRows = path => {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const cookie = getCookie('comp_app_JWT');

      if (!getCookie('comp_app_JWT')) return setRows(null);
      const allRows = await fetch(`http://localhost:3001/Employees/${path || ''}`, {
        headers: {
          'Content-Type': 'application / json',
          Authorization: cookie,
        },
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Something went wrong, Request Failed!');
          }
        })
        .then(res => {
          return res.result;
        })
        .catch(error => setError(error));
      setRows(allRows);
      setIsLoading(false);
    })();
  }, [path]);

  return { rows, error, isLoading };
};
