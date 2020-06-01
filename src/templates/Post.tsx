import styled from '@emotion/styled';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import React, {ReactElement, ReactNode} from 'react';
import DateText from './DateText';
import Layout from './Layout';

type Props = {
  children: ReactNode;
  pageContext?: {
    frontmatter: {
      date?: string;
      title?: string;
      type?: string;
    };
  };
};

export default function Post(props: Props): ReactElement {
  let title = '';
  let dateString;
  if (props.pageContext) {
    const {date, title: pageTitle, type} = props.pageContext.frontmatter;
    title = pageTitle;
    try {
      dateString = format(parseISO(date), 'yyyy-MM-dd');
    } catch {
      dateString = date;
    }
  }

  return (
    <Layout title={title}>
      {dateString && <DateText>Posted {dateString}</DateText>}
      <div className="markdown">{props.children}</div>
    </Layout>
  );
}

const Ingredient = styled.li`
  list-style-type: disc;
`;

const Direction = styled.li`
  list-style-type: decimal;
  margin-bottom: var(--grid-size);
`;
