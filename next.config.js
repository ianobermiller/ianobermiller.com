const BASE_CONFIG = {
  pageExtensions: ['page.tsx', 'md', 'mdx', 'api.ts'],
  reactStrictMode: true,
};

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    renderer: `
      import React from 'react'
      import {mdx} from '@mdx-js/react'
      import {getStaticProps as gsp} from 'layouts/postData';

      // We can't just export this directly because we need the call stack.
      export async function getStaticProps(ctx) {
        return gsp(ctx);
      }
    `,
    remarkPlugins: [require('remark-toc'), require('remark-prism')],
    rehypePlugins: [],
  },
});

const withImagesRaw = require('next-images');
const withImages = config =>
  withImagesRaw({inlineImageLimit: false, ...config});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const pipe = (...fns) =>
  fns.reduce((prevFn, nextFn) => value => nextFn(prevFn(value)));

module.exports = pipe(withMDX, withImages, withBundleAnalyzer)(BASE_CONFIG);
