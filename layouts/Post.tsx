import React, {ReactElement} from 'react';
import DateText from './DateText';
import Layout from './Layout';

type Props = {
  children: React.ReactNode;
  date: string;
  title: string;
};

export default function Post({children, date, title}: Props): ReactElement {
  return (
    <Layout title={title}>
      <article className="h-entry">
        <h1 className="p-name">{title}</h1>
        <DateText>
          Posted{' '}
          <time className="dt-published" dateTime={date}>
            {date}
          </time>
        </DateText>
        <div className="e-content markdown">{children}</div>
      </article>
    </Layout>
  );
}
