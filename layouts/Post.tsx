import styled from '@emotion/styled';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import Link from 'next/link';
import React, {ReactElement, useEffect, useRef} from 'react';
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
      <article className="h-entry">
        <h1 className="p-name">{title}</h1>
        {dateString && (
          <DateText>
            Posted{' '}
            <time className="dt-published" dateTime={date}>
              {dateString}
            </time>
          </DateText>
        )}
        <div className="e-content markdown">{children}</div>
      </article>
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
      <Comments />
    </Layout>
  );
}

function Comments() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const scriptElement = document.createElement('script');
    scriptElement.async = true;
    scriptElement.crossOrigin = 'anonymous';
    scriptElement.src = 'https://utteranc.es/client.js';

    scriptElement.setAttribute('issue-term', 'pathname');
    scriptElement.setAttribute('label', 'comment');
    scriptElement.setAttribute('repo', 'ianobermiller/ianobermiller.com');
    scriptElement.setAttribute('theme', 'preferred-color-scheme');

    ref.current?.appendChild(scriptElement);
  }, []);

  return <div ref={ref} />;
}

const RelatedPosts = styled.ul`
  margin-top: var(--space-xl);
`;
