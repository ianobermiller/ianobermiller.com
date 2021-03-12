import styled from '@emotion/styled';
import Link from 'gatsby-link';
import React, {ReactElement, ReactNode} from 'react';
import {Helmet} from 'react-helmet';
import './areset.css';
import ColorSchemePicker from './ColorSchemePicker';
import './layout.scss';

interface Props {
  children: ReactNode;
  title: string;
}

export default function Layout({
  children,
  title,
}: Props): ReactElement {
  return (
    <Root>
      <Helmet htmlAttributes={{lang: 'en'}}>
        <title>
          {(title ? title + ' \u00AB ' : '') +
            'Ian Obermiller'}
        </title>
        <meta
          name="Description"
          content="Personal site of Christian and software engineer Ian Obermiller."
        />
      </Helmet>

      <Header>
        <h1>
          <Link className="h-card" rel="me" to="/">
            Ian Obermiller
          </Link>
        </h1>
        <h2>Part time hacker, full time dad.</h2>
      </Header>

      <ColorSchemePicker />

      <Nav>
        <ul>
          <li>
            <Link activeClassName="active" to="/">
              About Me
            </Link>
          </li>
          <li>
            <Link
              activeClassName="active"
              partiallyActive={true}
              to="/blog">
              Posts
            </Link>
          </li>
          <li>
            <Link
              activeClassName="active"
              partiallyActive={true}
              to="/recipes">
              Recipes
            </Link>
          </li>
          <li>
            <Link activeClassName="active" to="/projects">
              Projects
            </Link>
          </li>
        </ul>
      </Nav>

      <Content>{children}</Content>

      <Footer>
        <p>
          <a
            href="mailto:ian@obermillers.com"
            rel="me"
            target="_blank">
            ian@obermillers.com
          </a>
          {' \u00B7 '}
          <a
            href="https://github.com/ianobermiller"
            rel="me noopener"
            target="_blank">
            github.com/ianobermiller
          </a>
        </p>
        <Disclaimer>
          Unless otherwise noted, source code on this blog
          is Licensed under the MIT License.
        </Disclaimer>
      </Footer>
    </Root>
  );
}

const WIDTH = '720px';

const Root = styled.main`
  box-sizing: border-box;
  clear: both;
  margin: 0 auto;
  max-width: ${WIDTH};
  min-height: 100vh;
  padding: var(--space-l);
  position: relative;
`;

const Header = styled.header`
  display: block;
  margin-bottom: var(--space-l);
  text-transform: lowercase;

  & > h1 {
    font-size: var(--font-size-title);
    margin: 0;
  }

  & > h2 {
    color: var(--footer-text-color);
    margin: 0;
  }
`;

const Nav = styled.nav`
  font-size: var(--font-size-h2);
  text-transform: lowercase;
  margin: var(--space-m) 0 var(--space-l) 0;
  padding: 0;

  & ul {
    margin: 0;
  }

  & li {
    display: inline-block;

    &:not(:last-child) {
      margin-right: var(--space-l);
    }
  }

  & a {
    text-decoration: none;
  }

  & a.active {
    text-decoration: underline;
  }
`;

const Content = styled.section`
  clear: both;
`;

const Footer = styled.footer`
  margin-top: var(--space-xl);
`;
const Disclaimer = styled.p`
  font-size: var(--font-size-s);
  opacity: 0.8;
`;
