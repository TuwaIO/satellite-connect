/**
 * @file This file sets up the React Context for providing i18n labels throughout the UI components.
 * It allows for deep customization of all text displayed by the library.
 */

import { ReactNode } from 'react';

import { NovaConnectLabelsContext } from '../hooks/useNovaConnectLabels';
import { NovaConnectLabels } from '../i18n/types';

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
