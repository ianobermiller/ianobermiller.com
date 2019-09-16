---
title: React Pure Render Decorator
author: iano
type: post
date: 2015-06-20T13:45:26+00:00
url: /blog/2015/06/20/react-pure-render-decorator/
categories:
  - ES2015
  - JavaScript
  - React
tags:
  - decorators

---
If you&#8217;ve adopted JavaScript classes when working with React, you may be missing `PureRenderMixin`. You can emulate it easily using decorators:

<pre class="brush: jscript; title: ; notranslate" title="">var shallowEqual = require('react/lib/shallowEqual');

module.exports = function PureRender(Component) {
  Component.prototype.shouldComponentUpdate = function(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  };
  return Component;
};
</pre>

Use it with the decorator syntax or just as a wrapper around your component:

<pre class="brush: jscript; title: ; notranslate" title="">@PureRender
class Button extends Component { ... }

Button = PureRender(Button);
</pre>

The logic is exactly the same as `PureRenderMixin`. Keep in mind that this could break if/when React&#8217;s internals are rearranged, since we are deeply requiring `shallowEqual`. This hasn&#8217;t been published to NPM, but if you&#8217;d like to see it drop me a comment. Hopefully a pure rendering decorator will make its way into [react-pure-render][1] instead.

 [1]: https://github.com/gaearon/react-pure-render/pull/4