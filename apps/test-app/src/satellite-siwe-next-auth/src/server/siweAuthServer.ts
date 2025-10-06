import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SiweMessage } from 'siwe';

/**
 * @typedef {function(req: Request, context: { params: any }): Promise<Response>} AppRouterHandler
 * Type definition for the Next.js App Router route handler function signature.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppRouterHandler = (req: Request, context: { params: any }) => Promise<Response>;

// --- UTILITY ---

/**
 * @private
 * @function getDomain
 * Utility function to extract the host (including port for localhost) for SIWE verification.
 * This ensures the server-side domain strictly matches the client-signed 'window.location.host'.
 * @param {string | undefined} url - The base URL of the NextAuth instance (from NEXTAUTH_URL).
 * @returns {string} The host (e.g., 'myapp.com' or 'localhost:3000').
 */
function getDomain(url: string | undefined): string {
  if (!url) {
    console.warn("NEXTAUTH_URL is not defined. Defaulting domain check to 'localhost'.");
    return 'localhost';
  }
  try {
    const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    // Use 'host' to include the port, crucial for accurate verification on development servers.
    return parsedUrl.host;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(`Invalid URL provided in NEXTAUTH_URL: ${url}. Error: ${typeof e === 'string' ? e : e.message}`);
    return 'localhost';
  }
}

// --- SERVER CLASS ---

/**
 * @class SiweAuthServer
 * @description Encapsulates all NextAuth and SIWE server-side logic into a reusable class.
 * Provides simplified handlers compatible with the Next.js App Router (route.ts).
 */
class SiweAuthServer {
  // We use the generic 'any' type to hold the NextAuth handler instance,
  // preventing internal type conflicts with the stable App Router signature.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handler: any;

  /**
   * @constructor
   * @param {string | undefined} nextAuthUrl - The base URL of the NextAuth instance (e.g., process.env.NEXTAUTH_URL).
   */
  constructor(nextAuthUrl: string | undefined) {
    const domain = getDomain(nextAuthUrl);

    const authOptions: NextAuthOptions = {
      providers: [
        CredentialsProvider({
          name: 'Ethereum',
          credentials: {
            message: { label: 'Message', type: 'text' },
            signature: { label: 'Signature', type: 'text' },
          },
          /**
           * @async
           * @method authorize
           * Verifies the SIWE signature against the wallet address and domain.
           */
          async authorize(credentials) {
            try {
              const messageString = credentials?.message;
              const signature = credentials?.signature;

              if (!messageString || !signature) return null;

              const siweMessage = new SiweMessage(messageString);

              // 1. Verify the signature, domain, and nonce are valid.
              const result = await siweMessage.verify({
                signature: signature,
                domain: domain,
              });

              if (result.success) {
                // Success: Return user object with address (id) and chainId
                // for storage in the JWT token (critical for client-side security checks).
                return {
                  id: siweMessage.address,
                  chainId: siweMessage.chainId,
                };
              }
              return null;
            } catch (e) {
              console.error('SIWE authorization failed:', e);
              return null;
            }
          },
        }),
      ],

      session: { strategy: 'jwt' as const },
      secret: process.env.NEXTAUTH_SECRET,

      callbacks: {
        /**
         * @method jwt
         * Adds custom properties (chainId) from the user object (returned by authorize) to the JWT token.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, user }: { token: any; user: any }) {
          if (user?.chainId) {
            token.chainId = user.chainId; // Store chainId in the JWT
          }
          return token;
        },
        /**
         * @method session
         * Attaches wallet address (sub) and chainId (token.chainId) to the final session object,
         * making them available to the client via useSession().
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session({ session, token }: { session: any; token: any }) {
          if (token.sub) {
            session.address = token.sub; // Address
          }
          if (token.chainId) {
            session.chainId = token.chainId; // Chain ID
          }
          return session;
        },
      },

      pages: { signIn: '/' },
    };

    // Initialize NextAuth handler
    this.handler = NextAuth(authOptions);
  }

  /**
   * @property handlers
   * @description Exposes GET and POST methods, coerced to the stable App Router signature.
   * This is the recommended export for user's route.ts file.
   * @returns {{ GET: AppRouterHandler, POST: AppRouterHandler }}
   * * @example
   * // In app/api/auth/[...nextauth]/route.ts:
   * // import { siweServer } from '@tuwaio/satellite-siwe-next-auth/server';
   * // export const { GET, POST } = siweServer.handlers;
   */
  public get handlers(): { GET: AppRouterHandler; POST: AppRouterHandler } {
    if (!this.handler) {
      throw new Error('NextAuth handler not initialized.');
    }
    // Coerce handler to the expected App Router type
    return {
      GET: this.handler as AppRouterHandler,
      POST: this.handler as AppRouterHandler,
    };
  }
}

/**
 * @variable siweServer
 * @description The singleton instance of the SiweAuthServer, initialized on import.
 * Provides the official NextAuth API route handler configuration.
 */
export const siweServer = new SiweAuthServer(process.env.NEXTAUTH_URL);
