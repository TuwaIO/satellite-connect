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
 * within the `LabelsProvider` tree.
 *
 * @returns {NovaConnectLabels} The complete object of UI labels.
 *
 * @example
 * const MyComponent = () => {
 * const labels = useLabels();
 * return <h1>{labels.walletModal.title}</h1>;
 * }
 */
export const useNovaConnectLabels = (): NovaConnectLabels => {
  return useContext(NovaConnectLabelsContext);
};
