---
title: Styling Visited Links with Radium and React
author: iano
type: post
date: 2015-06-24T17:00:00+00:00
url: /blog/2015/06/24/styling-visited-links-with-radium-and-react/
categories:
  - JavaScript
  - Radium
  - React

---
[Radium][1] is a library for styling React components that I&#8217;ve spent a fair amount of development time on over the past few months. Radium uses inline styles exclusively, and there are some things you just can&#8217;t do without CSS. Styling `:visited` links is one of them. Luckily, Radium provides a `<Style>` component which makes this pretty easy to accomplish.

The `<Style>` component will render a `<style>` tag, and will prepend each selector with the specified `scopeSelector`. We use the name of the component as the class, but you could be extra careful and append a generated string to the class to be certain it won&#8217;t conflict.

<pre class="brush: jscript; title: ; notranslate" title="">import {Component} from 'react';
import Radium, {Style} from 'radium';

@Radium
export default class ListOfLinks extends Component {
  render() {
    return (
      &lt;div className="ListOfLinks"&gt;
        &lt;Style
          scopeSelector=".ListOfLinks"
          rules={{
            a: {
              color: 'black'
            },
            'a:visited': {
              color: '#999'
            }
          }}
        /&gt;
        &lt;ul&gt;
          &lt;li&gt;&lt;a href="http://example1.com"&gt;Example 1&lt;/a&gt;&lt;/li&gt;
          &lt;li&gt;&lt;a href="http://example2.com"&gt;Example 2&lt;/a&gt;&lt;/li&gt;
          &lt;li&gt;&lt;a href="http://example3.com"&gt;Example 3&lt;/a&gt;&lt;/li&gt;
          &lt;li&gt;&lt;a href="http://example4.com"&gt;Example 4&lt;/a&gt;&lt;/li&gt;
        &lt;/ul&gt;
      &lt;/div&gt;
    );
  }
}
</pre>

You&#8217;ll notice I also styled normal links, and that was just for convenience. If I style them inline, like `<a href="http://example1.com" style={{color: 'blue'}}>Example 1</a>`, I&#8217;d have to change the value for visited to `#999 !important` to make it override the inline style.

Remember, the usual caveats of selectors apply to `<Style>`, so any children of `ListOfLinks` that render anchor tags will also be affected. For this reason, you should only use `<Style>` on components that don&#8217;t render `{this.props.children}`.

Other uses for `<Style>`:

  * Styling user-generated HTML, like in a CMS
  * Styling the `body` and `html` tags (since `scopeSelector` is optional)

 [1]: https://github.com/FormidableLabs/radium