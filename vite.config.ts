import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

export default defineConfig( {
                                 resolve: {
                                     alias: {
                                         '@': resolve( __dirname, 'src' ),
                                     },
                                 },
                                 build: {
                                     lib: {
                                         entry: resolve( __dirname, 'src/core/ABCarousel.ts' ),
                                         name: 'ABCarousel',
                                         fileName: 'ab-carousel',
                                         formats: [ 'es', 'cjs' ],
                                     },
                                     rollupOptions: {
                                         external: [],
                                     },
                                 },
                                 test: {
                                     environment: 'jsdom',
                                     globals: true,
                                     setupFiles: [ './test/setup.ts' ],
                                 },
                             } );

