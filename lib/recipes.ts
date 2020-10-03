import {readdirSync, readFileSync} from 'fs';
import path from 'path';

const recipesDirectory = 'content/recipes';

export function getAllRecipes() {
  const fileNames = readdirSync(recipesDirectory);

  return fileNames
    .filter(fileName => fileName.endsWith('.json'))
    .map(fileName => ({
      slug: fileName.replace(/\.json$/, ''),
      filePath: path.join(recipesDirectory, fileName),
    }));
}

export function getRecipe(slug: string) {
  const fileContents = readFileSync(
    path.join(recipesDirectory, slug + '.json'),
    'utf8',
  );
  const parsed = JSON.parse(fileContents);
  return parsed;
}
