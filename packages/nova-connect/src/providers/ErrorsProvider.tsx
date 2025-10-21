/**
 * @file This file contains the `ErrorsProvider` component, a customizable error toast provider with full styling control.
 */

import { ToastCloseButton } from '@tuwaio/nova-core';
import { ComponentPropsWithoutRef, ComponentType, useCallback, useEffect, useMemo, useRef } from 'react';
import { Bounce, toast, ToastContainer, type ToastPosition, type ToastTransition } from 'react-toastify';

import { ToastError, ToastErrorCustomization } from '../components';
import { NovaConnectProviderProps, useNovaConnect } from '../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../hooks/useNovaConnectLabels';

// --- Types for Customization ---
type CustomToastErrorProps = {
  title: string;
  rawError: string;
  onCopyComplete?: (success: boolean) => void;
  errorType: 'wallet' | 'switch' | null;
  isConnected: boolean;
};

type CustomContainerProps = ComponentPropsWithoutRef<typeof ToastContainer>;

/**
 * Customization options for ErrorsProvider component
 */
export type ErrorsProviderCustomization = {
  /** Override ToastContainer element props */
  containerProps?: Partial<ComponentPropsWithoutRef<typeof ToastContainer>>;
  /** Custom components */
  components?: {
    /** Custom ToastError component */
    ToastError?: ComponentType<CustomToastErrorProps>;
    /** Custom ToastContainer component */
    Container?: ComponentType<CustomContainerProps>;
  };
  /** Default ToastError customization (only used with default ToastError component) */
  toastErrorCustomization?: ToastErrorCustomization;
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { hasErrors: boolean; errorType: 'wallet' | 'switch' | null }) => string;
  };
  /** Custom toast options generators */
  toastOptions?: {
    /** Function to generate toast options */
    error?: (params: {
      title: string;
      rawError: string;
      errorType: 'wallet' | 'switch' | null;
      isConnected: boolean;
    }) => Partial<Parameters<typeof toast.error>[1]>;
  };
  /** Custom logic handlers */
  handlers?: {
    /** Custom error display logic */
    showError?: (
      originalHandler: (title: string, rawError: string, errorKey: string) => void,
      params: { title: string; rawError: string; errorKey: string; errorType: 'wallet' | 'switch' | null },
    ) => void;
    /** Custom error dismissal logic */
    dismissError?: (originalHandler: () => void) => void;
    /** Custom copy complete handler */
    onCopyComplete?: (success: boolean, rawError: string, errorType: 'wallet' | 'switch' | null) => void;
  };
  /** Custom error title generator - does NOT customize labels, just allows title modification */
  errorTitle?: (defaultTitle: string, params: { errorType: 'wallet' | 'switch' | null }) => string;
  /** Custom error hash generator for deduplication */
  errorHash?: (
    defaultHash: string | null,
    params: { primaryError: string | null; errorType: 'wallet' | 'switch' | null },
  ) => string | null;
};

export interface ErrorsProviderProps extends Pick<NovaConnectProviderProps, 'store'> {
  /** Custom container ID for toast notifications */
  containerId?: string;
  /** Custom position for toast notifications */
  position?: ToastPosition;
  /** Auto close delay in milliseconds */
  autoClose?: number | false;
  /** Whether to enable drag to dismiss */
  draggable?: boolean;
  /** Customization options */
  customization?: ErrorsProviderCustomization;
}

// --- Default Sub-Components ---
const DefaultToastError = ({
  title,
  rawError,
  onCopyComplete,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  errorType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isConnected,
  ...props
}: CustomToastErrorProps & { customization?: ToastErrorCustomization }) => {
  return (
    <ToastError title={title} rawError={rawError} onCopyComplete={onCopyComplete} customization={props.customization} />
  );
};

const DefaultContainer = (props: CustomContainerProps) => {
  const labels = useNovaConnectLabels();
  return <ToastContainer {...props} role="alert" aria-live="assertive" aria-label={labels.somethingWentWrong} />;
};

// --- Default Handlers ---
const defaultShowErrorHandler = (
  originalHandler: (title: string, rawError: string, errorKey: string) => void,
  params: { title: string; rawError: string; errorKey: string },
) => {
  originalHandler(params.title, params.rawError, params.errorKey);
};

const defaultDismissErrorHandler = (originalHandler: () => void) => {
  originalHandler();
};

const defaultCopyCompleteHandler = (success: boolean, rawError: string) => {
  if (success && process.env.NODE_ENV === 'development') {
    console.log('Error copied to clipboard:', rawError.substring(0, 100));
  }
};

const defaultErrorTitleGenerator = (defaultTitle: string) => defaultTitle;

const defaultErrorHashGenerator = (defaultHash: string | null) => defaultHash;

/**
 * A highly customizable error toast provider with extensive styling options and component replacement capabilities.
 * Provides comprehensive customization for appearance, behavior, and error handling logic while maintaining accessibility.
 */
