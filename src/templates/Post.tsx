import styled from '@emotion/styled';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import {graphql, Link} from 'gatsby';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import React, {ReactElement} from 'react';
import DateText from './DateText';
import Layout from './Layout';

type Props = {
  data: {
    mdx: {
      body: string;
      frontmatter: {
        date: string;
        title: string;
      };
    };
  };
  pageContext: {
    relatedPosts: Array<{
      name: string;
      title: string;
      slug: string;
    }>;
  };
};

export default function Post(props: Props): ReactElement {
  const {date, title} = props.data.mdx.frontmatter;
  let dateString;
  try {
    dateString = format(parseISO(date), 'yyyy-MM-dd');
  } catch {
    dateString = date;
  }

  return (
    <Layout title={title}>
      {dateString && <DateText>Posted {dateString}</DateText>}
      <div className="markdown">
        <MDXRenderer>{props.data.mdx.body}</MDXRenderer>
      </div>
      <RelatedPosts>
        {props.pageContext.relatedPosts.map(({name, title, slug}) => (
          <li>
            {name}: <Link to={slug}>{title}</Link>
          </li>
        ))}
      </RelatedPosts>
    </Layout>
  );
}

const RelatedPosts = styled.ul`
  margin-top: var(--space-xl);
`;

export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: {eq: $id}) {
      id
      body
      frontmatter {
        title
        date
      }
    }
  }
`;
