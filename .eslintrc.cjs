module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'plugin:mdx/recommended',
  ],
  rules: {
    'react/display-name': 'off',
    'react/no-unescaped-entities': ['error', {forbid: ['>', '}']}],
  },
};
