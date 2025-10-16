import { defineConfig } from 'tsup';

export default defineConfig([
  {
    format: ['cjs', 'esm'],
    entry: ['./src/index.ts'],
    treeshake: true,
    sourcemap: true,
    minify: true,
    clean: true,
    dts: true,
    external: [
      '@tuwaio/orbit-core',
      '@tuwaio/orbit-solana',
      '@tuwaio/satellite-core',
      '@wallet-standard/app',
      '@wallet-standard/base',
      '@wallet-standard/features',
      '@wallet-standard/core',
      '@wallet-standard/ui',
      '@wallet-standard/ui-registry',
      'gill',
      'immer',
      'zustand',
    ],
  },
]);
