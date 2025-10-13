import { OrbitAdapter } from '@tuwaio/orbit-core';
import { Connector } from '@tuwaio/satellite-react';

import { getGroupedConnectors, GroupedConnector } from './getGroupedConnectors';

export function getFilteredConnectors({
  connectors,
  selectedAdapter,
}: {
  connectors: Partial<Record<OrbitAdapter, Connector[]>>;
  selectedAdapter: OrbitAdapter | undefined;
}): GroupedConnector[] {
  const groupedConnectors = getGroupedConnectors({ connectors });

  if (!selectedAdapter) {
    return groupedConnectors;
  }

  return groupedConnectors
    .filter((group) => group.adapters.includes(selectedAdapter))
    .map((group) => ({
      ...group,
      adapters: [selectedAdapter], // Show only selected adapter
      connectors: group.connectors.filter((c) => c.adapter === selectedAdapter),
    }));
}
