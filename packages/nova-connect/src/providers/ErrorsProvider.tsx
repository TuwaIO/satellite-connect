import { ToastCloseButton } from '@tuwaio/nova-core';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Bounce, toast, ToastContainer, type ToastPosition } from 'react-toastify';

import { ToastError } from '../components';
import { NovaConnectProviderProps, useNovaConnect } from '../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../hooks/useNovaConnectLabels';

interface ErrorsProviderProps extends Pick<NovaConnectProviderProps, 'store'> {
  /** Custom container ID for toast notifications */
  containerId?: string;
  /** Custom position for toast notifications */
  position?: ToastPosition;
  /** Auto close delay in milliseconds */
  autoClose?: number | false;
  /** Whether to enable drag to dismiss */
  draggable?: boolean;
}

export function ErrorsProvider({
  store,
  containerId = 'nova-connect-errors',
  position = 'top-center',
  autoClose = 7000,
  draggable = false,
}: ErrorsProviderProps) {
  const labels = useNovaConnectLabels();
  const { activeWallet, walletConnectionError } = useNovaConnect();

  const switchNetworkError = store.getState().switchNetworkError;

  // Track displayed errors to prevent duplicates
  const displayedErrorsRef = useRef<Set<string>>(new Set());
  const currentToastIdRef = useRef<string | null>(null);

  // Memoize error state
  const errorState = useMemo(() => {
    const hasWalletError = Boolean(walletConnectionError);
    const hasSwitchError = Boolean(switchNetworkError);
    const isConnected = Boolean(activeWallet?.isConnected);

    return {
      hasWalletError,
      hasSwitchError,
      isConnected,
      hasAnyError: hasWalletError || hasSwitchError,
      primaryError: walletConnectionError || switchNetworkError,
      errorType: hasWalletError ? 'wallet' : hasSwitchError ? 'switch' : null,
    };
  }, [walletConnectionError, switchNetworkError, activeWallet?.isConnected]);

  // Memoize error title based on type
  const errorTitle = useMemo(() => {
    switch (errorState.errorType) {
      case 'wallet':
        return labels.walletConnectionError;
      case 'switch':
        return labels.errorWhenChainSwitching;
      default:
        return labels.somethingWentWrong;
    }
  }, [errorState.errorType, labels]);

  // Generate error hash for deduplication
  const errorHash = useMemo(() => {
    if (!errorState.primaryError) return null;
    return `${errorState.errorType}-${errorState.primaryError.substring(0, 50)}`;
  }, [errorState.primaryError, errorState.errorType]);

  // Dismiss current toast
  const dismissCurrentToast = useCallback(() => {
    if (currentToastIdRef.current) {
      toast.dismiss(currentToastIdRef.current);
      currentToastIdRef.current = null;
    }
    toast.dismiss({ containerId });
  }, [containerId]);

  // Show error toast
  const showErrorToast = useCallback(
    (title: string, rawError: string, errorKey: string) => {
      // Dismiss previous toast first
      dismissCurrentToast();

      // Check if this error was already displayed
      if (displayedErrorsRef.current.has(errorKey)) {
        return;
      }

      try {
        // Use toast.error and capture the result properly
        toast.error(
          <ToastError
            title={title}
            rawError={rawError}
            onCopyComplete={(success) => {
              if (success && process.env.NODE_ENV === 'development') {
                console.log('Error copied to clipboard:', rawError.substring(0, 100));
              }
            }}
          />,
          {
            containerId,
            toastId: errorKey,
            onClose: () => {
              displayedErrorsRef.current.delete(errorKey);
              currentToastIdRef.current = null;
            },
          },
        );

        displayedErrorsRef.current.add(errorKey);
        currentToastIdRef.current = errorKey;
      } catch (error) {
        console.error('Failed to show error toast:', error);
      }
    },
    [containerId, dismissCurrentToast],
  );

  // Main effect to handle error display logic
  useEffect(() => {
    const { hasAnyError, isConnected, primaryError } = errorState;

    // Clear all errors when connected successfully
    if (isConnected && !hasAnyError) {
      dismissCurrentToast();
      displayedErrorsRef.current.clear();
      return;
    }

    // Show error if present and not already displayed
    if (hasAnyError && primaryError && errorHash) {
      // For connected state, only show switch network errors
      if (isConnected && errorState.errorType !== 'switch') {
        return;
      }

      showErrorToast(errorTitle, primaryError, errorHash);
    }
  }, [errorState, errorTitle, errorHash, showErrorToast, dismissCurrentToast]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      dismissCurrentToast();
      // eslint-disable-next-line
      displayedErrorsRef.current.clear();
    };
  }, [dismissCurrentToast]);

  // Memoize container props with proper types
  const containerProps = useMemo(
    () => ({
      containerId,
      position,
      closeOnClick: false,
      icon: false as const,
      closeButton: ToastCloseButton,
      autoClose,
      hideProgressBar: false,
      newestOnTop: false,
      pauseOnFocusLoss: false,
      draggable,
      pauseOnHover: true,
      theme: 'light' as const,
      transition: Bounce,
      className: 'p-0 bg-transparent',
    }),
    [containerId, position, autoClose, draggable],
  );

  return (
    <ToastContainer {...containerProps} role="alert" aria-live="assertive" aria-label={labels.somethingWentWrong} />
  );
}

// Add display name for better debugging
ErrorsProvider.displayName = 'ErrorsProvider';
