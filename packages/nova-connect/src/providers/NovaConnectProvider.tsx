/**
 * @file Main NovaConnect provider component with comprehensive customization capabilities.
 * @module NovaConnectProvider
 */

import { deepMerge } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { BaseWallet } from '@tuwaio/satellite-core';
import { ComponentType, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import {
  ButtonTxStatus,
  ConnectContentType,
  ConnectedContentType,
  NovaConnectProviderContext,
  NovaConnectProviderProps as BaseNovaConnectProviderProps,
  NovaConnectProviderType,
} from '../hooks/useNovaConnect';
import { defaultLabels } from '../i18n/en';
import { NovaConnectLabels } from '../i18n/types';
import { ErrorsProvider, ErrorsProviderCustomization, ErrorsProviderProps } from './ErrorsProvider';
import { NovaConnectLabelsProvider } from './NovaConnectLabelsProvider';

// --- Customization Types ---

/**
 * Props for custom NovaConnectLabelsProvider component
 */
type CustomLabelsProviderProps = {
  labels?: Partial<NovaConnectLabels>;
  children: ReactNode;
};

/**
 * Props for custom ErrorsProvider component
 */
type CustomErrorsProviderProps = Pick<ErrorsProviderProps, 'store'> & {
  customization?: ErrorsProviderCustomization;
};

/**
 * Context data passed to custom provider components
 */
type ProviderContext = {
  /** Current wallet connection state */
  isConnected: boolean;
  /** Active wallet instance */
  activeWallet: BaseWallet | undefined;
  /** Current wallet connection error */
  walletConnectionError: string | undefined;
  /** All modal and UI states */
  modalStates: {
    isConnectModalOpen: boolean;
    isConnectedModalOpen: boolean;
    isChainsListOpen: boolean;
    isChainsListOpenMobile: boolean;
  };
  /** Current content types for modals */
  contentTypes: {
    connectModal: ConnectContentType;
    connectedModal: ConnectedContentType;
  };
  /** Button and transaction statuses */
  statuses: {
    connectedButton: ButtonTxStatus;
  };
};

/**
 * Comprehensive customization options for NovaConnectProvider
 */
export type NovaConnectProviderCustomization = {
  /** Custom components */
  components?: {
    /** Custom labels provider component */
    LabelsProvider?: ComponentType<CustomLabelsProviderProps>;
    /** Custom errors provider component */
    ErrorsProvider?: ComponentType<CustomErrorsProviderProps>;
  };
  /** Labels customization and merging strategy */
  labels?: {
    /** Custom labels merging function */
    merge?: (defaultLabels: NovaConnectLabels, userLabels: Partial<NovaConnectLabels>) => NovaConnectLabels;
    /** Transform final merged labels before use */
    transform?: (mergedLabels: NovaConnectLabels, context: ProviderContext) => NovaConnectLabels;
  };
  /** ErrorsProvider customization - passed through to ErrorsProvider */
  errors?: ErrorsProviderCustomization;
  /** Custom initialization logic */
  initialization?: {
    /** Custom logic after store subscription setup */
    onStoreSubscribed?: (context: ProviderContext) => void;
    /** Custom logic when connection state changes */
    onConnectionStateChange?: (
      isConnected: boolean,
      activeWallet: BaseWallet | undefined,
      context: ProviderContext,
    ) => void;
    /** Custom logic when error state changes */
    onErrorStateChange?: (error: string | undefined, context: ProviderContext) => void;
  };
  /** Custom context value transformation */
  contextValue?: {
    /** Transform context value before providing to children */
    transform?: (defaultValue: NovaConnectProviderType, context: ProviderContext) => NovaConnectProviderType;
  };
  /** Custom rendering logic */
  rendering?: {
    /** Custom provider tree structure */
    providerTree?: (
      defaultTree: ReactNode,
      components: {
        ErrorsProvider: ReactNode;
        LabelsProvider: ReactNode;
        MainContent: ReactNode;
      },
      context: ProviderContext,
    ) => ReactNode;
  };
};

/**
 * Extended props for NovaConnectProvider with full customization capabilities
 */
export interface NovaConnectProviderProps extends BaseNovaConnectProviderProps {
  /** Comprehensive customization options for the provider and its sub-components */
  customization?: NovaConnectProviderCustomization;
}

// --- Default Components ---

/**
 * Default labels provider component
 */
const DefaultLabelsProvider = ({ labels, children }: CustomLabelsProviderProps) => {
  return <NovaConnectLabelsProvider labels={labels as NovaConnectLabels}>{children}</NovaConnectLabelsProvider>;
};

/**
 * Default errors provider component
 */
const DefaultErrorsProvider = ({ store, customization }: CustomErrorsProviderProps) => {
  return <ErrorsProvider store={store} customization={customization} />;
};

// --- Default Handlers ---

/**
 * Default labels merging function
 */
const defaultLabelsMerge = (
  defaultLabels: NovaConnectLabels,
  userLabels: Partial<NovaConnectLabels>,
): NovaConnectLabels => {
  return deepMerge(defaultLabels, userLabels || {});
};

/**
 * Default labels transform function (identity)
 */
const defaultLabelsTransform = (mergedLabels: NovaConnectLabels): NovaConnectLabels => mergedLabels;

/**
 * Default store subscription handler
 */
const defaultStoreSubscribedHandler = () => {
  // No-op by default
};

/**
 * Default connection state change handler
 */
const defaultConnectionStateChangeHandler = () => {
  // No-op by default
};

/**
 * Default error state change handler
 */
const defaultErrorStateChangeHandler = () => {
  // No-op by default
};

/**
 * Default context value transform function (identity)
 */
const defaultContextValueTransform = (defaultValue: NovaConnectProviderType): NovaConnectProviderType => defaultValue;

/**
 * Default provider tree renderer
 */
const defaultProviderTreeRenderer = (
  defaultTree: ReactNode,
  // Unused but kept for API consistency
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  components: {
    ErrorsProvider: ReactNode;
    LabelsProvider: ReactNode;
    MainContent: ReactNode;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: ProviderContext,
): ReactNode => {
  return defaultTree;
};

/**
 * Main NovaConnect provider component with comprehensive customization capabilities.
 *
 * This provider manages wallet connection state, error handling, internationalization,
 * and modal states while offering extensive customization options for all sub-components
 * and behaviors.
 *
 * Features:
 * - Complete wallet connection state management
 * - Customizable error handling through ErrorsProvider
 * - Flexible internationalization system
 * - Modal and UI state coordination
 * - Extensive customization API for all aspects
 * - Custom component replacement capabilities
 * - Advanced initialization and lifecycle hooks
 *
 * @example Basic usage
 * ```tsx
 * <NovaConnectProvider store={store}>
 *   <App />
 * </NovaConnectProvider>
 * ```
 *
 * @example With customization
 * ```tsx
 * <NovaConnectProvider
 *   store={store}
 *   labels={customLabels}
 *   customization={{
 *     errors: {
 *       position: 'bottom-right',
 *       autoClose: 5000,
 *       components: {
 *         ToastError: CustomToastError
 *       }
 *     },
 *     initialization: {
 *       onConnectionStateChange: (isConnected, wallet) => {
 *         console.log('Connection state:', isConnected, wallet);
 *       }
 *     }
 *   }}
 * >
 *   <App />
 * </NovaConnectProvider>
 * ```
 *
 * @param props - Provider configuration and customization options
 */
export function NovaConnectProvider({ labels, store, children, customization }: NovaConnectProviderProps) {
  // Extract custom components
  const { LabelsProvider = DefaultLabelsProvider, ErrorsProvider: CustomErrorsProvider = DefaultErrorsProvider } =
    customization?.components ?? {};

  // Extract custom handlers
  const { merge: customLabelsMerge = defaultLabelsMerge, transform: customLabelsTransform = defaultLabelsTransform } =
    customization?.labels ?? {};

  const {
    onStoreSubscribed: customStoreSubscribedHandler = defaultStoreSubscribedHandler,
    onConnectionStateChange: customConnectionStateChangeHandler = defaultConnectionStateChangeHandler,
    onErrorStateChange: customErrorStateChangeHandler = defaultErrorStateChangeHandler,
  } = customization?.initialization ?? {};

  const { transform: customContextValueTransform = defaultContextValueTransform } = customization?.contextValue ?? {};

  const { providerTree: customProviderTreeRenderer = defaultProviderTreeRenderer } = customization?.rendering ?? {};

  // Merge labels using custom or default logic
  const mergedLabels = useMemo(() => {
    return customLabelsMerge(defaultLabels, labels || {});
  }, [labels, customLabelsMerge]);

  // State management - all existing state
  const [activeWallet, setActiveWallet] = useState<BaseWallet | undefined>(store.getState().activeWallet);
  const [walletConnectionError, setWalletConnectionError] = useState<string | undefined>(
    store.getState().walletConnectionError,
  );
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isConnectedModalOpen, setIsConnectedModalOpen] = useState(false);
  const [isChainsListOpen, setIsChainsListOpen] = useState(false);
  const [isChainsListOpenMobile, setIsChainsListOpenMobile] = useState(false);
  const [connectedButtonStatus, setConnectedButtonStatus] = useState<ButtonTxStatus>('idle');
  const [connectModalContentType, setConnectModalContentType] = useState<ConnectContentType>('connectors');
  const [selectedAdapter, setSelectedAdapter] = useState<OrbitAdapter | undefined>(undefined);
  const [activeConnector, setActiveConnector] = useState<string | undefined>(undefined);
  const [impersonatedAddress, setImpersonatedAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectedModalContentType, setConnectedModalContentType] = useState<ConnectedContentType>('main');

  // Create provider context for custom handlers
  const providerContext = useMemo(
    (): ProviderContext => ({
      isConnected,
      activeWallet,
      walletConnectionError,
      modalStates: {
        isConnectModalOpen,
        isConnectedModalOpen,
        isChainsListOpen,
        isChainsListOpenMobile,
      },
      contentTypes: {
        connectModal: connectModalContentType,
        connectedModal: connectedModalContentType,
      },
      statuses: {
        connectedButton: connectedButtonStatus,
      },
    }),
    [
      isConnected,
      activeWallet,
      walletConnectionError,
      isConnectModalOpen,
      isConnectedModalOpen,
      isChainsListOpen,
      isChainsListOpenMobile,
      connectModalContentType,
      connectedModalContentType,
      connectedButtonStatus,
    ],
  );

  // Transform labels using custom logic if provided
  const finalLabels = useMemo(() => {
    return customLabelsTransform(mergedLabels, providerContext);
  }, [mergedLabels, customLabelsTransform, providerContext]);

  // Handle connection state changes
  const handleConnectionStateChange = useCallback(
    (newIsConnected: boolean, newActiveWallet: BaseWallet | undefined) => {
      customConnectionStateChangeHandler(newIsConnected, newActiveWallet, providerContext);
    },
    [customConnectionStateChangeHandler, providerContext],
  );

  // Handle error state changes
  const handleErrorStateChange = useCallback(
    (newError: string | undefined) => {
      customErrorStateChangeHandler(newError, providerContext);
    },
    [customErrorStateChangeHandler, providerContext],
  );

  // Store subscription effect
  useEffect(() => {
    if (!store) return undefined;
    const unsubscribe = store.subscribe((state) => {
      const newActiveWallet = state.activeWallet;
      const newError = state.walletConnectionError;
      const newIsConnected = Boolean(newActiveWallet?.isConnected);
      // Update state
      setActiveWallet(newActiveWallet);
      setWalletConnectionError(newError);
      // Handle state changes
      if (newIsConnected !== isConnected || newActiveWallet !== activeWallet) {
        handleConnectionStateChange(newIsConnected, newActiveWallet);
      }
      if (newError !== walletConnectionError) {
        handleErrorStateChange(newError);
      }
    });

    // Custom initialization logic
    customStoreSubscribedHandler(providerContext);

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  // Create and transform context value using custom logic if provided - moved inside useMemo
  const contextValue = useMemo(() => {
    const defaultContextValue: NovaConnectProviderType = {
      walletConnectionError,
      activeWallet,
      isConnectModalOpen,
      setIsConnectModalOpen,
      isConnectedModalOpen,
      setIsConnectedModalOpen,
      isChainsListOpen,
      setIsChainsListOpen,
      isChainsListOpenMobile,
      setIsChainsListOpenMobile,
      connectedButtonStatus,
      setConnectedButtonStatus,
      connectedModalContentType,
      setConnectedModalContentType,
      connectModalContentType,
      setConnectModalContentType,
      selectedAdapter,
      setSelectedAdapter,
      activeConnector,
      setActiveConnector,
      impersonatedAddress,
      setImpersonatedAddress,
      isConnected,
      setIsConnected,
    };

    return customContextValueTransform(defaultContextValue, providerContext);
  }, [
    walletConnectionError,
    activeWallet,
    isConnectModalOpen,
    setIsConnectModalOpen,
    isConnectedModalOpen,
    setIsConnectedModalOpen,
    isChainsListOpen,
    setIsChainsListOpen,
    isChainsListOpenMobile,
    setIsChainsListOpenMobile,
    connectedButtonStatus,
    setConnectedButtonStatus,
    connectedModalContentType,
    setConnectedModalContentType,
    connectModalContentType,
    setConnectModalContentType,
    selectedAdapter,
    setSelectedAdapter,
    activeConnector,
    setActiveConnector,
    impersonatedAddress,
    setImpersonatedAddress,
    isConnected,
    setIsConnected,
    customContextValueTransform,
    providerContext,
  ]);

  // Create component tree elements
  const errorsProviderElement = <CustomErrorsProvider store={store} customization={customization?.errors} />;

  const labelsProviderElement = <LabelsProvider labels={finalLabels}>{children}</LabelsProvider>;

  const mainContentElement = (
    <NovaConnectProviderContext.Provider value={contextValue}>
      {errorsProviderElement}
      {labelsProviderElement}
    </NovaConnectProviderContext.Provider>
  );

  // Create default provider tree
  const defaultProviderTree = (
    <NovaConnectProviderContext.Provider value={contextValue}>
      {errorsProviderElement}
      {labelsProviderElement}
    </NovaConnectProviderContext.Provider>
  );

  // Use custom provider tree renderer if provided
  const finalProviderTree = customProviderTreeRenderer(
    defaultProviderTree,
    {
      ErrorsProvider: errorsProviderElement,
      LabelsProvider: labelsProviderElement,
      MainContent: mainContentElement,
    },
    providerContext,
  );

  return <>{finalProviderTree}</>;
}

// Add display name for better debugging
NovaConnectProvider.displayName = 'NovaConnectProvider';
