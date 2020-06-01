import {GatsbyNode} from 'gatsby';
import {resolve} from 'path';

export const createPages: GatsbyNode['createPages'] = async ({
  actions,
  graphql,
}) => {
  const {createPage} = actions;

  const allRecipes: {
    data?: {allFile: {nodes: {id: string; name: string}[]}};
  } = await graphql(`
    query AllRecipesQuery {
      allFile(filter: {relativeDirectory: {eq: "recipes"}}) {
        nodes {
          id
          name
        }
      }
    }
  `);

  allRecipes.data.allFile.nodes.forEach(({id, name}) => {
    if (name === 'index') return;

    createPage({
      path: `recipes/${name}`,
      component: resolve(__dirname, 'src/templates/Recipe.tsx'),
      context: {
        id,
      },
    });
  });
};
