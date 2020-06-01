import styled from '@emotion/styled';
import {differenceInYears, min as minDate} from 'date-fns';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import {graphql, Link, useStaticQuery} from 'gatsby';
import React, {ReactElement} from 'react';
import DateText from '../../templates/DateText';
import Layout from '../../templates/Layout';
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
      <Subtitle>
        {posts.length} posts over {years} years
      </Subtitle>
      <Posts>
        {posts.map(({dateString, id, title, url}) => {
          return (
            <Post key={id}>
              <PostLink to={url}>
                <PostTitle>{title}</PostTitle>
                <DateText>{dateString}</DateText>
              </PostLink>
            </Post>
          );
        })}
      </Posts>
    </Layout>
  );
}

const Subtitle = styled.p`
  color: var(--text-color-secondary);
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
  display: block;
  margin: 32px 0;
  text-decoration: none;

  @media screen and (max-device-width: 480px) {
    flex-direction: column;
  }
`;

const PostTitle = styled.div`
  font-size: 24px;
  font-weight: 300;

  a:hover & {
    text-decoration: underline;
  }
`;
