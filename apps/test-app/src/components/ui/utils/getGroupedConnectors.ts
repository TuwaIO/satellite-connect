import { formatWalletName, OrbitAdapter } from '@tuwaio/orbit-core';
import { Connector } from '@tuwaio/satellite-react';

export interface GroupedConnector {
  name: string;
  icon?: string;
  adapters: OrbitAdapter[];
  connectors: (Connector & { adapter: OrbitAdapter })[];
}

export function getGroupedConnectors({
  connectors,
}: {
  connectors: Partial<Record<OrbitAdapter, Connector[]>>;
}): GroupedConnector[] {
  const allConnectors = Object.entries(connectors)
    .reduce<(Connector & { adapter: OrbitAdapter })[]>((acc, [adapter, adapterConnectors]) => {
      return [...acc, ...adapterConnectors.map((c) => ({ ...c, adapter: adapter as OrbitAdapter }))];
    }, [])
    .filter((connector) => formatWalletName(connector.name) !== 'injected');

  // Group by formatted wallet name
  const grouped = allConnectors.reduce<Record<string, GroupedConnector>>((acc, connector) => {
    const formattedName = formatWalletName(connector.name);

    if (!acc[formattedName]) {
      acc[formattedName] = {
        name: connector.name,
        icon: connector.icon,
        adapters: [],
        connectors: [],
      };
    }

    if (!acc[formattedName].adapters.includes(connector.adapter)) {
      acc[formattedName].adapters.push(connector.adapter);
    }

    acc[formattedName].connectors.push(connector);

    return acc;
  }, {});

  return Object.values(grouped);
}
