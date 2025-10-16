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
      'gill',
      '@wallet-standard/app',
      '@wallet-standard/ui-core',
      '@wallet-standard/ui-registry',
    ],
  },
]);
