import styled from '@emotion/styled';
import React, {ReactElement} from 'react';
import Layout from '../../layouts/Layout';
import type {Recipe} from '../../lib/recipes';
import {getRecipe, getRecipeEntries} from '../../lib/recipes';

type Props = {
  recipe: Recipe;
};

export async function getStaticPaths() {
  const ids = getRecipeEntries();
  return {
    paths: ids.map(({slug}) => ({params: {slug}})),
    fallback: false,
  };
}

export function getStaticProps({params}): {props: Props} {
  const recipe = getRecipe(params.slug);
  return {props: {recipe}};
}

export default function RecipePage({recipe}: Props): ReactElement {
  return (
    <Layout title={recipe.name}>
      <h1>{recipe.name}</h1>
      {recipe.description && (
        <p>
          <i>{recipe.description}</i>
        </p>
      )}
      <h2>Ingredients</h2>
      {recipe.ingredientGroups.map((group, index) => (
        <div key={index}>
          {group.name ? <h3>{group.name}</h3> : null}
          <ul>
            {group.ingredients.map((ingredient, index) => (
              <Ingredient key={index}>{ingredient}</Ingredient>
            ))}
          </ul>
        </div>
      ))}
      <h2>Directions</h2>
      <ol>
        {recipe.directions.map((direction, index) => (
          <Direction key={index}>{direction}</Direction>
        ))}
      </ol>
      {recipe.source ? (
        <p>
          Adapated from{' '}
          <a rel="noopener noreferrer" href={recipe.source.url}>
            {recipe.source.name}.
          </a>
        </p>
      ) : null}
    </Layout>
  );
}

const Ingredient = styled.li`
  list-style-type: disc;
  margin-left: var(--space-l);
`;

const Direction = styled.li`
  list-style-type: decimal;
  margin-bottom: var(--space-m);
  margin-left: var(--space-l);
`;
