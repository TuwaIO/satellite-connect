import { defineConfig } from 'tsup';

export default defineConfig([
  {
    format: ['cjs', 'esm'],
    entry: ['./src/index.ts', './src/evm/index.ts', './src/solana/index.ts'],
    treeshake: true,
    sourcemap: true,
    minify: true,
    splitting: true,
    clean: true,
    dts: true,
    external: [
      '@tuwaio/orbit-core',
      '@tuwaio/orbit-evm',
      '@tuwaio/orbit-solana',
      '@tuwaio/satellite-core',
      '@tuwaio/satellite-evm',
      '@tuwaio/satellite-solana',
      '@wagmi/core',
      '@wagmi/connectors',
      'viem',
      '@wallet-standard/react',
      'gill',
      'react',
      'immer',
      'zustand',
    ],
  },
]);
