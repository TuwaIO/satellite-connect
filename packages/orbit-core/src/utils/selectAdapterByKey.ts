import { OrbitAdapter, OrbitGenericAdapter } from '../types';

export const selectAdapterByKey = <A extends { key: OrbitAdapter }>({
  adapterKey,
  adapter,
}: { adapterKey: OrbitAdapter } & OrbitGenericAdapter<A>): A | undefined => {
  if (Array.isArray(adapter)) {
    if (adapter.length === 0) {
      console.error('Adapter selection failed: The provided adapters array is empty.');
      return undefined;
    }

    const foundAdapter = adapter.find((a) => a.key === adapterKey);

    if (foundAdapter) {
      return foundAdapter;
    } else {
      console.warn(
        `No adapter found for key: "${adapterKey}". Falling back to the first available adapter: "${adapter[0].key}".`,
      );
      return adapter[0];
    }
  }
  return adapter;
};
