import * as React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';

import './layout.css';
import {ReactElement, ReactNodeArray} from 'react';

interface Props {
  children: ReactNodeArray;
  pageContext?: {
    frontmatter: {
      title: string;
    };
  };
}

export default function Layout(props: Props): ReactElement {
  const title = props.pageContext && props.pageContext.frontmatter.title;
  return (
    <main className="root">
      <Helmet title="Ian Obermiller" />

      <div className="header left">
        <h1>
          <a href="/">Ian Obermiller</a>
        </h1>
        <h2 className="description">Part time hacker, full time dad.</h2>
      </div>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
        </ul>
      </nav>

      <section className="content">
        {title && <h1>{title}</h1>}

        {props.children}
      </section>

      <footer>
        Unless otherwise noted, source code on this blog is Licensed under the
        MIT License.
      </footer>
    </main>
  );
}
