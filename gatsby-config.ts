import {GatsbyConfig} from 'gatsby';

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
            return allMdx.nodes.map(node => {
              return Object.assign({}, node.frontmatter, {
                description: node.frontmatter.title,
                date: node.frontmatter.date,
                url: site.siteMetadata.siteUrl + node.fields.slug,
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
      name: 'pages',
      path: `${__dirname}/src/pages`,
    },
  },
  'gatsby-plugin-sharp',
  {
    resolve: 'gatsby-plugin-mdx',
    options: {
      defaultLayouts: {
        default: require.resolve('./src/templates/Post.tsx'),
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
