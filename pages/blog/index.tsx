import styled from '@emotion/styled';
import {
  differenceInYears,
  min as minDate,
  parseISO,
} from 'date-fns';
import DateText from 'layouts/DateText';
import Layout from 'layouts/Layout';
import Link from 'next/link';
import React, {ReactElement} from 'react';

type Post = {
  date: string;
  timestamp: number;
  title: string;
  url: string;
};
type Props = {
  posts: Array<Post>;
};

export async function getStaticProps(): Promise<{
  props: Props;
}> {
  // https://www.smashingmagazine.com/2020/09/build-blog-nextjs-mdx/
  const mdxRequire = require.context(
    '.',
    /*includeSubdirs*/ true,
    /\.mdx$/,
  );

  const posts: Array<Post> = mdxRequire
    .keys()
    .map(fileName => {
      const slug = fileName
        .substr(1)
        .replace(/\.mdx$/, '')
        .replace(/\/index$/, '');
      const {metadata = {date: '', title: ''}} = mdxRequire(
        fileName,
      );

      return {
        url: '/blog' + slug,
        title: metadata.title,
        date: metadata.date,
        timestamp: parseISO(metadata.date).getTime(),
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  return {
    props: {posts},
  };
}

export default function BlogIndex({
  posts,
}: Props): ReactElement {
  const timestamps = posts
    .map(({timestamp}) => timestamp)
    .filter(Boolean);
  const years = differenceInYears(
    new Date(),
    minDate(timestamps),
  );

  return (
    <Layout title="Posts">
      <Subtitle>
        {posts.length} posts over {years} years
      </Subtitle>
      <Posts>
        {posts.map(({date, title, url}) => (
          <Post key={url}>
            <Link href={url} passHref={true}>
              <PostLink>
                <PostTitle>{title || url}</PostTitle>
                <DateText>{date}</DateText>
              </PostLink>
            </Link>
          </Post>
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

const Post = styled.li`
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
