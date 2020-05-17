export function getBlogPostUrl(node: {fileAbsolutePath: string}): string {
  return node.fileAbsolutePath
    .replace(/.*\/blog\//, '/blog/')
    .replace('.mdx', '');
}
