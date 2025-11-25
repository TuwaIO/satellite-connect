'use client';

import { Config, disconnect, getConnection, signMessage } from '@wagmi/core';
import { useEffect, useMemo, useState } from 'react';
import { Address } from 'viem';
import { createSiweMessage } from 'viem/siwe';
import { useConnection } from 'wagmi';

import { GetSiweMessageOptions, UseSiweSignatureResult } from '../types';

/**
 * @function fetchNonce
 * @description Generates a cryptographically secure, alphanumeric random string to use as the SIWE nonce,
 * satisfying the viem/SIWE requirement (at least 8 chars, alphanumeric).
 * @returns {Promise<string>} The valid alphanumeric nonce string.
 */
async function fetchNonce(): Promise<string> {
  // Generate UUID and remove hyphens to create a secure, alphanumeric nonce.
  return crypto.randomUUID().replace(/-/g, '');
}

/**
 * @function useSiweSignature
 * @description A low-level hook that handles the core SIWE cryptographic flow:
 * getting the nonce, creating the message, and getting the signature using Wagmi/Viem.
 * This is the building block for custom backend authentication.
 * @returns {UseSiweSignatureResult}
 * * @example
 * // const { getSiweSignature, isReadyToSign, isRejected } = useSiweSignature();
 */
export function useSiweSignature({ wagmiConfig }: { wagmiConfig: Config }): UseSiweSignatureResult {
  const { isConnected, address, chainId } = useConnection({ config: wagmiConfig });
  const [isRejected, setIsRejected] = useState(false);

  const isReadyToSign = useMemo(() => isConnected && !!address && !!chainId, [isConnected, address, chainId]);

  // Clear rejected state upon context change
  useEffect(() => {
    if (isReadyToSign) {
      setIsRejected(false);
    }
  }, [isReadyToSign]);

  const getSiweSignature = async (customOptions?: GetSiweMessageOptions) => {
    setIsRejected(false); // Reset rejection status at the start of a new attempt

    const walletSnapshot = getConnection(wagmiConfig);

    if (!walletSnapshot.isConnected || !walletSnapshot.address || !walletSnapshot.chainId) {
      throw new Error('Wallet not connected or connection details are missing from Wagmi snapshot.');
    }

    try {
      // Use the corrected fetchNonce
      const nonce = await fetchNonce();
      if (!nonce) throw new Error('Failed to retrieve CSRF token/nonce.');

      const messageToSign = createSiweMessage({
        domain: window.location.host,
        statement: 'Sign in with Ethereum to the application.',
        uri: window.location.origin,
        version: '1',
        ...(customOptions ? customOptions() : {}), // Apply custom options
        address: walletSnapshot.address,
        chainId: walletSnapshot.chainId,
        nonce,
      });

      const signature = await signMessage(wagmiConfig, { message: messageToSign });

      if (!signature) {
        setIsRejected(true); // Set rejected status if signature is null/undefined
        await disconnect(wagmiConfig);
        throw new Error('Message signing cancelled by user or failed.');
      }

      return { message: messageToSign, signature: signature as Address };
    } catch (error) {
      await disconnect(wagmiConfig);
      console.error('Error during signature generation:', error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      if (err.name === 'UserRejectedRequestError' || err.code === 4001 || /user rejected/i.test(err.message)) {
        setIsRejected(true);
      }
      throw error;
    }
  };

  return { getSiweSignature, isReadyToSign, isRejected };
}
