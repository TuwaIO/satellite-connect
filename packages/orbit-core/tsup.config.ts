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
  },
]);
