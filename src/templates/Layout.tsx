import styled from '@emotion/styled';
import Link from 'gatsby-link';
import React, {ReactElement, ReactNode} from 'react';
import {Helmet} from 'react-helmet';
import './areset.css';
import ColorSchemePicker from './ColorSchemePicker';
import './layout.scss';

interface Props {
  children: ReactNode;
  title?: string;
}

export default function Layout({children, title}: Props): ReactElement {
  return (
    <Root>
      <Helmet htmlAttributes={{lang: 'en'}}>
        <title>{(title ? title + ' \u00AB ' : '') + 'Ian Obermiller'}</title>
        <meta
          name="Description"
          content="Personal site of Christian and software engineer Ian Obermiller."></meta>
      </Helmet>

      <Header>
        <h1>
          <Link to="/">Ian Obermiller</Link>
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
            <Link activeClassName="active" partiallyActive={true} to="/blog">
              Posts
            </Link>
          </li>
          <li>
            <Link activeClassName="active" partiallyActive={true} to="/recipes">
              Recipes
            </Link>
          </li>
        </ul>
      </Nav>

      <Content>
        {title && <h1>{title}</h1>}
        {children}
      </Content>

      <Footer>
        <p>
          <a href="mailto:ian@obermillers.com" target="_blank">
            ian@obermillers.com
          </a>
          {' \u00B7 '}
          <a
            href="https://github.com/ianobermiller"
            rel="noopener"
            target="_blank">
            github.com/ianobermiller
          </a>
        </p>
        <Disclaimer>
          Unless otherwise noted, source code on this blog is Licensed under the
          MIT License.
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
    font-size: 48px;
    margin: 0;
  }

  & > h2 {
    color: var(--footer-text-color);
    font-size: 24px;
    margin: 0;
  }

  @media screen and (max-device-width: ${WIDTH}) {
    float: none;
    margin: 0 0 10px 0;

    & > h1 {
      font-size: 36px;
    }
    & > h2 {
      font-size: 20px;
    }
  }
`;

const Nav = styled.nav`
  /* float: right; */
  font-size: 28px;
  text-transform: lowercase;
  margin-top: var(--space-l);
  padding: 0;

  & ul {
    margin: 0;
  }

  & li {
    display: inline-block;

    & :not(:last-child) {
      margin-right: var(--space-l);
    }
  }

  & a {
    text-decoration: none;
  }

  & a.active {
    text-decoration: underline;
  }

  @media screen and (max-device-width: ${WIDTH}) {
    float: none;

    font-size: 24px;
    margin: var(--space-m) 0;

    & li {
      & :not(:last-child) {
        margin-right: 24px;
      }
    }
  }
`;

const Content = styled.section`
  clear: both;
`;

const Footer = styled.footer`
  margin-top: calc(var(--space-l) * 3);
`;
const Disclaimer = styled.p`
  font-size: 12px;
  opacity: 0.8;
`;
