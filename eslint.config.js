import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.browser,
    },
  },
  eslintConfigPrettier,
]);
