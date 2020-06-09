import {Actions, CreatePagesArgs, GatsbyNode} from 'gatsby';
import {createFilePath} from 'gatsby-source-filesystem';
import path from 'path';

export const createPages: GatsbyNode['createPages'] = async ({
  actions,
  graphql,
}) => {
  const {createPage} = actions;
  await createComponentPages(graphql, createPage);
  await createMdxPages(graphql, createPage);
  await createBlogPosts(graphql, createPage);
  await createRecipePages(graphql, createPage);
};

async function createComponentPages(
  graphql: CreatePagesArgs['graphql'],
  createPage: Actions['createPage'],
) {
  const result: {
    data?: {
      allFile: {
        nodes: {
          absolutePath: string;
          id: string;
          relativeDirectory: string;
        }[];
      };
    };
  } = await graphql(`
    query ComponentPagesQuery {
      allFile(filter: {extension: {eq: "tsx"}, name: {eq: "index"}}) {
        nodes {
          absolutePath
          id
          relativeDirectory
        }
      }
    }
  `);

  const posts = result.data.allFile.nodes;
  posts.forEach(({absolutePath, id, relativeDirectory}, index) => {
    createPage({
      path: relativeDirectory,
      component: absolutePath,
      context: {id},
    });
  });
}

async function createMdxPages(
  graphql: CreatePagesArgs['graphql'],
  createPage: Actions['createPage'],
) {
  const result: {
    data?: {
      allMdx: {
        nodes: {
          id: string;
          fields: {slug: string};
          frontmatter: {title: string; date: string};
        }[];
      };
    };
  } = await graphql(`
    query {
      allMdx(filter: {fields: {type: {eq: "page"}}}) {
        nodes {
          id
          fields {
            slug
          }
        }
      }
    }
  `);

  const posts = result.data.allMdx.nodes;
  posts.forEach(({fields: {slug}, id}, index) => {
    createPage({
      path: slug,
      component: path.resolve('./src/templates/MdxPage.tsx'),
      context: {id},
    });
  });
}

async function createBlogPosts(
  graphql: CreatePagesArgs['graphql'],
  createPage: Actions['createPage'],
) {
  const result: {
    data?: {
      allMdx: {
        nodes: {
          id: string;
          fields: {slug: string};
          frontmatter: {title: string; date: string};
        }[];
      };
    };
  } = await graphql(`
    query BlogPostsQuery {
      allMdx(filter: {fields: {type: {eq: "post"}}}) {
        nodes {
          id
          fields {
            slug
          }
        }
      }
    }
  `);

  const posts = result.data.allMdx.nodes;
  posts.forEach(({fields: {slug}, id}, index) => {
    createPage({
      path: slug,
      component: path.resolve('./src/templates/Post.tsx'),
      context: {id},
    });
  });
}

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
    const slug = createFilePath({node, getNode});
    createNodeField({
      name: 'slug',
      node,
      value: slug,
    });
    createNodeField({
      name: 'type',
      node,
      value: slug.startsWith('/blog/') ? 'post' : 'page',
    });
  }
};
