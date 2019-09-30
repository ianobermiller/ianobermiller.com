function getBlogPostUrl(node) {
  return node.fileAbsolutePath
    .replace(/.*\/blog\//, '/blog/')
    .replace('.mdx', '');
}

function isDarkMode() {
  // @ts-ignore
  return !!window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Only used ot make syntax highlighting happy in the prism css files
function fakeCSS(literals) {
  return literals.join('');
}

module.exports = {
  fakeCSS,
  getBlogPostUrl,
  isDarkMode,
};
