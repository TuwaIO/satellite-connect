import { createContext, useContext } from 'react';

import { defaultLabels } from '../i18n/en';
import { NovaConnectLabels } from '../i18n/types';

/**
 * React Context for storing and providing the UI labels.
 * It is initialized with the default English labels, ensuring that components
 * work even without an explicit provider.
 */
export const NovaConnectLabelsContext = createContext<NovaConnectLabels>(defaultLabels);

/**
 * A custom hook to easily access the i18n labels from any component
 * within the `NovaConnectLabelsProvider` tree.
 *
 * This hook provides type-safe access to all UI labels and automatically
 * falls back to default English labels if no provider is found.
 *
 * @returns {NovaConnectLabels} The complete object of UI labels for the current locale.
 *
 * @example
 * ```typescript
 * import { useNovaConnectLabels } from './hooks/useNovaConnectLabels';
 *
 * function MyComponent() {
 *   const labels = useNovaConnectLabels();
 *
 *   return (
 *     <div>
 *       <h1>{labels.connectWallet}</h1>
 *       <button>{labels.connect}</button>
 *       <p aria-label={labels.walletBalance}>{formattedBalance}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Destructuring specific labels for better performance
 * function ConnectButton() {
 *   const { connectWallet, connecting, connected } = useNovaConnectLabels();
 *
 *   return (
 *     <button>
 *       {isConnecting ? connecting : isConnected ? connected : connectWallet}
 *     </button>
 *   );
 * }
 * ```
 */
export const useNovaConnectLabels = (): NovaConnectLabels => {
  return useContext(NovaConnectLabelsContext);
};

/**
 * Hook to get a specific label by key path with type safety
 *
 * @param key The label key to retrieve
 * @returns The specific label value
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const connectLabel = useNovaConnectLabel('connectWallet');
 *   const errorLabel = useNovaConnectLabel('connectionError');
 *
 *   return <button>{connectLabel}</button>;
 * }
 * ```
 */
export const useNovaConnectLabel = <K extends keyof NovaConnectLabels>(key: K): NovaConnectLabels[K] => {
  const labels = useNovaConnectLabels();
  return labels[key];
};

/**
 * Hook to get multiple specific labels for better performance
 *
 * @param keys Array of label keys to retrieve
 * @returns Object with only the requested labels
 *
 * @example
 * ```typescript
 * function ConnectModal() {
 *   const { connectWallet, connecting, disconnect } = useNovaConnectLabelsSubset(['connectWallet', 'connecting', 'disconnect']);
 *
 *   return (
 *     <div>
 *       <h2>{connectWallet}</h2>
 *       <span>{connecting}</span>
 *       <button>{disconnect}</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useNovaConnectLabelsSubset = <K extends keyof NovaConnectLabels>(
  keys: K[],
): Pick<NovaConnectLabels, K> => {
  const allLabels = useNovaConnectLabels();

  const subset = {} as Pick<NovaConnectLabels, K>;
  for (const key of keys) {
    subset[key] = allLabels[key];
  }

  return subset;
};

/**
 * Type-safe helper to check if a label exists
 *
 * @param labels The labels object
 * @param key The key to check
 * @returns Whether the key exists and has a non-empty value
 */
export const hasLabel = (labels: NovaConnectLabels, key: keyof NovaConnectLabels): boolean => {
  return Boolean(labels[key]?.trim());
};

/**
 * Utility type for extracting label keys by category
 */
export type LabelCategory = {
  actions: Extract<
    keyof NovaConnectLabels,
    'connectWallet' | 'disconnect' | 'connecting' | 'connected' | 'tryAgain' | 'back' | 'connect' | 'close'
  >;
  states: Extract<keyof NovaConnectLabels, 'success' | 'error' | 'replaced' | 'loading' | 'idle'>;
  accessibility: Extract<
    keyof NovaConnectLabels,
    'chainSelector' | 'closeModal' | 'selectChain' | 'walletControls' | 'openWalletModal'
  >;
  transactions: Extract<
    keyof NovaConnectLabels,
    'transactionLoading' | 'transactionSuccess' | 'transactionError' | 'transactionReplaced' | 'recent'
  >;
};

/**
 * Hook to get labels by category for better organization
 *
 * @param category The category of labels to retrieve
 * @returns Object with labels from the specified category
 */
export const useLabelsByCategory = <T extends keyof LabelCategory>(
  category: T,
): Pick<NovaConnectLabels, LabelCategory[T]> => {
  const allLabels = useNovaConnectLabels();

  const categoryKeys: Record<keyof LabelCategory, (keyof NovaConnectLabels)[]> = {
    actions: ['connectWallet', 'disconnect', 'connecting', 'connected', 'tryAgain', 'back', 'connect', 'close'],
    states: ['success', 'error', 'replaced', 'loading', 'idle'],
    accessibility: ['chainSelector', 'closeModal', 'selectChain', 'walletControls', 'openWalletModal'],
    transactions: ['transactionLoading', 'transactionSuccess', 'transactionError', 'transactionReplaced', 'recent'],
  };

  const keys = categoryKeys[category] as LabelCategory[T][];
  const categoryLabels = {} as Pick<NovaConnectLabels, LabelCategory[T]>;

  for (const key of keys) {
    // eslint-disable-next-line
    (categoryLabels as any)[key] = allLabels[key as keyof NovaConnectLabels];
  }

  return categoryLabels;
};

/**
 * Utility function to check if labels are default ones (for external use)
 * This is a regular function, not a hook, so it can be used anywhere
 *
 * @param labels The labels to check
 * @returns Whether the labels are the default English labels
 *
 * @example
 * ```typescript
 * function SomeUtilityFunction(labels: NovaConnectLabels) {
 *   if (isDefaultLabels(labels)) {
 *     console.log('Using default English labels');
 *   }
 * }
 * ```
 */
export const isDefaultLabels = (labels: NovaConnectLabels): boolean => {
  return labels === defaultLabels;
};

/**
 * Utility function to get a formatted label with fallback
 *
 * @param labels The labels object
 * @param key The label key
 * @param fallback Optional fallback text
 * @returns The label value or fallback
 *
 * @example
 * ```typescript
 * const buttonText = getLabelWithFallback(labels, 'connectWallet', 'Connect');
 * ```
 */
export const getLabelWithFallback = (
  labels: NovaConnectLabels,
  key: keyof NovaConnectLabels,
  fallback?: string,
): string => {
  const value = labels[key];
  if (value && value.trim()) {
    return value;
  }
  return fallback || defaultLabels[key] || key.toString();
};

/**
 * Utility function to create a labels subset (for use outside of React components)
 *
 * @param labels The source labels object
 * @param keys Array of keys to extract
 * @returns Object with only the requested labels
 *
 * @example
 * ```typescript
 * const actionLabels = createLabelsSubset(labels, ['connect', 'disconnect', 'tryAgain']);
 * ```
 */
export const createLabelsSubset = <K extends keyof NovaConnectLabels>(
  labels: NovaConnectLabels,
  keys: K[],
): Pick<NovaConnectLabels, K> => {
  const subset = {} as Pick<NovaConnectLabels, K>;
  for (const key of keys) {
    subset[key] = labels[key];
  }
  return subset;
};
