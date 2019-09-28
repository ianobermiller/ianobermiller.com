import styled from '@emotion/styled';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import {graphql, Link, useStaticQuery} from 'gatsby';
import React, {ReactElement} from 'react';
import DateText from '../../templates/DateText';
import Layout from '../../templates/Layout';
import {max as maxDate, differenceInYears, min as minDate} from 'date-fns';
import {getBlogPostUrl} from '../../utils';

interface Data {
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
}

export default function BlogIndex(): ReactElement {
  const {
    allMdx: {edges},
  } = useStaticQuery<Data>(graphql`
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
  `);

  const posts = edges.map(({node}) => {
    let date;
    let dateString;
    try {
      date = parseISO(node.frontmatter.date);
      dateString = format(date, 'yyyy-MM-dd');
    } catch {
      dateString = date;
    }

    return {
      id: node.id,
      url: getBlogPostUrl(node),
      title: node.frontmatter.title,
      date,
      dateString,
    };
  });

  const dates = posts.map(({date}) => date).filter(Boolean);
  const years = differenceInYears(new Date(), minDate(dates));

  return (
    <Layout>
      <h1>Blog</h1>
      <Subtitle>
        {posts.length} posts over {years} years
      </Subtitle>
      <Posts>
        {posts.map(({dateString, id, title, url}) => {
          return (
            <Post key={id}>
              <PostLink to={url}>
                <PostDate>{dateString}</PostDate>
                <Title>{title}</Title>
              </PostLink>
            </Post>
          );
        })}
      </Posts>
    </Layout>
  );
}

const Subtitle = styled.p`
  color: #ccc;
  font-size: 75%;
`;

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
  padding: 8px 0;

  :hover {
    text-decoration: none;
  }
`;

const PostDate = styled(DateText)`
  width: 90px;
`;

const Title = styled.span`
  a:hover & {
    text-decoration: underline;
  }
`;
