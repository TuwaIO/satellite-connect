/**
 * Type definitions for NovaConnect component translations
 * Contains all text strings for multi-language support
 */
export type NovaConnectLabels = {
  // Core actions - Primary user interactions
  connectWallet: string;
  disconnect: string;
  connecting: string;
  connected: string;
  tryAgain: string;
  back: string;
  connect: string;
  close: string;
  all: string;

  // Connection states - Status messages for wallet connection flow
  connectionError: string;
  connectedSuccessfully: string;
  connectingTo: string;
  walletConnectionError: string;
  errorWhenChainSwitching: string;
  cannotConnectWallet: string;

  // Transaction states - Status indicators for blockchain transactions
  success: string;
  error: string;
  replaced: string;
  recent: string;
  transactionLoading: string;
  transactionSuccess: string;
  transactionError: string;
  transactionReplaced: string;

  // Modal titles - Headers for different modal dialogs
  aboutWallets: string;
  getWallet: string;
  connectImpersonatedWallet: string;
  transactionsInApp: string;
  switchNetwork: string;
  switchNetworks: string;
  connectingEllipsis: string;

  // Wallet sections - Categories for wallet connector grouping
  installed: string;
  popular: string;
  impersonate: string;
  readOnlyMode: string;

  // Information and descriptions - Educational content and explanations
  whatIsWallet: string;
  walletDescription: string;
  whatIsNetwork: string;
  networkDescription: string;
  learnMore: string;
  listOfNetworks: string;
  viewOnExplorer: string;
  viewTransactions: string;

  // Impersonation form - Labels for wallet address impersonation feature
  enterWalletAddress: string;
  walletAddressPlaceholder: string;

  // Error messages - User-facing error notifications and descriptions
  noConnectorsFound: string;
  noConnectorsDescription: string;
  somethingWentWrong: string;
  networkPickingError: string;
  pulsarAdapterRequired: string;
  pulsarAdapterDescription: string;
  selectAvailableNetwork: string;

  // Get Wallet section - Onboarding content for new users without wallets
  startExploringWeb3: string;
  walletKeyToDigitalWorld: string;
  iDontHaveWallet: string;
  choseWallet: string;

  // About Wallets slides - Educational carousel content explaining wallet benefits
  keyToNewInternet: string;
  keyToNewInternetDescription: string;
  logInWithoutHassle: string;
  logInWithoutHassleDescription: string;

  // Copy functionality and UI feedback - Clipboard operations and user feedback
  copyRawError: string;
  copied: string;

  // Accessibility labels - Screen reader and ARIA labels for better accessibility
  chainSelector: string;
  closeModal: string;
  selectChain: string;
  chainOption: string;
  openChainSelector: string;
  currentChain: string;
  scrollToTop: string;
  scrollToBottom: string;
  chainListContainer: string;
  walletControls: string;
  openWalletModal: string;
  walletConnected: string;
  walletNotConnected: string;
  walletBalance: string;
  walletAddress: string;
  transactionStatus: string;
  successIcon: string;
  errorIcon: string;
  replacedIcon: string;
  statusIcon: string;

  // Additional states - Supplementary status indicators
  loading: string;
  idle: string;

  // Wallet Avatar labels
  unknownWallet: string;
  walletAvatar: string;
  ensAvatar: string;
  walletIcon: string;

  // Impersonate errors
  impersonateAddressEmpty: string;
  impersonateAddressNotCorrect: string;
  impersonateAddressConnected: string;
};
