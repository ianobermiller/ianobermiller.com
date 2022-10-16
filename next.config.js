import remarkTOC from 'remark-toc';
import remarkPrism from 'remark-prism';
import nextMDX from '@next/mdx';
import nextBundleAnalyzer from '@next/bundle-analyzer';

const BASE_CONFIG = {
  pageExtensions: ['page.tsx', 'md', 'mdx', 'api.ts'],
  reactStrictMode: true,
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkTOC, remarkPrism],
  },
});

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const pipe = (...fns) =>
  fns.reduce((prevFn, nextFn) => value => nextFn(prevFn(value)));

export default pipe(withMDX, withBundleAnalyzer)(BASE_CONFIG);
