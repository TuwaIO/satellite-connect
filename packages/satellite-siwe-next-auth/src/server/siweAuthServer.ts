import { getIronSession, IronSession } from 'iron-session';
import { NextRequest, NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';

import { Session, SiweApiConfig, SiweApiHooks } from '../types';
import { getSessionOptions } from './session.config';

// App Router Handler type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppRouterHandler = (req: NextRequest, context: any) => Promise<Response>;

// ------------------------------------
// --- UTILITIES ---
// ------------------------------------

/**
 * @function getDomain
 * @description Extracts the host/domain from SIWE_SESSION_URL for SIWE verification.
 */
function getDomain(url: string | undefined): string {
  if (!url) {
    console.warn("SIWE WARN: SIWE_SESSION_URL is not defined. Defaulting domain check to 'localhost'.");
    return 'localhost';
  }
  try {
    const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsedUrl.host;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(
      `SIWE ERROR: Invalid URL provided in SIWE_SESSION_URL: ${url}. Error: ${typeof e === 'string' ? e : e.message}`,
    );
    return 'localhost';
  }
}

// ------------------------------------
// --- MAIN API FACTORY ---
// ------------------------------------

interface SiweApiRoutes {
  GET: AppRouterHandler;
  POST: AppRouterHandler;
  DELETE: AppRouterHandler;
}

export function createSiweApiHandler(config: SiweApiConfig = {}): SiweApiRoutes {
  const hooks: SiweApiHooks = config.options || {};
  const currentSessionOptions = getSessionOptions(config);

  /**
   * @function getSession
   * @description Retrieves the Iron Session object from the request using the configured options.
   */
  async function getSession(req: NextRequest): Promise<IronSession<Session>> {
    const response = new Response();
    return getIronSession<Session>(req, response, currentSessionOptions);
  }

  // 1. Handles the SIWE login process (POST /login)
  async function handleLogin(req: NextRequest): Promise<Response> {
    try {
      const { message, signature } = await req.json();

      if (!message || !signature) {
        return NextResponse.json({ message: 'Missing message or signature' }, { status: 400 });
      }

      if (hooks.afterNonce) await hooks.afterNonce();

      const siweMessage = new SiweMessage(message);
      // ИСПОЛЬЗУЕМ НОВУЮ ПЕРЕМЕННУЮ ДЛЯ ДОМЕНА
      const domain = getDomain(process.env.SIWE_SESSION_URL);

      const result = await siweMessage.verify({
        signature: signature,
        domain: domain,
      });

      if (!result.success) {
        return NextResponse.json({ message: 'SIWE verification failed' }, { status: 401 });
      }

      if (hooks.afterVerify) await hooks.afterVerify();

      const session = await getSession(req);

      session.address = siweMessage.address;
      session.chainId = siweMessage.chainId;
      session.isLoggedIn = true;

      await session.save();

      if (hooks.afterSession) await hooks.afterSession();

      return NextResponse.json(
        { isLoggedIn: true, address: siweMessage.address, chainId: siweMessage.chainId },
        { status: 200 },
      );
    } catch (error) {
      console.error('SIWE CRITICAL LOGIN ERROR:', error); // Делаем лог более заметным
      return NextResponse.json({ message: 'Internal Server Error during login' }, { status: 500 });
    }
  }

  // 2. Handles session retrieval (GET /session) and logout (POST/DELETE /logout)
  async function handleGetSessionAndLogout(req: NextRequest): Promise<Response> {
    // ... (логика без изменений)
    const session = await getSession(req);

    if (req.method === 'POST' || req.method === 'DELETE') {
      session.destroy();

      if (hooks.afterLogout) await hooks.afterLogout();

      return NextResponse.json({ isLoggedIn: false }, { status: 200 });
    }

    if (session.isLoggedIn && session.address && session.chainId) {
      return NextResponse.json({
        isLoggedIn: true,
        address: session.address,
        chainId: session.chainId,
      });
    }

    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  // --- UNIVERSAL DISPATCHER ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const universalHandler = async (req: NextRequest, context: any): Promise<Response> => {
    const params = (await context.params) || {};
    const pathSegments: string[] = params?.siwe || [];
    const action = pathSegments[pathSegments.length - 1];

    if (action === 'login' && req.method === 'POST') {
      return handleLogin(req);
    }

    if (
      (action === 'session' && req.method === 'GET') ||
      (action === 'logout' && (req.method === 'POST' || req.method === 'DELETE'))
    ) {
      return handleGetSessionAndLogout(req);
    }

    return Promise.resolve(new Response('Not Found', { status: 404 }));
  };

  return {
    GET: universalHandler,
    POST: universalHandler,
    DELETE: universalHandler,
  };
}
