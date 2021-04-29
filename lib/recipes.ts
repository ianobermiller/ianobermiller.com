import {readdirSync, readFileSync} from 'fs';
import path from 'path';

const RECIPES_DIRECTORY = 'content/recipes/';

export interface RecipeEntry {
  filePath: string;
  slug: string;
}

export function getRecipeEntries(): Array<RecipeEntry> {
  const fileNames = readdirSync(RECIPES_DIRECTORY);

  return fileNames
    .filter(fileName => fileName.endsWith('.json'))
    .map(fileName => ({
      slug: fileName.replace(/\.json$/, ''),
      filePath: path.join(RECIPES_DIRECTORY, fileName),
    }));
}

export interface Recipe {
  name: string;
  description: string;
  ingredientGroups: Array<{
    ingredients: Array<string>;
    name: string;
  }>;
  directions: Array<string>;
}

export function getRecipe(slug: string): Recipe {
  const fileContents = readFileSync(
    path.join(RECIPES_DIRECTORY, slug + '.json'),
    'utf8',
  );
  const parsed = JSON.parse(fileContents);
  return parsed;
}

export function getAllRecipesNameAndURL(): Array<{
  name: string;
  url: string;
}> {
  return getRecipeEntries()
    .map(({slug}) => {
      const recipe = getRecipe(slug);
      return {
        name: recipe.name,
        url: `/recipes/${slug}`,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
