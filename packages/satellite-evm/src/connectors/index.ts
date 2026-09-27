/**
 * Options for the wagmi `safe` connector: `safe({ ...safeSdkOptions })`. They are passed to the Safe Apps SDK, which
 * accepts messages only from a parent window whose origin matches one of `allowedDomains`.
 */
export const safeSdkOptions = {
  /**
   * Origins of the Safe{Wallet} apps allowed to host the dApp: `https://app.safe.global`, `https://gnosis-safe.io` and
   * `https://metissafe.tech`, including their subdomains. The patterns are anchored, so look-alike domains such as
   * `https://app-safe.global` are rejected.
   */
  allowedDomains: [
    /^https:\/\/([a-z0-9-]+\.)*gnosis-safe\.io$/,
    /^https:\/\/([a-z0-9-]+\.)*app\.safe\.global$/,
    /^https:\/\/([a-z0-9-]+\.)*metissafe\.tech$/,
  ],
  /** Debug logging of the Safe Apps SDK. */
  debug: false,
};

export * from './ImpersonatedConnector';
