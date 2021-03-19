import styled from '@emotion/styled';
import Link from 'next/link';
import React, {ReactElement} from 'react';
import Layout from '../../layouts/Layout';
import {getAllRecipesNameAndURL} from '../../lib/recipes';

export async function getStaticProps({params}) {
  return {props: {recipes: getAllRecipesNameAndURL()}};
}

export default function RecipesIndex({recipes}): ReactElement {
  return (
    <Layout title="Recipes">
      <Subtitle>{recipes.length} recipes</Subtitle>
      <ul>
        {recipes.map(({name, url}, index) => {
          return (
            <Recipe key={index}>
              <Link href={url} passHref={true}>
                <RecipeLink>{name}</RecipeLink>
              </Link>
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

const RecipeLink = styled.a`
  font-size: 20px;
  font-weight: 300;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`;
