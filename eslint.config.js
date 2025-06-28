import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
    js.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 'latest',
            },
            environment: {
                browser: true,
                es2021: true,
                node: true,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['warn'],
        },
    },
    {
        ignores: ['dist/**'],
    },
];
