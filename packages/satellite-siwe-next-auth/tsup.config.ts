import { defineConfig } from 'tsup';

export default defineConfig([
  {
    name: 'main',
    format: ['cjs', 'esm'],
    entry: ['./src/index.ts'],
    treeshake: true,
    sourcemap: true,
    minify: true,
    clean: true,
    dts: true,
    external: ['@wagmi/core', 'siwe', 'next', 'iron-session', 'react', 'viem', 'wagmi'],
  },
  {
    name: 'server',
    format: ['esm'],
    entry: ['./src/server/index.ts'],
    outDir: 'dist/server',
    treeshake: true,
    sourcemap: true,
    minify: true,
    clean: true,
    dts: true,
    external: ['@wagmi/core', 'siwe', 'next', 'iron-session', 'react', 'viem', 'wagmi'],
  },
]);
