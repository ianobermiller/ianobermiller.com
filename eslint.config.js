import {defineConfig} from 'eslint/config';
import eslintPlugin from '@eslint/js';
import {configs as tseslintConfigs} from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import nextPlugin from '@next/eslint-plugin-next';
import * as mdxPlugin from 'eslint-plugin-mdx';

// Global ignores configuration
const ignoresConfig = defineConfig([
  {
    name: 'project/ignores',
    ignores: [
      '.next/',
      'node_modules/',
      'public/',
      '.vscode/',
      'next-env.d.ts',
    ],
  },
]);

// ESLint recommended rules
const eslintConfig = defineConfig([
  {
    name: 'project/javascript-recommended',
    files: ['**/*.{js,mjs,ts,tsx}'],
    ...eslintPlugin.configs.recommended,
  },
  {
    name: 'project/node-globals',
    files: ['next.config.js', 'plugins/**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
  },
  {
    name: 'project/browser-globals',
    files: ['pages/**/*.js', 'layouts/**/*.js'],
    languageOptions: {
      globals: {
        performance: 'readonly',
        requestAnimationFrame: 'readonly',
        window: 'readonly',
        document: 'readonly',
      },
    },
  },
]);

// TypeScript configuration
const typescriptConfig = defineConfig([
  {
    name: 'project/typescript-recommended',
    files: ['**/*.{ts,tsx,mjs}'],
    extends: [...tseslintConfigs.recommended],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    name: 'project/javascript-disable-type-check',
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslintConfigs.disableTypeChecked,
  },
]);

// React and Next.js configuration
const reactConfig = defineConfig([
  {
    name: 'project/react-next',
    files: ['**/*.{js,jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      '@next/next': nextPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs['recommended-latest'].rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // Custom rules from original config
      'react/display-name': 'off',
      'react/no-unescaped-entities': ['error', {forbid: ['>', '}']}],
      // Additional Next.js optimizations
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': 'off', // Next.js handles this
      'react-hooks/set-state-in-effect': 'warn', // Demote to warning
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);

// MDX configuration
const mdxConfig = defineConfig([
  {
    name: 'project/mdx-files',
    files: ['**/*.mdx'],
    ...mdxPlugin.flat,
    processor: mdxPlugin.createRemarkProcessor({
      lintCodeBlocks: false,
      languageMapper: {},
    }),
  },
  {
    name: 'project/mdx-code-blocks',
    files: ['**/*.mdx'],
    ...mdxPlugin.flatCodeBlocks,
    rules: {
      ...mdxPlugin.flatCodeBlocks.rules,
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    name: 'project/mdx-react-rules',
    files: ['**/*.mdx'],
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
]);

// Export the complete configuration
export default defineConfig([
  ...ignoresConfig,
  ...eslintConfig,
  ...typescriptConfig,
  ...reactConfig,
  ...mdxConfig,
]);
