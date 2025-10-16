import { formatWalletName, OrbitAdapter } from '@tuwaio/orbit-core';
import { Connector } from '@tuwaio/satellite-react';

export interface GroupedConnector {
  name: string;
  icon?: string;
  adapters: OrbitAdapter[];
  connectors: (Connector & { adapter: OrbitAdapter })[];
}

interface GetGroupedConnectorsParams {
  connectors: Partial<Record<OrbitAdapter, Connector[]>>;
  excludeConnectors?: string[];
}

/**
 * Groups wallet connectors by their formatted names across different adapters.
 * Filters out specified excluded connectors (like 'injected' wallets).
 */
export function getGroupedConnectors(
  { connectors, excludeConnectors = ['injected'] }: GetGroupedConnectorsParams = { connectors: {} },
): GroupedConnector[] {
  // Input validation
  if (!connectors || Object.keys(connectors).length === 0) {
    return [];
  }

  // Create exclusion set for efficient lookup
  const excludeSet = new Set(excludeConnectors.map((name) => formatWalletName(name)));

  // Flatten and filter connectors
  const allConnectors: (Connector & { adapter: OrbitAdapter })[] = [];

  Object.entries(connectors).forEach(([adapter, adapterConnectors]) => {
    if (Array.isArray(adapterConnectors)) {
      adapterConnectors.forEach((connector) => {
        if (connector?.name) {
          const formattedName = formatWalletName(connector.name);
          if (!excludeSet.has(formattedName)) {
            allConnectors.push({ ...connector, adapter: adapter as OrbitAdapter });
          }
        }
      });
    }
  });

  // Group by formatted wallet name using Map for better performance
  const groupedMap = new Map<string, GroupedConnector>();

  allConnectors.forEach((connector) => {
    const formattedName = formatWalletName(connector.name);

    if (!groupedMap.has(formattedName)) {
      groupedMap.set(formattedName, {
        name: connector.name,
        icon: connector.icon,
        adapters: [],
        connectors: [],
      });
    }

    const group = groupedMap.get(formattedName)!;

    // Add unique adapter
    if (!group.adapters.includes(connector.adapter)) {
      group.adapters.push(connector.adapter);
    }

    // Add connector
    group.connectors.push(connector);

    // Update icon if not set
    if (!group.icon && connector.icon) {
      group.icon = connector.icon;
    }
  });

  // Return sorted array for consistent ordering
  return Array.from(groupedMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  );
}

/**
 * Quick helper to check if connectors are available
 */
export function hasAvailableConnectors(connectors: Partial<Record<OrbitAdapter, Connector[]>>): boolean {
  return Object.values(connectors).some(
    (adapterConnectors) => Array.isArray(adapterConnectors) && adapterConnectors.length > 0,
  );
}
