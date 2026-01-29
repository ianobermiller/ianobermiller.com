import styled from '@emotion/styled';
import React, {ReactElement, useState} from 'react';
import Layout from '../../layouts/Layout';
import type {Recipe} from '../../lib/recipes';
import {getRecipe, getRecipeEntries} from '../../lib/recipes';
import {scaleIngredient} from '../../lib/recipeScaling';

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

export function getStaticProps({params}: {params: {slug: string}}): {
  props: Props;
} {
  const recipe = getRecipe(params.slug);
  return {props: {recipe}};
}

export default function RecipePage({recipe}: Props) {
  const [scale, setScale] = useState(1);

  return (
    <Layout title={recipe.name}>
      <h1>{recipe.name}</h1>
      {recipe.image && (
        <RecipeImage
          src={recipe.image}
          alt={recipe.name}
          width={800}
          height={600}
        />
      )}
      {recipe.description && (
        <p>
          <i>{recipe.description}</i>
        </p>
      )}
      {recipe.servings && (
        <ServingsText>
          <strong>Servings:</strong> {scaleIngredient(recipe.servings, scale)}
        </ServingsText>
      )}
      <h2>Ingredients</h2>
      <ScaleButtonGroup>
        <ScaleLabel>Scale:</ScaleLabel>
        {[1, 2, 3, 4].map(scaleValue => (
          <ScaleButton
            key={scaleValue}
            isActive={scale === scaleValue}
            onClick={() => setScale(scaleValue)}>
            {scaleValue}x
          </ScaleButton>
        ))}
      </ScaleButtonGroup>
      {recipe.ingredientGroups.map((group, index) => (
        <div key={index}>
          {group.name ? <h3>{group.name}</h3> : null}
          <ul>
            {group.ingredients.map((ingredient, index) => (
              <Ingredient key={index}>
                {scaleIngredient(ingredient, scale)}
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
      {recipe.notes && recipe.notes.length > 0 && (
        <>
          <h2>Notes</h2>
          <ul>
            {recipe.notes.map((note, index) => (
              <Note key={index}>{note}</Note>
            ))}
          </ul>
        </>
      )}
      {recipe.source ? (
        <p>
          Adapated from{' '}
          {recipe.source.url ? (
            <a rel="noopener noreferrer" href={recipe.source.url}>
              {recipe.source.name}.
            </a>
          ) : (
            <span>{recipe.source.name}.</span>
          )}
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

const Note = styled.li`
  list-style-type: disc;
  margin-bottom: var(--space-s);
  margin-left: var(--space-l);
`;

const ServingsText = styled.p`
  margin: var(--space-m) 0;
  color: var(--text-color-secondary);
`;

const ScaleButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: var(--space-m);
  align-items: center;
`;

const ScaleLabel = styled.span`
  font-weight: 500;
  margin-right: 4px;
`;

const ScaleButton = styled.button<{isActive: boolean}>`
  background: ${props =>
    props.isActive ? 'var(--accent-color)' : 'var(--background-color)'};
  border: 2px solid var(--accent-color);
  color: ${props =>
    props.isActive ? 'var(--background-color)' : 'var(--accent-color)'};
  cursor: pointer;
  font-size: var(--font-size-m);
  font-weight: ${props => (props.isActive ? '500' : '400')};
  padding: 4px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.isActive
        ? 'var(--accent-color-hover)'
        : 'var(--accent-color-quote)'};
    border-color: var(--accent-color-hover);
  }

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;

const RecipeImage = styled.img`
  width: 100%;
  max-width: 600px;
  max-height: 400px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  margin: var(--space-l) 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
