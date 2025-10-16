import { NovaConnectLabels } from './types';

/**
 * Default English translations for NovaConnect component
 * All text strings extracted from component files
 */
export const defaultLabels: NovaConnectLabels = {
  // Core actions - Primary user interactions
  connectWallet: 'Connect Wallet',
  disconnect: 'Disconnect',
  connecting: 'Connecting...',
  connected: 'Connected',
  tryAgain: 'Try again',
  back: 'Back',
  connect: 'Connect',
  close: 'Close',
  all: 'All',

  // Connection states - Status messages for wallet connection flow
  connectionError: 'Connection error',
  connectedSuccessfully: 'Connected successfully!',
  connectingTo: 'Connecting to',
  walletConnectionError: 'Wallet connection error',
  errorWhenChainSwitching: 'Error when chain switching',
  cannotConnectWallet: 'Cannot connect to the wallet. Please try again or use another connector.',

  // Transaction states - Status indicators for blockchain transactions
  success: 'Success',
  error: 'Error',
  replaced: 'Replaced',
  recent: 'Recent',
  transactionLoading: 'Transaction loading',
  transactionSuccess: 'Transaction successful',
  transactionError: 'Transaction failed',
  transactionReplaced: 'Transaction replaced',

  // Modal titles - Headers for different modal dialogs
  aboutWallets: 'About wallets',
  getWallet: 'Get a wallet',
  connectImpersonatedWallet: 'Connect impersonated wallet',
  transactionsInApp: 'Transactions in app',
  switchNetwork: 'Switch network',
  switchNetworks: 'Switch Networks',
  connectingEllipsis: 'Connecting...',

  // Wallet sections - Categories for wallet connector grouping
  installed: 'Installed',
  popular: 'Popular',
  impersonate: 'Impersonate',
  readOnlyMode: 'Read-only mode',

  // Information and descriptions - Educational content and explanations
  whatIsWallet: 'What is a wallet?',
  walletDescription:
    'Wallets are essential for managing your crypto—they let you send, receive, and securely hold digital assets. Connecting your wallet grants you safe access and interaction with decentralized applications (dApps).',
  whatIsNetwork: 'What is a network?',
  networkDescription:
    'A network (or blockchain) is a decentralized digital ledger that records transactions. Selecting a network lets you choose which blockchain you want to connect to.',
  learnMore: 'Learn more',
  listOfNetworks: 'List of networks',
  viewOnExplorer: 'View on explorer',
  viewTransactions: 'View transactions',

  // Impersonation form - Labels for wallet address impersonation feature
  enterWalletAddress: 'Enter wallet address to impersonate',
  walletAddressPlaceholder: '0x...',

  // Error messages - User-facing error notifications and descriptions
  noConnectorsFound: 'No Connectors Found',
  noConnectorsDescription: "We couldn't find any wallets or connection methods for the selected network.",
  somethingWentWrong: 'Something went wrong',
  networkPickingError: 'Something went wrong with wallet network selection. Please go back and try again.',
  pulsarAdapterRequired: 'Pulsar Adapter Required',
  pulsarAdapterDescription:
    'Additional configuration is needed for viewing transactions in app. Please contact your admin.',
  selectAvailableNetwork: 'Select one of available network',

  // Get Wallet section - Onboarding content for new users without wallets
  startExploringWeb3: 'Start Exploring Web3',
  walletKeyToDigitalWorld:
    'Your wallet is the key to the digital world and the technology that makes exploring web3 possible.',
  iDontHaveWallet: "I don't have a wallet",
  choseWallet: 'Choose a wallet',

  // About Wallets slides - Educational carousel content explaining wallet benefits
  keyToNewInternet: 'The Key to a New Internet',
  keyToNewInternetDescription:
    'Your wallet is more than just storage. Think of it as your digital passport that lets you truly own, display, and exchange every digital asset you hold, from crypto tokens to unique NFTs.',
  logInWithoutHassle: 'Log In Without the Hassle',
  logInWithoutHassleDescription:
    'Skip the endless sign-up forms! Your wallet is your unique access pass. Just connect it, and the website instantly recognizes you. It saves you time and protects your privacy.',

  // Copy functionality and UI feedback - Clipboard operations and user feedback
  copyRawError: 'Copy raw error',
  copied: 'Copied!',

  // Accessibility labels - Screen reader and ARIA labels for better accessibility
  chainSelector: 'Chain Selector',
  closeModal: 'Close modal',
  selectChain: 'Select chain',
  chainOption: 'Chain option',
  openChainSelector: 'Open chain selector',
  currentChain: 'Current chain',
  scrollToTop: 'Scroll to top',
  scrollToBottom: 'Scroll to bottom',
  chainListContainer: 'Chain list container',
  walletControls: 'Wallet controls',
  openWalletModal: 'Open wallet modal',
  walletConnected: 'Wallet connected',
  walletNotConnected: 'Wallet not connected',
  walletBalance: 'Wallet balance',
  walletAddress: 'Wallet address',
  transactionStatus: 'Transaction status',
  successIcon: 'Success icon',
  errorIcon: 'Error icon',
  replacedIcon: 'Replaced icon',
  statusIcon: 'Status icon',

  // Additional states - Supplementary status indicators
  loading: 'Loading',
  idle: 'Idle',

  // Wallet Avatar labels
  unknownWallet: 'Unknown wallet',
  walletAvatar: 'Wallet avatar',
  ensAvatar: 'ENS avatar',
  walletIcon: 'Wallet icon',

  // Impersonate errors
  impersonateAddressEmpty: 'Enter a wallet address to impersonate.',
  impersonateAddressNotCorrect: 'Entered wallet address is not correct. Please try again.',
  impersonateAddressConnected: 'First disconnect the wallet to impersonate another address.',
};
