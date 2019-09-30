import styled from '@emotion/styled';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import Link from 'gatsby-link';
import React, {ReactElement, ReactNodeArray} from 'react';
import Helmet from 'react-helmet';
import './reset.css';
import './layout.css';
import DateText from './DateText';

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
      <Helmet
        htmlAttributes={{lang: 'en'}}
        title={(title ? title + ' \u00AB ' : '') + 'Ian Obermiller'}
      />

      <Header>
        <h1>
          <a href="/">Ian Obermiller</a>
        </h1>
        <h2>Part time hacker, full time dad.</h2>
      </Header>

      <Nav>
        <ul>
          <li>
            <Link activeClassName="active" to="/">
              About
            </Link>
          </li>
          <li>
            <Link activeClassName="active" partiallyActive={true} to="/blog">
              Blog
            </Link>
          </li>
          <li>
            <Link
              activeClassName="active"
              partiallyActive={true}
              to="/projects"
            >
              Projects
            </Link>
          </li>
        </ul>
      </Nav>

      <section className={`content ${isMarkdown ? 'markdown' : ''}`}>
        {isPost && title && <h1>{title}</h1>}
        {isPost && dateString && <DateText>Posted {dateString}</DateText>}
        {props.children}
      </section>

      <footer>
        Unless otherwise noted, source code on this blog is Licensed under the
        MIT License.
      </footer>
    </Root>
  );
}

const Root = styled.main`
  box-sizing: border-box;
  clear: both;
  margin: 0 auto;
  max-width: 720px;
  min-height: 100vh;
  padding: 20px;
  position: relative;
`;

const Header = styled.header`
  float: left;
  display: block;
  margin: 0 0 25px 0;
  text-transform: lowercase;

  & > h1 {
    font-size: 48px;
    margin: 0;
  }

  & > h2 {
    color: #333;
    font-size: 24px;
  }

  @media screen and (max-device-width: 480px) {
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
  margin: 8px 0 0 0;
  padding: 0;

  & ul {
    margin: 0;
  }

  & li {
    display: inline-block;
    margin-left: 50px;
  }

  & li:first-child {
    margin-left: 0;
  }

  & a {
    color: #ba5712;
    text-decoration: none;
  }

  & a.active {
    color: #ba5712;
    text-decoration: underline;
  }

  & a:hover {
    color: #8b410e;
  }

  @media screen and (max-device-width: 480px) {
    float: none;

    font-size: 24px;
    margin: 10px 0;

    & li {
      margin-left: 25px;
    }

    & li:first-child {
      margin-left: 0;
    }
  }
`;
