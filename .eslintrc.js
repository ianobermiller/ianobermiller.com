const path = require('path');

module.exports = {
  plugins: ['graphql'],
  rules: {
    'graphql/template-strings': [
      'error',
      {
        env: 'relay',
        tagName: 'graphql',
        schemaJsonFilepath: path.resolve(
          __dirname,
          'src/__generated__gatsby-introspection.json',
        ),
      },
    ],
  },
};
