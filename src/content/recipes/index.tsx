import styled from '@emotion/styled';
import {graphql, Link, useStaticQuery} from 'gatsby';
import React, {ReactElement} from 'react';
import Layout from '../../templates/Layout';

interface Data {
  allFile: {
    nodes: [
      {
        name: string;
        childRecipesJson: {
          description: string;
          name: string;
        };
      },
    ];
  };
}

export default function RecipesIndex(): ReactElement {
  const {
    allFile: {nodes},
  } = useStaticQuery<Data>(graphql`
    query recipesIndex {
      allFile(filter: {relativeDirectory: {eq: "recipes"}}) {
        nodes {
          name
          childRecipesJson {
            name
          }
        }
      }
    }
  `);

  const recipes = nodes
    .filter(node => node.name !== 'index')
    .map(node => {
      return {
        name: node.childRecipesJson?.name,
        url: `/recipes/${node.name}`,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Layout title="Recipes">
      <Subtitle>{recipes.length} recipes</Subtitle>
      <ul>
        {recipes.map(({name, url}, index) => {
          return (
            <Recipe key={index}>
              <RecipeLink to={url}>{name}</RecipeLink>
            </Recipe>
          );
        })}
      </ul>
    </Layout>
  );
}

const Subtitle = styled.p`
  color: var(--text-color-secondary);
  font-size: var(--font-size-s);
`;

const Recipe = styled.li`
  margin: var(--space-m) 0;
`;

const RecipeLink = styled(Link)`
  font-size: 20px;
  font-weight: 300;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`;
