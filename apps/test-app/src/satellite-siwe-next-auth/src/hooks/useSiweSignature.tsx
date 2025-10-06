'use client';

import { disconnect, getAccount, signMessage } from '@wagmi/core';
import { getCsrfToken } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { Address } from 'viem';
import { createSiweMessage } from 'viem/siwe';
import { useAccount, useConfig } from 'wagmi';

import { GetSiweMessageOptions, UseSiweSignatureResult } from '../types';

/**
 * @function useSiweSignature
 * @description A low-level hook that handles the core SIWE cryptographic flow:
 * getting the nonce, creating the message, and getting the signature using Wagmi/Viem.
 * This is the building block for custom backend authentication.
 * @returns {UseSiweSignatureResult}
 * * @example
 * // const { getSiweSignature, isReadyToSign, isRejected } = useSiweSignature();
 */
export function useSiweSignature(): UseSiweSignatureResult {
  const wagmiConfig = useConfig();
  const { isConnected, address, chainId } = useAccount({ config: wagmiConfig });
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

    const walletSnapshot = getAccount(wagmiConfig);

    if (!walletSnapshot.isConnected || !walletSnapshot.address || !walletSnapshot.chainId) {
      throw new Error('Wallet not connected or connection details are missing from Wagmi snapshot.');
    }

    try {
      const nonce = await getCsrfToken();
      if (!nonce) throw new Error('Failed to retrieve CSRF token/nonce from NextAuth.');

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
