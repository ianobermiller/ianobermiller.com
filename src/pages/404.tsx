import {graphql, Link} from 'gatsby';
import * as React from 'react';
import Layout from '../templates/Layout';

type Props = {
  data: {
    allSitePage: {
      nodes: Array<{path: string}>;
    };
  };
};

export default function NotFoundPage(props: Props) {
  return (
    <Layout title="Not Found">
      <div>
        <h1>NOT FOUND</h1>
        <p>
          Oh, this is embarassing. We couldn't find the page you're looking for.
          Perhaps you were looking for one of these?
        </p>
        <ul>
          {props.data.allSitePage.nodes.map(({path}) => (
            <li>
              <Link to={path}>{path}</Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export const pageQuery = graphql`
  query NotFoundQuery {
    allSitePage(sort: {fields: path}) {
      nodes {
        path
      }
    }
  }
`;
