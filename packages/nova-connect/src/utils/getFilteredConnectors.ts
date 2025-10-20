import { OrbitAdapter } from '@tuwaio/orbit-core';

import { Connector } from '../types';
import { getGroupedConnectors, GroupedConnector } from './getGroupedConnectors';

interface GetFilteredConnectorsParams {
  connectors: Partial<Record<OrbitAdapter, Connector[]>>;
  selectedAdapter?: OrbitAdapter;
}

/**
 * Type for connector with adapter information
 */
type ConnectorWithAdapter = Connector & { adapter: OrbitAdapter };

/**
 * Helper function to safely access connector adapter property
 * Uses any type to avoid TypeScript inference issues with complex types
 */
function getConnectorAdapter(connector: any): OrbitAdapter | undefined {
  // Safe property access without type guards
  try {
    if (connector && typeof connector === 'object' && connector.adapter) {
      return connector.adapter as OrbitAdapter;
    }
  } catch {
    // Silently handle any errors in property access
  }
  return undefined;
}

/**
 * Helper function to check if connector matches the selected adapter
 */
function connectorMatchesAdapter(connector: any, selectedAdapter: OrbitAdapter): boolean {
  const connectorAdapter = getConnectorAdapter(connector);
  return connectorAdapter === selectedAdapter;
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
        group.connectors.some((connector) => connectorMatchesAdapter(connector, selectedAdapter))
      );
    })
    .map((group) => {
      // Create new group with filtered connectors
      const filteredConnectors = group.connectors.filter((connector) =>
        connectorMatchesAdapter(connector, selectedAdapter),
      );

      return {
        ...group,
        // Narrow down to only the selected adapter
        adapters: [selectedAdapter],
        // Cast to proper type since we know these connectors have the adapter property
        connectors: filteredConnectors as ConnectorWithAdapter[],
      };
    })
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
