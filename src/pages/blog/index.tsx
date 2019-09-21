import React, {ReactElement} from 'react';
import {graphql, Link} from 'gatsby';
import Layout from '../../templates/Layout';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface Props {
  data: {
    allMdx: {
      edges: [
        {
          node: {
            id: string;
            fileAbsolutePath: string;
            frontmatter: {
              date: string;
              title: string;
            };
          };
        },
      ];
    };
  };
}

export default function BlogIndex({data}: Props): ReactElement {
  const {edges: posts} = data.allMdx;
  return (
    <Layout>
      <h1>Posts</h1>
      <ul>
        {posts.map(({node}) => {
          const {date, title} = node.frontmatter;
          const url = node.fileAbsolutePath
            .replace(/.*\/blog\//, '/blog/')
            .replace('.mdx', '');
          let dateString;
          try {
            dateString = format(parseISO(date), 'yyyy-MM-dd');
          } catch {
            dateString = date;
          }
          return (
            <li key={node.id}>
              <Link to={url}>
                {dateString} {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
}

export const pageQuery = graphql`
  query blogIndex {
    allMdx(
      sort: {order: DESC, fields: [frontmatter___date]}
      limit: 1000
      filter: {frontmatter: {type: {eq: "post"}}}
    ) {
      edges {
        node {
          id
          fileAbsolutePath
          frontmatter {
            title
            date
          }
        }
      }
    }
  }
`;
