import styled from '@emotion/styled';
import {readFileSync} from 'fs';
import Layout from 'layouts/Layout';
import {getAllRecipes} from 'lib/recipes';
import Link from 'next/link';
import React, {ReactElement} from 'react';

export async function getStaticProps({params}) {
  const recipes = getAllRecipes()
    .map(({filePath, slug}) => {
      const fileContents = readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(fileContents);
      return {
        name: parsed.name,
        url: `/recipes/${slug}`,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  return {props: {recipes}};
}

export default function RecipesIndex({
  recipes,
}): ReactElement {
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
