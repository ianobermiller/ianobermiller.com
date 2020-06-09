import {graphql} from 'gatsby';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import React, {ReactElement} from 'react';
import Layout from './Layout';

type Props = {
  data: {
    mdx: {
      body: string;
    };
  };
};

export default function MdxPage(props: Props): ReactElement {
  return (
    <Layout>
      <div className="markdown">
        <MDXRenderer>{props.data.mdx.body}</MDXRenderer>
      </div>
    </Layout>
  );
}

export const pageQuery = graphql`
  query MdxPageQuery($id: String) {
    mdx(id: {eq: $id}) {
      id
      body
    }
  }
`;
