import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/react-native/index.ts',
  output: [
    {
      file: 'dist/react-native/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      inlineDynamicImports: true
    },
    {
      file: 'dist/react-native/index.esm.js',
      format: 'esm',
      sourcemap: true,
      inlineDynamicImports: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: false,
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
      'process.env.PLATFORM': JSON.stringify('react-native'),
      preventAssignment: true
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/react-native',
      exclude: ['**/*.test.*', '**/*.spec.*']
    }),
    terser()
  ],
  external: ['react', 'react-native', 'framer-motion', 'lucide-react', 'ethers', 'viem']
}; 