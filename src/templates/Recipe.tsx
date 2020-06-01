import styled from '@emotion/styled';
import {graphql} from 'gatsby';
import React, {ReactElement} from 'react';
import Layout from './Layout';

type Props = {
  data: {
    file: {
      childRecipesJson: {
        description: string | null;
        directions: string[];
        id: string;
        ingredientGroups: {
          name: string;
          ingredients: string[];
        }[];
        name: string;
        servings: string;
        time: {
          prep: string;
          total: string;
        };
      };
    };
  };
};

export default function Recipe(props: Props): ReactElement {
  const recipe = props.data.file.childRecipesJson;
  return (
    <Layout title={recipe.name}>
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
    </Layout>
  );
}

const Ingredient = styled.li`
  list-style-type: disc;
`;

const Direction = styled.li`
  list-style-type: decimal;
  margin-bottom: var(--space-l);
`;

export const pageQuery = graphql`
  query RecipeQuery($id: String) {
    file(id: {eq: $id}) {
      childRecipesJson {
        description
        directions
        id
        ingredientGroups {
          ingredients
          name
        }
        name
        servings
        time {
          prep
          total
        }
      }
    }
  }
`;
