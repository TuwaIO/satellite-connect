import { cn } from '@tuwaio/nova-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isAddress } from 'viem';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';

/**
 * Props for the ImpersonateForm component
 */
interface ImpersonateFormProps {
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
export function ImpersonateForm({ impersonatedAddress, setImpersonatedAddress }: ImpersonateFormProps) {
  // Get labels from context
  const labels = useNovaConnectLabels();

  // Access store state and methods
  const walletConnectionError = useSatelliteConnectStore((state) => state.walletConnectionError);
  const resetWalletConnectionError = useSatelliteConnectStore((state) => state.resetWalletConnectionError);
  const setWalletConnectionError = useSatelliteConnectStore((state) => state.setWalletConnectionError);

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
            setWalletConnectionError(labels.walletConnectionError);
          } else if (!isAddress(address)) {
            setWalletConnectionError(labels.walletConnectionError);
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
      labels.walletConnectionError,
      walletConnectionError,
    ],
  );

  /**
   * Handles input change
   */
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setHasInteracted(true);

    // Update the address value immediately
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
      setWalletConnectionError(labels.walletConnectionError);
    } else if (!isAddress(impersonatedAddress)) {
      setWalletConnectionError(labels.walletConnectionError);
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
      <label htmlFor="impersonated-address" className="block text-sm text-[var(--tuwa-text-secondary)]">
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
          'mt-1 w-full p-3 rounded-xl',
          // Theme colors
          'bg-[var(--tuwa-bg-secondary)]',
          'border border-[var(--tuwa-border-primary)]',
          'text-[var(--tuwa-text-primary)]',
          'placeholder:text-[var(--tuwa-text-secondary)]',
          // Focus and interaction states
          'focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-border-primary)]',
          // Error state styling
          walletConnectionError && 'border-red-500 focus:ring-red-500',
          // Transition for smooth state changes
          'transition-colors duration-200',
        )}
      />

      {/* Error message display */}
      {walletConnectionError && (
        <p id="address-error" className="mt-2 text-sm text-red-500" role="alert" aria-live="polite">
          {walletConnectionError}
        </p>
      )}
    </div>
  );
}
