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
                main: './src/core/abs-slider.js'
            },
            output: {
                dir: 'dist',
                format: 'es',
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        },
        lib: {
            entry: './src/core/abs-slider.js',
            name: 'ABSSlider',
            fileName: 'abs-slider'
        },
    },
    css: {
        preprocessorOptions: {
            css: {
                additionalData: '@import "./src/core/styles/abs-slider.css";'
            }
        }
    }
});