export function ErrorsProvider({
  store,
  containerId = 'nova-connect-errors',
  position = 'top-center',
  autoClose = 7000,
  draggable = false,
  customization,
}: ErrorsProviderProps) {
  const labels = useNovaConnectLabels();
  const { activeWallet, walletConnectionError } = useNovaConnect();

  const switchNetworkError = store.getState().switchNetworkError;

  // Extract custom components and handlers
  const { ToastError: CustomToastError = DefaultToastError, Container = DefaultContainer } =
    customization?.components ?? {};

  const {
    showError: customShowErrorHandler = defaultShowErrorHandler,
    dismissError: customDismissErrorHandler = defaultDismissErrorHandler,
    onCopyComplete: customCopyCompleteHandler = defaultCopyCompleteHandler,
  } = customization?.handlers ?? {};

  const {
    errorTitle: customErrorTitleGenerator = defaultErrorTitleGenerator,
    errorHash: customErrorHashGenerator = defaultErrorHashGenerator,
  } = customization ?? {};

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
      primaryError: walletConnectionError || switchNetworkError || null,
      errorType: (hasWalletError ? 'wallet' : hasSwitchError ? 'switch' : null) as 'wallet' | 'switch' | null,
    };
  }, [walletConnectionError, switchNetworkError, activeWallet?.isConnected]);

  // Memoize default error title based on type (using labels, NOT customizing them)
  const defaultErrorTitle = useMemo(() => {
    switch (errorState.errorType) {
      case 'wallet':
        return labels.walletConnectionError;
      case 'switch':
        return labels.errorWhenChainSwitching;
      default:
        return labels.somethingWentWrong;
    }
  }, [errorState.errorType, labels]);

  // Generate custom error title (allows modification but NOT labels customization)
  const errorTitle = useMemo(() => {
    return customErrorTitleGenerator(defaultErrorTitle, { errorType: errorState.errorType });
  }, [customErrorTitleGenerator, defaultErrorTitle, errorState.errorType]);

  // Generate default error hash for deduplication
  const defaultErrorHash = useMemo(() => {
    if (!errorState.primaryError) return null;
    return `${errorState.errorType}-${errorState.primaryError.substring(0, 50)}`;
  }, [errorState.primaryError, errorState.errorType]);

  // Generate custom error hash
  const errorHash = useMemo(() => {
    return customErrorHashGenerator(defaultErrorHash, {
      primaryError: errorState.primaryError,
      errorType: errorState.errorType,
    });
  }, [customErrorHashGenerator, defaultErrorHash, errorState.primaryError, errorState.errorType]);

  // Dismiss current toast
  const dismissCurrentToast = useCallback(() => {
    const originalHandler = () => {
      if (currentToastIdRef.current) {
        toast.dismiss(currentToastIdRef.current);
        currentToastIdRef.current = null;
      }
      toast.dismiss({ containerId });
    };
    customDismissErrorHandler(originalHandler);
  }, [containerId, customDismissErrorHandler]);

  // Handle copy complete
  const handleCopyComplete = useCallback(
    (success: boolean, rawError: string) => {
      customCopyCompleteHandler(success, rawError, errorState.errorType);
    },
    [customCopyCompleteHandler, errorState.errorType],
  );

  // Original handler for error display - using full customization object in dependencies
  const originalErrorHandler = useCallback(
    (t: string, r: string, k: string) => {
      // Dismiss previous toast first
      dismissCurrentToast();

      // Check if this error was already displayed
      if (displayedErrorsRef.current.has(k)) {
        return;
      }

      try {
        // Generate custom toast options
        const defaultToastOptions = {
          containerId,
          toastId: k,
          onClose: () => {
            displayedErrorsRef.current.delete(k);
            currentToastIdRef.current = null;
          },
        };

        const customToastOptions = customization?.toastOptions?.error?.({
          title: t,
          rawError: r,
          errorType: errorState.errorType,
          isConnected: errorState.isConnected,
        });

        const toastOptions = { ...defaultToastOptions, ...customToastOptions };

        // Use toast.error and capture the result properly
        toast.error(
          <CustomToastError
            title={t}
            rawError={r}
            errorType={errorState.errorType}
            isConnected={errorState.isConnected}
            onCopyComplete={(success) => handleCopyComplete(success, r)}
            customization={customization?.toastErrorCustomization}
          />,
          toastOptions,
        );

        displayedErrorsRef.current.add(k);
        currentToastIdRef.current = k;
      } catch (error) {
        console.error('Failed to show error toast:', error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      dismissCurrentToast,
      containerId,
      customization?.toastOptions?.error,
      customization?.toastErrorCustomization,
      CustomToastError,
      errorState.errorType,
      errorState.isConnected,
      handleCopyComplete,
    ],
  );

  // Show error toast
  const showErrorToast = useCallback(
    (title: string, rawError: string, errorKey: string) => {
      customShowErrorHandler(originalErrorHandler, { title, rawError, errorKey, errorType: errorState.errorType });
    },
    [originalErrorHandler, customShowErrorHandler, errorState.errorType],
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

  // Generate container classes
  const containerClasses = useMemo(() => {
    if (customization?.classNames?.container) {
      return customization.classNames.container({
        hasErrors: errorState.hasAnyError,
        errorType: errorState.errorType,
      });
    }

    return 'novacon:p-0 novacon:bg-transparent';
  }, [customization, errorState.hasAnyError, errorState.errorType]);

  // Memoize default container props
  const defaultContainerProps = useMemo(
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
      transition: Bounce as ToastTransition,
    }),
    [containerId, position, autoClose, draggable],
  );

  // Merge container props (NO labels passed to custom components!)
  const containerProps = useMemo(
    () => ({
      ...defaultContainerProps,
      ...customization?.containerProps,
      className: containerClasses,
    }),
    [defaultContainerProps, customization?.containerProps, containerClasses],
  );

  return <Container {...containerProps} />;
}

// Add display name for better debugging
ErrorsProvider.displayName = 'ErrorsProvider';
