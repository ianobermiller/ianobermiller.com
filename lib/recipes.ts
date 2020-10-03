import {readdirSync} from 'fs';
import path from 'path';

const recipesDirectory = 'pages/recipes';

export function getAllRecipes() {
  const fileNames = readdirSync(recipesDirectory);

  return fileNames
    .filter(fileName => fileName.endsWith('.json'))
    .map(fileName => ({
      slug: fileName.replace(/\.json$/, ''),
      filePath: path.join(recipesDirectory, fileName),
    }));
}
