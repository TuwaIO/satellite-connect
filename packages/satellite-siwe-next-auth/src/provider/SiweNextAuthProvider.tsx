'use client';

import { useSiweAuthAdapter } from '../hooks/useSiweAuthAdapter';
import { SiweNextAuthProviderProps } from '../types';
import { SiweAuthContext } from './SiweAuthContext';

/**
 * @component
 * @name SiweNextAuthProvider
 * @description Universal Provider for Sign-In with Ethereum (SIWE) using NextAuth.js.
 * This component handles the SIWE authentication logic.
 * It must be nested inside NextAuth's `<SessionProvider>` and your Wagmi Provider.
 * * **Note**: This provider requires the server-side NextAuth configuration to be set up.
 */
export function SiweNextAuthProvider(props: SiweNextAuthProviderProps) {
  const siweAuth = useSiweAuthAdapter(props);
  return <SiweAuthContext.Provider value={siweAuth}>{props.children}</SiweAuthContext.Provider>;
}
