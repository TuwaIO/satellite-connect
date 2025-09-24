import { useEffect } from 'react';

export const useInitializeAppConnectors = ({
  initializeAppConnectors,
  onError,
}: {
  initializeAppConnectors: () => Promise<void>;
  onError?: (error: Error) => void;
}) => {
  useEffect(() => {
    const initializeConnectors = async () => {
      try {
        await initializeAppConnectors();
      } catch (error) {
        const errorHandler = onError ?? ((e: Error) => console.error('Failed to initialize connectors:', e));
        errorHandler(error as Error);
      }
    };
    initializeConnectors();
  }, []);
};
