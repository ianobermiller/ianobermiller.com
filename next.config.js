import nextBundleAnalyzer from '@next/bundle-analyzer';
import nextMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import {remarkMdxNext} from 'remark-mdx-next';
import remarkPrism from 'remark-prism';
import remarkTOC from 'remark-toc';

const BASE_CONFIG = {
  pageExtensions: ['page.tsx', 'md', 'mdx', 'api.ts'],
  reactStrictMode: true,
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxNext, remarkTOC, remarkPrism],
  },
});

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const pipe = (...fns) =>
  fns.reduce((prevFn, nextFn) => value => nextFn(prevFn(value)));

export default pipe(withMDX, withBundleAnalyzer)(BASE_CONFIG);
