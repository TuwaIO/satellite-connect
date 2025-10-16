import { OrbitAdapter } from '@tuwaio/orbit-core';
import { Connector } from '@tuwaio/satellite-react';

import { getGroupedConnectors, GroupedConnector } from './getGroupedConnectors';

interface GetFilteredConnectorsParams {
  connectors: Partial<Record<OrbitAdapter, Connector[]>>;
  selectedAdapter?: OrbitAdapter;
}

/**
 * Filters grouped connectors by the selected adapter.
 * Returns all connectors if no adapter is selected, or only connectors
 * that support the specified adapter if one is provided.
 *
 * @param params Configuration object with connectors and optional adapter filter
 * @returns Filtered array of grouped connectors
 */
export function getFilteredConnectors({
  connectors,
  selectedAdapter,
}: GetFilteredConnectorsParams): GroupedConnector[] {
  // Input validation
  if (!connectors || Object.keys(connectors).length === 0) {
    return [];
  }

  const groupedConnectors = getGroupedConnectors({ connectors });

  // Return all connectors if no filter is applied
  if (!selectedAdapter) {
    return groupedConnectors;
  }

  // Filter and transform connector groups
  return groupedConnectors
    .filter((group) => {
      // Only include groups that support the selected adapter
      return (
        group.adapters.includes(selectedAdapter) &&
        group.connectors.some((connector) => connector.adapter === selectedAdapter)
      );
    })
    .map((group) => ({
      ...group,
      // Narrow down to only the selected adapter
      adapters: [selectedAdapter],
      // Filter connectors to only those matching the adapter
      connectors: group.connectors.filter((connector) => connector.adapter === selectedAdapter),
    }))
    .filter((group) => group.connectors.length > 0); // Remove empty groups
}

/**
 * Quick helper to check if any connectors exist for an adapter
 */
export function hasConnectorsForAdapter(
  connectors: Partial<Record<OrbitAdapter, Connector[]>>,
  adapter: OrbitAdapter,
): boolean {
  const adapterConnectors = connectors[adapter];
  return Array.isArray(adapterConnectors) && adapterConnectors.length > 0;
}
