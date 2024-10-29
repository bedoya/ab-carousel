import {defineConfig} from 'vite';

export default defineConfig({
    test: {
        environment: 'jsdom'
    },
    build: {
        outDir: 'dist',
        minify: true,
        cssMinify: true,
        rollupOptions: {
            input: {
                main: './src/core/ab-carousel.js'
            },
            output: {
                dir: 'dist',
                format: 'es',
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        },
        lib: {
            entry: './src/core/ab-carousel.js',
            name: 'ABCarousel',
            fileName: 'ab-carousel'
        },
    },
    css: {
        preprocessorOptions: {
            css: {
                additionalData: '@import "./src/core/styles/ab-carousel.css";'
            }
        }
    }
});
