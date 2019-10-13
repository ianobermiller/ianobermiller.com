import styled from '@emotion/styled';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import Link from 'gatsby-link';
import React, {ReactElement, ReactNodeArray} from 'react';
import Helmet from 'react-helmet';
import DateText from './DateText';

import './reset.css';
import './layout.scss';

const GRID_SIZE = 32;

interface Props {
  children: ReactNodeArray;
  pageContext?: {
    frontmatter: {
      date?: string;
      title?: string;
      type?: string;
    };
  };
}

export default function Layout(props: Props): ReactElement {
  let title = '';
  let isPost;
  let dateString;
  let isMarkdown = false;
  if (props.pageContext) {
    const {date, title: pageTitle, type} = props.pageContext.frontmatter;
    title = pageTitle;
    isPost = type === 'post';
    isMarkdown = !!type;
    try {
      dateString = format(parseISO(date), 'yyyy-MM-dd');
    } catch {
      dateString = date;
    }
  }

  return (
    <Root>
      <Helmet htmlAttributes={{lang: 'en'}}>
        <title>{(title ? title + ' \u00AB ' : '') + 'Ian Obermiller'}</title>
        <meta
          name="Description"
          content="Personal site of Christian and software engineer Ian Obermiller."
        ></meta>
      </Helmet>

      <Header>
        <h1>
          <Link to="/">Ian Obermiller</Link>
        </h1>
        <h2>Part time hacker, full time dad.</h2>
      </Header>

      <Nav>
        <ul>
          <li>
            <Link activeClassName="active" to="/">
              About Me
            </Link>
          </li>
          <li>
            <Link activeClassName="active" partiallyActive={true} to="/blog">
              posts
            </Link>
          </li>
        </ul>
      </Nav>

      <Content className={`${isMarkdown ? 'markdown' : ''}`}>
        {isPost && title && <h1>{title}</h1>}
        {isPost && dateString && <DateText>Posted {dateString}</DateText>}
        {props.children}
      </Content>

      <Footer>
        Unless otherwise noted, source code on this blog is Licensed under the
        MIT License.
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
  padding: ${GRID_SIZE}px;
  position: relative;
`;

const Header = styled.header`
  float: left;
  display: block;
  text-transform: lowercase;

  & > h1 {
    font-size: 48px;
    margin: 0;
  }

  & > h2 {
    color: #333;
    font-size: 24px;
    margin-top: 0;
  }

  @media (prefers-color-scheme: dark) {
    & > h2 {
      color: #ddd;
    }
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
  float: right;
  font-size: 28px;
  text-transform: lowercase;
  margin: 0 0 0 0;
  padding: 0;

  & ul {
    margin: 0;
  }

  & li {
    display: inline-block;

    & :not(:last-child) {
      margin-right: 48px;
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
    margin: 10px 0;

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
  font-size: 12px;
  margin-top: ${GRID_SIZE * 2}px;
  opacity: 0.8;
`;
