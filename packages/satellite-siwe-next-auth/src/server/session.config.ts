import { SessionOptions } from 'iron-session';

import { SiweApiConfig, SiweCookieOptions } from '../types';

/**
 * @function getSessionOptions
 * @description Generates the Iron Session options object based on user configuration.
 * @param userConfig - The complete user configuration including session settings.
 * @returns SessionOptions The options required by `getIronSession`.
 */
export function getSessionOptions(userConfig: SiweApiConfig): SessionOptions {
  const sessionSettings = userConfig.session || {};

  const defaultPassword = process.env.SIWE_SESSION_SECRET;
  const finalPassword = sessionSettings.password || defaultPassword;

  if (!finalPassword || finalPassword.length < 32) {
    throw new Error(
      "SIWE Error: Iron Session requires a 'password' option (min 32 chars) or SIWE_SESSION_SECRET environment variable to be set.",
    );
  }

  // Determine cookie options
  const defaultCookieOptions: SiweCookieOptions = {
    // secure: true if NODE_ENV is production, as requested.
    secure: process.env.NODE_ENV === 'production',
    maxAge: 300 * 60, // 5 hours default
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  };

  // Merge default options with user provided options
  const finalCookieOptions: SiweCookieOptions = {
    ...defaultCookieOptions,
    ...sessionSettings.cookieOptions,
  };

  return {
    password: finalPassword as string,
    cookieName: sessionSettings.cookieName || 'satellite_siwe',
    cookieOptions: finalCookieOptions,
  } as SessionOptions;
}
