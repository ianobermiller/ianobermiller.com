---
title: Conditionally Load Intl Polyfill with Webpack
author: iano
type: post
date: 2015-06-01T13:50:11+00:00
url: /blog/2015/06/01/conditionally-load-intl-polyfill-webpack/
categories:
  - JavaScript
  - React
  - webpack
tags:
  - internationalization
  - polyfill

---
So, you want to use the new [JavaScript Internationalization API, Intl][1]? Perhaps you even want to use it with the awesome [React Intl][2] library. [Browser support is okay][3], but if you want to support <IE11 and any version of Safari you&#8217;ll have to use a polyfill. Unfortunately, [the polyfill][4] is pretty large if you use the full build with all languages, clocking in at ~150k minified and gzipped. Wouldn&#8217;t it be great if we could set up our JavaScript app to download the Intl library only if the browser needs the polyfill? Fortunately, this is really easy to do using [webpack][5].

## 1. Install intl

<pre class="brush: bash; title: ; notranslate" title="">npm install --save intl
</pre>

## 2. Modify app&#8217;s entry point

Before,  our app&#8217;s entry point using React was simple and synchronous:

<pre class="brush: jscript; title: ; notranslate" title="">var React = require('react');
var App = require('./App');

React.render(&lt;App /&gt;, document.body);

</pre>

Now, we need to put all our initialization code into a function, and wait to invoke the function until the polyfill is loaded:

<pre class="brush: jscript; title: ; notranslate" title="">function run() {
  var React = require('react');
  var App = require('./App');

  React.render(&lt;App /&gt;, document.body);
}

// Check if polyfill required
if (!window.Intl) {
  // Webpack parses the inside of require.ensure at build time to know that intl
  // should be bundled separately. You could get the same effect by passing
  // ['intl'] as the first argument.
  require.ensure([], () =&gt; {
    // Ensure only makes sure the module has been downloaded and parsed.
    // Now we actually need to run it to install the polyfill.
    require('intl');

    // Carry on
    run();
  });
} else {
  // Polyfill wasn't needed, carry on
  run();
}
</pre>

That&#8217;s all there is to it. Webpack takes care of splitting the bundle and downloading the polyfill on `require.ensure`! This method should work with all kinds of polyfills, and keeps your app lean for modern browsers yet working in the rest. For more information, see the [webpack documentation for code splitting][6].

 [1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
 [2]: http://formatjs.io/react/
 [3]: http://caniuse.com/#feat=internationalization
 [4]: https://github.com/andyearnshaw/Intl.js
 [5]: http://webpack.github.io/
 [6]: http://webpack.github.io/docs/code-splitting.html