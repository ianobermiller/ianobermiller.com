import {fakeCSS as css} from '../utils';

export default css`
  /**
 * prism.js Dark theme for JavaScript, CSS and HTML
 * Based on the slides of the talk “/Reg(exp){2}lained/”
 * @author Lea Verou
 */

  code[class*='language-'],
  pre[class*='language-'] {
    color: white;
    background: none;
    text-shadow: 0 -0.1em 0.2em black;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 1em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  @media print {
    code[class*='language-'],
    pre[class*='language-'] {
      text-shadow: none;
    }
  }

  pre[class*='language-'],
  :not(pre) > code[class*='language-'] {
    background: hsl(30, 20%, 25%);
  }

  /* Code blocks */
  pre[class*='language-'] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
    border: 0.3em solid hsl(30, 20%, 40%);
    border-radius: 0.5em;
    box-shadow: 1px 1px 0.5em black inset;
  }

  /* Inline code */
  :not(pre) > code[class*='language-'] {
    padding: 0.15em 0.2em 0.05em;
    border-radius: 0.3em;
    border: 0.13em solid hsl(30, 20%, 40%);
    box-shadow: 1px 1px 0.3em -0.1em black inset;
    white-space: normal;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: hsl(30, 20%, 50%);
  }

  .token.punctuation {
    opacity: 0.7;
  }

  .namespace {
    opacity: 0.7;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol {
    color: hsl(350, 40%, 70%);
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: hsl(75, 70%, 60%);
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string,
  .token.variable {
    color: hsl(40, 90%, 60%);
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: hsl(350, 40%, 70%);
  }

  .token.regex,
  .token.important {
    color: #e90;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }

  .token.deleted {
    color: red;
  }
`;
