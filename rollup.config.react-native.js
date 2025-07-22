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
import { visualizer } from 'rollup-plugin-visualizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      // For React Native, we need to handle both browser and native modules
      browser: true,
      preferBuiltins: false,
      // Prefer react-native field over browser field for React Native builds
      mainFields: ['react-native', 'browser', 'module', 'main'],
      // Explicitly exclude Node.js built-ins that aren't compatible with React Native
      resolveOnly: (module) => {
        const nodeBuiltins = [
          'fs', 'path', 'os', 'stream', 'http', 'https', 'zlib', 
          'util', 'url', 'net', 'tls', 'buffer', 'querystring', 'assert', 
          'events', 'string_decoder', 'punycode', 'process', 'child_process'
        ];
        // Allow crypto since React Native has a polyfill
        return !nodeBuiltins.some(builtin => 
          module === builtin || 
          module.startsWith(`${builtin}/`) || 
          module.startsWith(`node:${builtin}`)
        );
      }
    }),
    commonjs({
      // Exclude Node.js built-ins from CommonJS resolution
      ignore: (id) => {
        const nodeBuiltins = [
          'fs', 'path', 'os', 'stream', 'http', 'https', 'zlib', 
          'util', 'url', 'net', 'tls', 'buffer', 'querystring', 'assert', 
          'events', 'string_decoder', 'punycode', 'process', 'child_process'
        ];
        // Allow crypto since React Native has a polyfill
        return nodeBuiltins.some(builtin => 
          id === builtin || 
          id.startsWith(`${builtin}/`) || 
          id.startsWith(`node:${builtin}`)
        );
      }
    }),
    json(),
    postcss({
      extract: false,
      inject: false,
      modules: false
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.PLATFORM': JSON.stringify('react-native'),
      preventAssignment: true,
      // Replace Node.js modules with appropriate polyfills or empty objects
      'require("fs")': '{}',
      'require("path")': '{}',
      // Don't replace crypto as React Native has a polyfill
      'require("node-fetch")': 'fetch',
      'require(\'fs\')': '{}',
      'require(\'path\')': '{}',
      'require(\'node-fetch\')': 'fetch'
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/react-native',
      exclude: ['**/*.test.*', '**/*.spec.*']
    }),
    terser(),
    visualizer({
      filename: 'dist/stats-react-native.html',
      title: 'D-Sports Wallet React Native Bundle Analysis',
      gzipSize: true,
      brotliSize: true
    })
  ],
  external: (id) => {
    // Always external these peer dependencies
    const peerDeps = [
      'react', 'react-native', 'framer-motion', 'lucide-react', 'ethers', 'viem', 
      'react-native-reanimated', '@react-native-async-storage/async-storage',
      'react-native-keychain', 'react-native-url-polyfill'
    ];
    if (peerDeps.includes(id) || 
        id.startsWith('react/') || 
        id.startsWith('react-native/') || 
        id.startsWith('@react-native')) return true;
    
    // External Node.js built-in modules (except crypto which has a React Native polyfill)
    const nodeModules = [
      'fs', 'path', 'os', 'node-fetch', 'stream', 'http', 'https', 'zlib', 
      'util', 'url', 'net', 'tls', 'buffer', 'querystring', 'assert', 
      'events', 'string_decoder', 'punycode', 'process', 'child_process'
    ];
    const nodeBuiltins = nodeModules.map(mod => `node:${mod}`);
    
    // Check if the module is a Node.js built-in
    if (nodeModules.some(mod => id === mod || id.startsWith(`${mod}/`)) || 
        nodeBuiltins.some(mod => id === mod || id.startsWith(`${mod}/`))) {
      return true;
    }
    
    // External server-only modules
    if (id.includes('server-token-writer')) return true;
    
    return false;
  }
}; 