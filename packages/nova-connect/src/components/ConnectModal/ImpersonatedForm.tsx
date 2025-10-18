import { cn } from '@tuwaio/nova-core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isAddress } from 'viem';

import { useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { ConnectButtonProps } from '../ConnectButton';

/**
 * Props for the ImpersonateForm component
 */
interface ImpersonateFormProps extends Pick<ConnectButtonProps, 'store'> {
  /** Current impersonated wallet address value */
  impersonatedAddress: string;
  /** Callback to update the impersonated address */
  setImpersonatedAddress: (value: string) => void;
}

/**
 * Form component for entering wallet address to impersonate
 *
 * Validates input to prevent empty addresses and automatically sets errors in the store.
 * Gets labels from context and manages validation internally with debounced validation.
 */
export function ImpersonateForm({ impersonatedAddress, setImpersonatedAddress, store }: ImpersonateFormProps) {
  // Get labels from context
  const labels = useNovaConnectLabels();
  const { activeWallet, walletConnectionError } = useNovaConnect();

  // Access store state and methods
  const resetWalletConnectionError = store.getState().resetWalletConnectionError;
  const setWalletConnectionError = store.getState().setWalletConnectionError;

  // Local state to track if user has interacted with the field
  const [hasInteracted, setHasInteracted] = useState(false);

  // Use ref to store timeout ID
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Debounced validation function
   */
  const debouncedValidate = useCallback(
    (address: string) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (hasInteracted) {
          if (!address.trim()) {
            setWalletConnectionError(labels.impersonateAddressEmpty);
          } else if (!isAddress(address)) {
            setWalletConnectionError(labels.impersonateAddressNotCorrect);
          } else if (activeWallet?.isConnected) {
            setWalletConnectionError(labels.impersonateAddressConnected);
          } else {
            if (walletConnectionError) {
              resetWalletConnectionError();
            }
          }
        }
      }, 500); // 500ms debounce delay
    },
    [
      hasInteracted,
      setWalletConnectionError,
      resetWalletConnectionError,
      activeWallet?.isConnected,
      labels.impersonateAddressEmpty,
      labels.impersonateAddressNotCorrect,
      labels.impersonateAddressConnected,
      walletConnectionError,
    ],
  );

  /**
   * Handles input change
   */
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setHasInteracted(true);

    setImpersonatedAddress(newValue);

    // Clear error immediately if field becomes valid
    if (newValue.trim() && walletConnectionError) {
      if (isAddress(newValue)) {
        resetWalletConnectionError();
      }
    }

    // Trigger debounced validation for invalid cases
    debouncedValidate(newValue);
  };

  /**
   * Handles blur event to validate final input immediately
   */
  const handleBlur = () => {
    setHasInteracted(true);

    // Clear any pending debounced validation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Validate immediately on blur without debounce
    if (!impersonatedAddress.trim()) {
      setWalletConnectionError(labels.impersonateAddressEmpty);
    } else if (!isAddress(impersonatedAddress)) {
      setWalletConnectionError(labels.impersonateAddressNotCorrect);
    } else {
      if (walletConnectionError) {
        resetWalletConnectionError();
      }
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clear timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      resetWalletConnectionError();
    };
  }, [resetWalletConnectionError]);

  return (
    <div>
      {/* Form label */}
      <label
        htmlFor="impersonated-address"
        className="novacon:block novacon:text-sm novacon:text-[var(--tuwa-text-secondary)]"
      >
        {labels.enterWalletAddress}
      </label>

      {/* Address input field */}
      <input
        id="impersonated-address"
        type="text"
        value={impersonatedAddress}
        onChange={handleAddressChange}
        onBlur={handleBlur}
        placeholder={labels.walletAddressPlaceholder}
        aria-describedby={walletConnectionError ? 'address-error' : undefined}
        aria-invalid={walletConnectionError ? 'true' : 'false'}
        autoComplete="off"
        spellCheck="false"
        className={cn(
          // Base layout and spacing
          'novacon:mt-1 novacon:w-full novacon:p-3 novacon:rounded-xl',
          // Theme colors
          'novacon:bg-[var(--tuwa-bg-secondary)]',
          'novacon:border novacon:border-[var(--tuwa-border-primary)]',
          'novacon:text-[var(--tuwa-text-primary)]',
          'novacon:placeholder:text-[var(--tuwa-text-secondary)]',
          // Focus and interaction states
          'novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-border-primary)]',
          // Error state styling
          walletConnectionError && 'novacon:border-red-500 novacon:focus:ring-red-500',
          // Transition for smooth state changes
          'novacon:transition-colors novacon:duration-200',
        )}
      />

      {/* Error message display */}
      {walletConnectionError && (
        <p
          id="address-error"
          className="novacon:mt-2 novacon:text-sm novacon:text-red-500"
          role="alert"
          aria-live="polite"
        >
          {walletConnectionError}
        </p>
      )}
    </div>
  );
}
