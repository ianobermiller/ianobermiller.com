import styled from '@emotion/styled';
import Link from 'next/link';
import React, {ReactElement} from 'react';
import Layout from '../../layouts/Layout';
import {getAllRecipesGroupedByCategory} from '../../lib/recipes';

export async function getStaticProps() {
  return {props: {recipesByCategory: getAllRecipesGroupedByCategory()}};
}

export default function RecipesIndex({recipesByCategory}): ReactElement {
  const categories = Object.keys(recipesByCategory).sort();
  const totalRecipes = categories.reduce(
    (sum, cat) => sum + recipesByCategory[cat].length,
    0,
  );

  return (
    <Layout title="Recipes">
      <Subtitle>{totalRecipes} recipes</Subtitle>
      {categories.map(category => (
        <CategorySection key={category}>
          <CategoryTitle>{category}</CategoryTitle>
          <ul>
            {recipesByCategory[category].map(({name, url}, index) => {
              return (
                <Recipe key={index}>
                  <RecipeLink as={Link} href={url}>
                    {name}
                  </RecipeLink>
                </Recipe>
              );
            })}
          </ul>
        </CategorySection>
      ))}
    </Layout>
  );
}

const Subtitle = styled.p`
  color: var(--text-color-secondary);
  font-size: var(--font-size-s);
`;

const CategorySection = styled.section`
  margin: var(--space-xl) 0;
`;

const CategoryTitle = styled.h2`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: var(--space-m);
  color: var(--text-color);
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
