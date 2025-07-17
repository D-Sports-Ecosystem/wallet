import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  input: 'src/nextjs/index.ts',
  output: [
    {
      file: 'dist/nextjs/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      inlineDynamicImports: true
    },
    {
      file: 'dist/nextjs/index.esm.js',
      format: 'esm',
      sourcemap: true,
      inlineDynamicImports: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@/components', replacement: path.resolve(__dirname, 'src/components') },
        { find: '@/lib', replacement: path.resolve(__dirname, 'src/lib') },
        { find: '@/utils', replacement: path.resolve(__dirname, 'src/utils') },
        { find: '@/types', replacement: path.resolve(__dirname, 'src/types') },
        { find: '@/connectors', replacement: path.resolve(__dirname, 'src/connectors') },
        { find: '@/providers', replacement: path.resolve(__dirname, 'src/providers') }
      ]
    }),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    json(),
    postcss({
      extract: false,
      inject: false,
      modules: false
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.PLATFORM': JSON.stringify('nextjs'),
      preventAssignment: true
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/nextjs',
      exclude: ['**/*.test.*', '**/*.spec.*']
    }),
    terser()
  ],
  external: ['react', 'react-dom', 'framer-motion', 'lucide-react', 'ethers', 'viem', 'next']
}; 