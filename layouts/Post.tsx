import styled from '@emotion/styled';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import React, {ReactElement} from 'react';
import DateText from './DateText';
import Layout from './Layout';

type Props = {
  children: React.ReactNode;
  date: string;
  title: string;
};

export default function Post({
  children,
  date,
  title,
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
      {/* <RelatedPosts>
        {props.pageContext.relatedPosts.map(
          ({name, title, slug}) => (
            <li key={slug}>
              {name}: <Link to={slug}>{title}</Link>
            </li>
          ),
        )}
      </RelatedPosts> */}
    </Layout>
  );
}

const RelatedPosts = styled.ul`
  margin-top: var(--space-xl);
`;
