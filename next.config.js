const remarkPrism = require('remark-prism');
const remarkToC = require('remark-toc');

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkToC, remarkPrism],
    rehypePlugins: [],
  },
});

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
});
