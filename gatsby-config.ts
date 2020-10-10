import {GatsbyConfig} from 'gatsby';
import type {PluginOptions as TypegenPluginOptions} from 'gatsby-plugin-typegen/types';

type Plugin =
  | string
  | {resolve: string; options: object}
  | {
      resolve: `gatsby-plugin-typegen`;
      options: TypegenPluginOptions;
    };

export const siteMetadata = {
  title: 'Ian Obermiller',
  siteUrl: 'https://ianobermiller.com',
};

type SerializeArgs = {
  query: {
    site: GatsbyConfig;
    allMdx: {
      nodes: [
        {
          fields: {
            slug: string;
          };
          frontmatter: {
            date: string;
            title: string;
          };
        },
      ];
    };
  };
};

export const plugins: Array<Plugin> = [
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-emotion',
  'gatsby-plugin-typescript',
  {
    resolve: 'gatsby-plugin-feed',
    options: {
      query: `
          {
            site {
              siteMetadata {
                title
                siteUrl
              }
            }
          }
        `,
      feeds: [
        {
          serialize: ({
            query: {site, allMdx},
          }: SerializeArgs) => {
            return allMdx.nodes.map(node => {
              return Object.assign({}, node.frontmatter, {
                description: node.frontmatter.title,
                date: node.frontmatter.date,
                url:
                  site.siteMetadata.siteUrl +
                  node.fields.slug,
              });
            });
          },
          query: `
            {
              allMdx(
                sort: {order: DESC, fields: [frontmatter___date]}
                limit: 1000
                filter: {fields: {type: {eq: "post"}}}
              ) {
                nodes {
                  id
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                    date
                  }
                }
              }
            }
          `,
          output: '/rss.xml',
          title: "Ian Obermiller's RSS Feed",
        },
      ],
    },
  },
  'gatsby-transformer-json',
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'content',
      path: `${__dirname}/src/content`,
    },
  },
  'gatsby-plugin-sharp',
  {
    resolve: 'gatsby-plugin-mdx',
    options: {
      gatsbyRemarkPlugins: [
        {
          resolve: 'gatsby-remark-images',
          options: {
            maxWidth: 680,
          },
        },
        {
          resolve: 'gatsby-remark-table-of-contents',
          options: {
            className: 'table-of-contents',
            exclude: 'Contents',
          },
        },
        'gatsby-remark-autolink-headers',
        'gatsby-remark-prismjs',
      ],
      // https://github.com/gatsbyjs/gatsby/issues/15486#issuecomment-510153237
      plugins: [
        'gatsby-remark-images',
        'gatsby-remark-prismjs',
      ],
    },
  },
  'gatsby-plugin-sass',
  'gatsby-plugin-sitemap',
  {
    resolve: 'gatsby-plugin-typegen',
    options: {
      emitSchema: {
        'src/__generated__/gatsby-introspection.json': true,
      },
      emitPluginDocuments: {
        'src/__generated__/gatsby-plugin-documents.graphql': true,
      },
    },
  },
  'gatsby-plugin-webpack-bundle-analyser-v2',
];
