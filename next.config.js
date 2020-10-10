const remarkPrism = require('remark-prism');
const remarkToC = require('remark-toc');

const mdxRenderer = `
  import React from 'react'
  import { mdx } from '@mdx-js/react'
  import {getStaticProps as gsp} from 'layouts/postData';

  // We can't just export this directly because we need the
  // call stack.
  export async function getStaticProps(ctx) {
    return gsp(ctx);
  }
`;

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    renderer: mdxRenderer,
    remarkPlugins: [remarkToC, remarkPrism],
    rehypePlugins: [],
  },
});

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
});
