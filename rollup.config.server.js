import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';
import path from 'path';
import { fileURLToPath } from 'url';
import { visualizer } from 'rollup-plugin-visualizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  input: 'src/server/index.ts',
  output: [
    {
      file: 'dist/server/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      inlineDynamicImports: true
    },
    {
      file: 'dist/server/index.esm.js',
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
        { find: '@/providers', replacement: path.resolve(__dirname, 'src/providers') },
        { find: '@/data', replacement: path.resolve(__dirname, 'data') },
        { find: '~/data', replacement: path.resolve(__dirname, 'data') }
      ]
    }),
    resolve({
      // For server builds, we can use Node.js built-ins
      browser: false,
      preferBuiltins: true,
      mainFields: ['module', 'main']
    }),
    commonjs(),
    json(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.PLATFORM': JSON.stringify('server'),
      preventAssignment: true
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/server',
      exclude: ['**/*.test.*', '**/*.spec.*']
    }),
    terser(),
    visualizer({
      filename: 'dist/stats-server.html',
      title: 'D-Sports Wallet Server Bundle Analysis',
      gzipSize: true,
      brotliSize: true
    })
  ],
  external: (id) => {
    // Always external these peer dependencies
    const peerDeps = ['react', 'react-dom', 'framer-motion', 'lucide-react', 'ethers', 'viem', 'next'];
    if (peerDeps.includes(id) || 
        id.startsWith('react/') || 
        id.startsWith('react-dom/') || 
        id.startsWith('next/')) return true;
    
    // External React Native specific packages (not needed in server)
    const reactNativeModules = [
      'react-native',
      'react-native-reanimated',
      '@react-native-async-storage/async-storage',
      'react-native-keychain',
      'react-native-url-polyfill'
    ];
    
    if (reactNativeModules.some(mod => id === mod || id.startsWith(`${mod}/`))) {
      return true;
    }
    
    return false;
  }
};