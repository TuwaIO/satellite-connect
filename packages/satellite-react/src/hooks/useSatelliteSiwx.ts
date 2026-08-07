import type { SiwxStatus } from '@tuwaio/siwx-core';
import type {
  MinimalSatelliteConnection,
  SatelliteSiwxFieldOptions,
  SiwxClientSession,
  UseSiwxReturn,
} from '@tuwaio/siwx-react';
import { createSatelliteSiwxSigner, getSatelliteSiwxFields, useSiwx, useSiwxSession } from '@tuwaio/siwx-react';
import { useCallback } from 'react';

import { useSatelliteConnectStore } from './satelliteHook';

/**
 * A wrapper around `@tuwaio/siwx-react` `useSiwx` hook that automatically
 * injects the appropriate chain signer (EVM or Solana) from the active
 * Satellite connection.
 *
 * @example
 * ```tsx
 * const { signIn, session, status } = useSatelliteSiwx();
 *
 * await signIn({
 *   verifier: async (payload) => {
 *     const res = await fetch('/api/siwx/verify', { method: 'POST', body: JSON.stringify(payload) });
 *     return res.ok ? res.json() : null;
 *   }
 * });
 * ```
 */
export const useSatelliteSiwx = (): UseSiwxReturn & {
  status: SiwxStatus;
  session: SiwxClientSession | null;
  error: string | null;
  isAuthenticated: boolean;
} => {
  const siwx = useSiwx();
  const sessionState = useSiwxSession();
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);

  const signIn = useCallback(
    async (params: {
      /**
       * A verification function that submits the signed payload to the backend
       * and returns the established SIWX session.
       */
      verifier: (payload: { message: string; signature: string }) => Promise<SiwxClientSession | null>;
      /**
       * Optional SIWX fields (like `domain`, `uri`, `statement`) to construct the CAIP-122 message.
       * `address` and `chainId` are automatically resolved from the active connection.
       */
      fields?: SatelliteSiwxFieldOptions;
    }) => {
      if (!activeConnection) {
        throw new Error('[Satellite SIWX] No active wallet connection found');
      }

      // Automatically dynamically import and create the appropriate signer
      // using the built-in helper from @tuwaio/siwx-react
      const signer = await createSatelliteSiwxSigner(activeConnection as unknown as MinimalSatelliteConnection);

      // Automatically construct CAIP-10 address and CAIP-2 chainId
      const fields = getSatelliteSiwxFields(activeConnection as unknown as MinimalSatelliteConnection, params.fields);

      // Execute the SIWX signIn flow
      return siwx.signIn({
        signer,
        verifier: params.verifier,
        fields,
      });
    },
    [siwx, activeConnection],
  );

  return {
    ...siwx,
    ...sessionState,
    signIn,
  };
};
