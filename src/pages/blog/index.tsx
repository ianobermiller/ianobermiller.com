import React, {ReactElement} from 'react';
import {graphql, Link} from 'gatsby';
import Layout from '../../templates/Layout';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import styled from '@emotion/styled';

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
      <h1>Blog</h1>
      <Posts>
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
            <Post key={node.id}>
              <PostLink to={url}>
                <Date>{dateString}</Date>
                <Title>{title}</Title>
              </PostLink>
            </Post>
          );
        })}
      </Posts>
    </Layout>
  );
}

const Posts = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Post = styled.li`
  margin: 0;
`;
const PostLink = styled(Link)`
  align-items: baseline;
  display: flex;
  padding: 0.5em 0;

  :hover {
    text-decoration: none;
  }
`;
const Date = styled.div`
  color: #999;
  font-size: 75%;
  width: 90px;
`;
const Title = styled.span`
  a:hover & {
    text-decoration: underline;
  }
`;

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
