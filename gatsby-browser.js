// @ts-nocheck

import {isDarkMode} from './src/utils';

if (isDarkMode()) {
  require('prismjs/themes/prism-dark.css');
} else {
  require('prismjs/themes/prism.css');
}
