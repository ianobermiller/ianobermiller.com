---
title: 'Highlight search terms in C#, Javascript and TypeScript'
author: iano
type: post
date: 2013-01-20T06:32:07+00:00
url: /blog/2013/01/19/highlight-search-terms-in-c-javascript-and-typescript/
categories:
  - 'C#'
  - JavaScript
  - TypeScript

---
Following is a function that given a string and a search query will wrap bold tags around search terms that were found in the query:

Example:

text = &#8220;The theory of the big bang was proposed in&#8230;&#8221;
  
query = &#8220;Big Bang Theory&#8221;
  
result = &#8220;The <b>theory</b> of the <b>big</b> <b>bang</b> was proposed in&#8230;&#8221;
  
result as html = The **theory** of the **big** **bang** was proposed in&#8230;.
  
<!--more-->


  
C# version:
  
<small>(note: you may want to return an HtmlString instead to make it easier to call from a view.)</small>

<pre class="brush: csharp; title: ; notranslate" title="">string HighlightSearchTerms(string text, string query)
{
    var terms = query.Split(new[] {' '}, StringSplitOptions.RemoveEmptyEntries).Select(s =&gt; s.Replace("|", "\\|"));
    var regex = new Regex("(" + string.Join("|", terms) + ")", RegexOptions.IgnoreCase);
    return regex.Replace(text, "&lt;b&gt;${0}&lt;/b&gt;");
}
</pre>

Javascript version:
  
<small>(note: <a href="https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map" title="Array.prototype.map at Mozilla Developer Network">Array.prototype.map is in ES5 and may require a shim</a>.)</small>

<pre class="brush: jscript; title: ; notranslate" title="">function highlightSearchTerms(text, query) {
    var terms = query.split(' ').map(function(s) { return s.replace('|', '\\|'); });
    var regex = new RegExp('(' + terms.join('|') + ')', 'gi');
    return text.replace(regex, '&lt;b&gt;$&&lt;/b&gt;');
}
</pre>

TypeScript version:
  
<small>(just the JS version with type annotations)</small>

[typescript]
  
function highlightSearchTerms(text: string, query: string): string {
      
var terms = query.split(&#8216; &#8216;).map(function(s) { return s.replace(&#8216;|&#8217;, &#8216;\\|&#8217;); });
      
var regex = new RegExp(&#8216;(&#8216; + terms.join(&#8216;|&#8217;) + &#8216;)&#8217;, &#8216;gi&#8217;);
      
return text.replace(regex, &#8216;<b>$&</b>&#8217;);
  
}
  
[/typescript]