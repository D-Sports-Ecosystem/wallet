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
import ignoreImport from 'rollup-plugin-ignore-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      inlineDynamicImports: true,
      intro: `
        // Browser compatibility shims
        const process = { env: { NODE_ENV: 'production', PLATFORM: 'browser' } };
        const require = function(mod) { 
          if (mod === 'fs' || mod === 'path' || mod === 'crypto' || mod === 'node-fetch') return {}; 
          throw new Error('Module not found: ' + mod);
        };
      `
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      inlineDynamicImports: true,
      intro: `
        // Browser compatibility shims
        const process = { env: { NODE_ENV: 'production', PLATFORM: 'browser' } };
        const importShim = function(mod) { 
          if (mod === 'fs' || mod === 'path' || mod === 'crypto' || mod === 'node-fetch') return Promise.resolve({}); 
          throw new Error('Module not found: ' + mod);
        };
      `
    }
  ],
  plugins: [
    // Completely ignore Node.js module imports in browser builds
    ignoreImport({
      extensions: ['.js', '.ts', '.tsx'],
      // List of modules to ignore
      patterns: [
        'fs',
        'path',
        'crypto',
        'node-fetch',
        'node:fs',
        'node:path',
        'node:crypto',
        'node:http',
        'node:https',
        'node:stream',
        'node:buffer',
        'node:util',
        'node:url',
        'node:net',
        'node:zlib',
        '@react-native-async-storage/async-storage'
      ]
    }),
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
      browser: true,
      preferBuiltins: false,
      // Prefer browser field over module field for browser builds
      mainFields: ['browser', 'module', 'main'],
      // Explicitly exclude Node.js built-ins
      resolveOnly: (module) => {
        const nodeBuiltins = [
          'fs', 'path', 'crypto', 'os', 'stream', 'http', 'https', 'zlib', 
          'util', 'url', 'net', 'tls', 'buffer', 'querystring', 'assert', 
          'events', 'string_decoder', 'punycode', 'process', 'child_process'
        ];
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
          'fs', 'path', 'crypto', 'os', 'stream', 'http', 'https', 'zlib', 
          'util', 'url', 'net', 'tls', 'buffer', 'querystring', 'assert', 
          'events', 'string_decoder', 'punycode', 'process', 'child_process'
        ];
        return nodeBuiltins.some(builtin => 
          id === builtin || 
          id.startsWith(`${builtin}/`) || 
          id.startsWith(`node:${builtin}`)
        );
      }
    }),
    json(),
    postcss({
      extract: true,
      minimize: true,
      inject: false
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
      // Add platform detection for conditional imports
      'process.env.PLATFORM': JSON.stringify('browser'),
      // Replace direct Node.js module imports with empty objects
      'require("fs")': '{}',
      'require("path")': '{}',
      'require("crypto")': '{}',
      'require("node-fetch")': 'fetch',
      'require(\'fs\')': '{}',
      'require(\'path\')': '{}',
      'require(\'crypto\')': '{}',
      'require(\'node-fetch\')': 'fetch',
      // Replace dynamic imports of Node.js modules
      'import(\'fs\')': 'Promise.resolve({})',
      'import("fs")': 'Promise.resolve({})',
      'import(\'path\')': 'Promise.resolve({})',
      'import("path")': 'Promise.resolve({})',
      'import(\'crypto\')': 'Promise.resolve({})',
      'import("crypto")': 'Promise.resolve({})',
      // Handle webpackIgnore comments
      'import(/* webpackIgnore: true */ \'fs\')': 'Promise.resolve({})',
      'import(/* webpackIgnore: true */ "fs")': 'Promise.resolve({})',
      'import(/* webpackIgnore: true */ \'path\')': 'Promise.resolve({})',
      'import(/* webpackIgnore: true */ "path")': 'Promise.resolve({})',
      'import(/* webpackIgnore: true */ \'crypto\')': 'Promise.resolve({})',
      'import(/* webpackIgnore: true */ "crypto")': 'Promise.resolve({})'
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      exclude: ['**/*.test.*', '**/*.spec.*']
    }),
    terser(),
    visualizer({
      filename: 'dist/stats-browser.html',
      title: 'D-Sports Wallet Browser Bundle Analysis',
      gzipSize: true,
      brotliSize: true
    })
  ],
  external: (id) => {
    // Always external these peer dependencies
    const peerDeps = ['react', 'react-dom', 'framer-motion', 'lucide-react', 'ethers', 'viem', 'react-native', 'react-native-reanimated'];
    if (peerDeps.includes(id) || id.startsWith('react/') || id.startsWith('react-dom/')) return true;
    
    // External Node.js built-in modules and platform-specific packages
    const nodeModules = [
      'fs', 'path', 'crypto', 'os', 'node-fetch', 'stream', 'http', 'https', 'zlib', 
      'util', 'url', 'net', 'tls', 'buffer', 'querystring', 'assert', 
      'events', 'string_decoder', 'punycode', 'process', 'child_process'
    ];
    const nodeBuiltins = nodeModules.map(mod => `node:${mod}`);
    const platformModules = [
      '@react-native-async-storage/async-storage',
      'react-native-keychain',
      'react-native-url-polyfill'
    ];
    
    // Check if the module is a Node.js built-in or platform-specific module
    if (nodeModules.some(mod => id === mod || id.startsWith(`${mod}/`)) || 
        nodeBuiltins.some(mod => id === mod || id.startsWith(`${mod}/`)) || 
        platformModules.some(mod => id === mod || id.startsWith(`${mod}/`))) {
      return true;
    }
    
    // External server-only modules
    if (id.includes('server-token-writer')) return true;
    
    return false;
  }
}; 