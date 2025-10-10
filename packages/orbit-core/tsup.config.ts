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
  },
  {
    name: 'zustand',
    format: ['cjs', 'esm'],
    entry: ['./src/zustand/index.ts'],
    outDir: 'dist/zustand',
    treeshake: true,
    sourcemap: true,
    minify: true,
    clean: true,
    dts: true,
  },
]);
