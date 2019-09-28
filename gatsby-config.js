const {getBlogPostUrl} = require('./src/utils');

module.exports = {
  siteMetadata: {
    title: 'Ian Obermiller',
    siteUrl: `https://ianobermiller.com`,
  },
  plugins: [
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
            serialize: ({query: {site, allMdx}}) => {
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
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          default: require.resolve('./src/templates/Layout.tsx'),
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 680,
              sizeByPixelDensity: true,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {},
          },
        ],
        // https://github.com/gatsbyjs/gatsby/issues/15486#issuecomment-510153237
        plugins: [`gatsby-remark-images`, `gatsby-remark-prismjs`],
      },
    },
  ],
};
