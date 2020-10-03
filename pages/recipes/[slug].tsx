import styled from '@emotion/styled';
import Layout from 'layouts/Layout';
import {getAllRecipes, getRecipe} from 'lib/recipes';
import React, {ReactElement} from 'react';

type Props = {
  recipe: {
    name: string;
    description: string;
    ingredientGroups: Array<{
      ingredients: Array<string>;
      name: string;
    }>;
    directions: Array<string>;
  };
};

export async function getStaticPaths() {
  const ids = getAllRecipes();
  return {
    paths: ids.map(({slug}) => ({params: {slug}})),
    fallback: false,
  };
}

export function getStaticProps({params}): {props: Props} {
  const recipe = getRecipe(params.slug);
  return {props: {recipe}};
}

export default function Recipe({
  recipe,
}: Props): ReactElement {
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
              <Ingredient key={index}>
                {ingredient}
              </Ingredient>
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
