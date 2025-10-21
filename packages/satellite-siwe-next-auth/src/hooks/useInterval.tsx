'use client';

import { useEffect, useRef } from 'react';

/**
 * @function useInterval
 * Creates a stable interval hook safe for client-side execution.
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null && typeof window !== 'undefined' && window.setInterval) {
      // Use window.setInterval and cast the ID to number to satisfy clearInterval's type
      const id = window.setInterval(() => savedCallback.current(), delay);
      return () => window.clearInterval(id);
    }
  }, [delay]);
}
