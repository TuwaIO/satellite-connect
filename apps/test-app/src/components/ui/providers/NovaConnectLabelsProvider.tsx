/**
 * @file This file sets up the React Context for providing i18n labels throughout the UI components.
 * It allows for deep customization of all text displayed by the library.
 */

import { createContext, ReactNode, useContext } from 'react';

import { defaultLabels } from '../i18n/en';
import { NovaConnectLabels } from '../i18n/types';

/**
 * React Context for storing and providing the UI labels.
 * It is initialized with the default English labels, ensuring that components
 * work even without an explicit provider.
 */
const NovaConnectLabelsContext = createContext<NovaConnectLabels>(defaultLabels);

/**
 * A React component that provides a custom set of labels to all child components.
 * Wrap your application or component tree with this provider to apply custom translations.
 *
 * @param {object} props - The component props.
 * @param {NovaConnectLabels} props.labels - An object containing the custom labels.
 * @param {ReactNode} props.children - The child components to render.
 */
export const NovaConnectLabelsProvider = ({ labels, children }: { labels: NovaConnectLabels; children: ReactNode }) => {
  return <NovaConnectLabelsContext.Provider value={labels}>{children}</NovaConnectLabelsContext.Provider>;
};

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
