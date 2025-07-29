import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

export default defineConfig( {
     resolve: {
         alias: {
             '@': resolve( __dirname, 'src' ),
             '@transitions': resolve(__dirname, 'src/extensions/transitions'),
             '@effects': resolve(__dirname, 'src/extensions/effects'),
             '@plugins': resolve(__dirname, 'src/extensions/plugins'),
             '@support': resolve(__dirname, 'src/support'),
         },
     },
     build: {
         lib: {
             entry: resolve( __dirname, 'src/index.ts' ),
             name: 'ABCarousel',
             fileName: ( format ) => `ab-carousel.${ format }.js`,
             formats: [ 'es', 'cjs' ]
         },
         rollupOptions: {
             external: [],
         },
     },
     test: {
         environment: 'jsdom',
         globals: true,
         setupFiles: [ './test/setup.ts' ],
         throwOnUnhandledErrors: true,
         coverage: {
             provider: 'v8',
             reportsDirectory: './coverage',
             reporter: [ 'text', 'html' ],
             exclude: [
                 'test/',
                 'dist/**',
                 '**/*.d.ts',
                 'vite.config.ts',
                 'eslint.config.js',
                 'src/index.ts',
                 'src/interfaces.ts',
                 'src/types.ts',
             ]
         }
     },
 } );

