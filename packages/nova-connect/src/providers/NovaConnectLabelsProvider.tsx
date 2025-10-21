/**
 * @file This file sets up the React Context for providing i18n labels throughout the UI components.
 * It allows for deep customization of all text displayed by the library.
 */

import { ReactNode, useMemo } from 'react';

import { NovaConnectLabelsContext } from '../hooks/useNovaConnectLabels';
import { NovaConnectLabels } from '../i18n/types';

interface NovaConnectLabelsProviderProps {
  /** An object containing the custom labels */
  labels: NovaConnectLabels;
  /** The child components to render */
  children: ReactNode;
}

/**
 * A React component that provides a custom set of labels to all child components.
 * Wrap your application or component tree with this provider to apply custom translations.
 *
 * The provider uses React.memo optimization and validates labels in development mode.
 *
 * @example
 * ```typescript
 * import { NovaConnectLabelsProvider } from './NovaConnectLabelsProvider';
 *
 * function App() {
 *   const customLabels = {
 *     connectWallet: 'Подключить кошелек',
 *     disconnect: 'Отключиться',
 *   };
 *
 *   return (
 *     <NovaConnectLabelsProvider labels={customLabels}>
 *       <YourApp />
 *     </NovaConnectLabelsProvider>
 *   );
 * }
 * ```
 */
export function NovaConnectLabelsProvider({ labels, children }: NovaConnectLabelsProviderProps) {
  // Memoize labels to prevent unnecessary re-renders
  const memoizedLabels = useMemo(() => labels, [labels]);

  // Development-only validation
  if (process.env.NODE_ENV === 'development') {
    // Validate that labels object is provided
    if (!labels || typeof labels !== 'object') {
      console.warn('NovaConnectLabelsProvider: labels prop should be an object');
    }

    // Check for missing required labels (basic validation)
    const requiredLabels = ['connectWallet', 'disconnect', 'connecting', 'connected', 'error', 'success'] as const;

    const missingLabels = requiredLabels.filter((key) => !(key in labels));
    if (missingLabels.length > 0) {
      console.warn(`NovaConnectLabelsProvider: Missing required labels: ${missingLabels.join(', ')}`);
    }
  }

  return <NovaConnectLabelsContext.Provider value={memoizedLabels}>{children}</NovaConnectLabelsContext.Provider>;
}

// Add display name for better debugging
NovaConnectLabelsProvider.displayName = 'NovaConnectLabelsProvider';
