import svelte from 'rollup-plugin-svelte';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;
const BROWSER_ENV = process.env.BROWSER_ENV || 'chrome';
const NODE_ENV = process.env.NODE_ENV || 'development';

const envs = replace({
  'process.env.BROWSER_ENV': JSON.stringify(BROWSER_ENV),
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
});

export default [
  {
    input: 'src/app.js',
    output: {
      // sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'dist/untab.js',
    },
    plugins: [
      svelte({
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css: css => {
          css.write('bundle.css');
        },
      }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      envs,
      commonjs(),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: 'src/content/index.js',
    output: {
      format: 'iife',
      name: 'content',
      file: 'dist/content/content.js',
    },
    plugins: [
      resolve({
        browser: true,
      }),
      envs,
      commonjs(),
      terser(),
      copy({
        targets: [
          { src: 'src/content/styles.css', dest: 'dist/content/' },
          { src: `src/manifest.${BROWSER_ENV}.json`, dest: 'dist/', rename: 'manifest.json' },
          { src: 'src/index.html', dest: 'dist/' },
          { src: 'src/themes/fonts.css', dest: 'dist/themes/' },
          { src: 'src/themes/themes.css', dest: 'dist/themes/' },
          { src: 'src/static/', dest: 'dist/' },
          ... BROWSER_ENV === 'chrome' ? [{ src: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js', dest: 'dist/' }] : [],
        ],
      }),
    ],
  },
  {
    input: 'src/background/index.js',
    output: {
      format: 'iife',
      name: 'background',
      file: 'dist/background.js',
    },
    plugins: [
      resolve({
        browser: true,
      }),
      envs,
      commonjs(),
      terser(),
    ],
  },
];
