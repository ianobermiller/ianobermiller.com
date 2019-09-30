function getBlogPostUrl(node) {
  return node.fileAbsolutePath
    .replace(/.*\/blog\//, '/blog/')
    .replace('.mdx', '');
}

function isDarkMode() {
  // @ts-ignore
  return !!window.matchMedia('(prefers-color-scheme: dark)').matches;
}

module.exports = {
  getBlogPostUrl,
  isDarkMode,
};
