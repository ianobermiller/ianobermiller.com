function getBlogPostUrl(node) {
  return node.fileAbsolutePath
    .replace(/.*\/blog\//, '/blog/')
    .replace('.mdx', '');
}

module.exports = {
  getBlogPostUrl,
};
