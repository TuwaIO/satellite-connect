/**
 * Configuration options for Safe SDK
 * @remarks
 * Defines allowed domains and debug mode for Safe integration
 */
export const safeSdkOptions = {
  /** Regular expressions for allowed Safe wallet domains */
  allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/, /metissafe.tech$/],
  /** Enable debug mode */
  debug: false,
};


