// RetryHandler.tsx
import React, { useState, useEffect } from 'react';
import { CircularProgress, Typography } from '@mui/material';

interface RetryHandlerProps<T> {
  fetchData: () => Promise<T>;
  maxRetries: number;
  retryTimeout: number;
  render: (data: T | null, loading: boolean, error: string | null) => JSX.Element;
}

const RetryHandler = <T,>({ fetchData, maxRetries, retryTimeout, render }: RetryHandlerProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    setData(null); // Reset data
    setLoading(true); // Set loading to true
    setError(null); // Clear error
    setRetryCount(0); // Reset retry count
  }, [fetchData]);

  useEffect(() => {
    const fetchDataWithRetry = async () => {
      try {
        const result = await fetchData();
        setData(result);
        setLoading(false);
      } catch (err) {
        if (retryCount < maxRetries) {
          setRetryCount((prevCount) => prevCount + 1);
        } else {
          setError('Failed to fetch data.');
          setLoading(false);
        }
      }
    };

    if (loading && retryCount <= maxRetries) {
      const timer = setTimeout(fetchDataWithRetry, retryTimeout);
      return () => clearTimeout(timer);
    }
  }, [fetchData, retryCount, maxRetries, retryTimeout, loading]);

  return render(data, loading, error);
};

export default RetryHandler;
