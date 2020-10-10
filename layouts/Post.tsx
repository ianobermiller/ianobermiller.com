import styled from '@emotion/styled';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import Link from 'next/link';
import React, {ReactElement} from 'react';
import DateText from './DateText';
import Layout from './Layout';
import {RelatedPost} from './postData';

type Props = {
  children: React.ReactNode;
  metadata: {
    date: string;
    title: string;
  };
  relatedPosts: Array<RelatedPost>;
};

export default function Post({
  children,
  metadata: {date, title},
  relatedPosts,
}: Props): ReactElement {
  let dateString;
  try {
    dateString = format(parseISO(date), 'yyyy-MM-dd');
  } catch {
    dateString = date;
  }

  return (
    <Layout title={title}>
      <h1>{title}</h1>
      {dateString && (
        <DateText>Posted {dateString}</DateText>
      )}
      <div className="markdown">{children}</div>
      <RelatedPosts>
        {relatedPosts.map(({name, title, url}) => (
          <li key={url}>
            {name}:{' '}
            <Link href={url}>
              <a>{title}</a>
            </Link>
          </li>
        ))}
      </RelatedPosts>
    </Layout>
  );
}

const RelatedPosts = styled.ul`
  margin-top: var(--space-xl);
`;
