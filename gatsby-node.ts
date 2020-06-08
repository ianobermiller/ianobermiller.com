import {Actions, CreatePagesArgs, GatsbyNode} from 'gatsby';
import {createFilePath} from 'gatsby-source-filesystem';
import path from 'path';

export const createPages: GatsbyNode['createPages'] = async ({
  actions,
  graphql,
}) => {
  const {createPage} = actions;
  await createRecipePages(graphql, createPage);
};

async function createRecipePages(
  graphql: CreatePagesArgs['graphql'],
  createPage: Actions['createPage'],
) {
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
      component: path.resolve('src/templates/Recipe.tsx'),
      context: {id},
    });
  });
}

// https://www.gatsbyjs.org/docs/mdx/programmatically-creating-pages/
export const onCreateNode: GatsbyNode['onCreateNode'] = ({
  node,
  actions,
  getNode,
}) => {
  const {createNodeField} = actions;
  if (node.internal.type === 'Mdx') {
    const value = createFilePath({node, getNode});
    createNodeField({
      name: 'slug',
      node,
      value: value,
    });
  }
};
