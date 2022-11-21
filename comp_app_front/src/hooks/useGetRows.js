import { useEffect, useState } from 'react';

export const useGetRows = (path, trigger) => {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const allRows = await fetch(`http://localhost:3001/Employees/${path || ''}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application / json',
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
        .catch(error => {
          setError(error.message);
          setIsLoading(false);
          return;
        });
      setRows(allRows);
      setIsLoading(false);
    })();
  }, [path, trigger]);

  return { rows, error, isLoading, setRows };
};
