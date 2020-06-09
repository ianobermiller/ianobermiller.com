import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import {graphql} from 'gatsby';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import React, {ReactElement} from 'react';
import DateText from './DateText';
import Layout from './Layout';

type Props = {
  data: {
    mdx: {
      body: string;
      frontmatter: {
        date: string;
        title: string;
      };
    };
  };
};

export default function Post(props: Props): ReactElement {
  const {date, title} = props.data.mdx.frontmatter;
  let dateString;
  try {
    dateString = format(parseISO(date), 'yyyy-MM-dd');
  } catch {
    dateString = date;
  }

  return (
    <Layout title={title}>
      {dateString && <DateText>Posted {dateString}</DateText>}
      <div className="markdown">
        <MDXRenderer>{props.data.mdx.body}</MDXRenderer>
      </div>
    </Layout>
  );
}

export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: {eq: $id}) {
      id
      body
      frontmatter {
        title
        date
      }
    }
  }
`;
