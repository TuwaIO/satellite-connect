// Import the ready-made server instance from the new package
import { siweServer } from '@/satellite-siwe-next-auth/src';

// NextAuth will read process.env.NEXTAUTH_URL and NEXTAUTH_SECRET automatically
// The siweServer class handles all configuration and verification logic internally.

// Export the handlers for App Router
export const { GET, POST } = siweServer.handlers;
