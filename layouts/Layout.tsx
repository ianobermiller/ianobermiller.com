import styled from '@emotion/styled';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {ReactElement, ReactNode} from 'react';
import ColorSchemePicker from './ColorSchemePicker';

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
      <Head>
        <title>
          {(title ? title + ' \u00AB ' : '') +
            'Ian Obermiller'}
        </title>
        <meta
          name="Description"
          content="Personal site of Christian and software engineer Ian Obermiller."
        />
      </Head>

      <Header>
        <h1>
          <Link href="/">
            <a rel="me">Ian Obermiller</a>
          </Link>
        </h1>
        <h2>Part time hacker, full time dad.</h2>
      </Header>

      <ColorSchemePicker />

      <Nav>
        <ul>
          <li>
            <NavLink href="/">About Me</NavLink>
          </li>
          <li>
            <NavLink partial={true} href="/blog">
              Posts
            </NavLink>
          </li>
          <li>
            <NavLink partial={true} href="/recipes">
              Recipes
            </NavLink>
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

function NavLink({
  children,
  href,
  partial,
}: {
  children: ReactNode;
  href: string;
  partial?: boolean;
}): ReactElement {
  const router = useRouter();

  const isActive =
    router.pathname === href ||
    (partial && router.pathname.startsWith(href));

  return (
    <Link href={href}>
      <a className={isActive ? 'active' : null}>
        {children}
      </a>
    </Link>
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
