import {readdirSync, readFileSync} from 'fs';
import path from 'path';

const recipesDirectory = 'content/recipes';

export interface RecipeEntry {
  filePath: string;
  slug: string;
}

export function getRecipeEntries(): Array<RecipeEntry> {
  const fileNames = readdirSync(recipesDirectory);

  return fileNames
    .filter(fileName => fileName.endsWith('.json'))
    .map(fileName => ({
      slug: fileName.replace(/\.json$/, ''),
      filePath: path.join(recipesDirectory, fileName),
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
    path.join(recipesDirectory, slug + '.json'),
    'utf8',
  );
  const parsed = JSON.parse(fileContents);
  return parsed;
}
