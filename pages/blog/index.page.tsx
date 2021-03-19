import styled from '@emotion/styled';
import {differenceInYears, min as minDate} from 'date-fns';
import Link from 'next/link';
import React, {ReactElement} from 'react';
import DateText from '../../layouts/DateText';
import Layout from '../../layouts/Layout';
import {getAllPosts} from '../../lib/posts';

type Props = {
  posts: Array<{
    date: string;
    timestamp: number;
    title: string;
    url: string;
  }>;
};

export async function getStaticProps(): Promise<{
  props: Props;
}> {
  const posts = await getAllPosts();

  return {
    props: {
      posts: posts.map(p => ({
        // Pull out only the data needed
        date: p.date,
        timestamp: p.timestamp,
        title: p.title,
        url: p.url,
      })),
    },
  };
}

export default function BlogIndex({posts}: Props): ReactElement {
  const timestamps = posts.map(({timestamp}) => timestamp).filter(Boolean);
  const years = differenceInYears(new Date(), minDate(timestamps));

  return (
    <Layout title="Posts">
      <Subtitle>
        {posts.length} posts over {years} years
      </Subtitle>
      <Posts>
        {posts.map(({date, title, url}) => (
          <PostEntry key={url}>
            <Link href={url} passHref={true}>
              <PostLink>
                <PostTitle>{title || url}</PostTitle>
                <DateText>{date}</DateText>
              </PostLink>
            </Link>
          </PostEntry>
        ))}
      </Posts>
    </Layout>
  );
}

const Subtitle = styled.p`
  color: var(--text-color-secondary);
  font-size: var(--font-size-s);
`;

const Posts = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PostEntry = styled.li`
  margin: 0;
`;

const PostLink = styled.a`
  display: block;
  margin: var(--space-m) 0;
  text-decoration: none;

  @media screen and (max-device-width: 480px) {
    flex-direction: column;
  }
`;

const PostTitle = styled.div`
  font-size: 20px;
  font-weight: 300;

  a:hover & {
    text-decoration: underline;
  }
`;
