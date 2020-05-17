import {GatsbyConfig} from 'gatsby';
import {getBlogPostUrl} from './src/utils';

export const siteMetadata = {
  title: 'Ian Obermiller',
  siteUrl: 'https://ianobermiller.com',
};

type SerializeArgs = {
  query: {
    site: GatsbyConfig;
    allMdx: {
      edges: [
        {
          node: {
            fileAbsolutePath: string;
            frontmatter: {
              date: string;
              title: string;
            };
          };
        },
      ];
    };
  };
};

export const plugins = [
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
          serialize: ({query: {site, allMdx}}: SerializeArgs) => {
            return allMdx.edges.map(edge => {
              return Object.assign({}, edge.node.frontmatter, {
                description: edge.node.frontmatter.title,
                date: edge.node.frontmatter.date,
                url: site.siteMetadata.siteUrl + getBlogPostUrl(edge.node),
              });
            });
          },
          query: `
              {
                allMdx(
                  sort: {order: DESC, fields: [frontmatter___date]}
                  limit: 1000
                  filter: {frontmatter: {type: {eq: "post"}}}
                ) {
                  edges {
                    node {
                      id
                      fileAbsolutePath
                      frontmatter {
                        title
                        date
                      }
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
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'pages',
      path: `${__dirname}/src/pages`,
    },
  },
  {
    resolve: 'gatsby-plugin-page-creator',
    options: {
      path: `${__dirname}/src/pages`,
    },
  },
  'gatsby-plugin-sharp',
  {
    resolve: 'gatsby-plugin-mdx',
    options: {
      defaultLayouts: {
        default: require.resolve('./src/templates/Layout.tsx'),
      },
      gatsbyRemarkPlugins: [
        {
          resolve: 'gatsby-remark-images',
          options: {
            maxWidth: 680,
          },
        },
        {
          resolve: 'gatsby-remark-prismjs',
          options: {},
        },
      ],
      // https://github.com/gatsbyjs/gatsby/issues/15486#issuecomment-510153237
      plugins: ['gatsby-remark-images', 'gatsby-remark-prismjs'],
    },
  },
  {
    resolve: 'gatsby-plugin-google-analytics',
    options: {
      trackingId: 'UA-703860-1',
    },
  },
  'gatsby-plugin-sass',
];
