import Link from 'next/link';
import * as React from 'react';
import Layout from '../layouts/Layout';
import {getAllPosts} from '../lib/posts';
import {getAllRecipesNameAndURL} from '../lib/recipes';

interface Props {
  categories: Array<{
    title: string;
    links: Array<{title: string; url: string}>;
  }>;
}

export async function getStaticProps(): Promise<{
  props: Props;
}> {
  const [posts, recipes] = await Promise.all([
    getAllPosts(),
    getAllRecipesNameAndURL(),
  ]);

  return {
    props: {
      categories: [
        {
          title: 'Posts',
          links: posts.map(p => ({
            title: p.title,
            url: p.url,
          })),
        },
        {
          title: 'Recipes',
          links: recipes.map(r => ({
            title: r.name,
            url: r.url,
          })),
        },
      ],
    },
  };
}

export default function NotFoundPage(props: Props) {
  return (
    <Layout title="404 Not Found">
      <div>
        <h1>404 NOT FOUND</h1>
        <p>
          Oh, this is embarassing. We couldn't find the page you're looking for.
        </p>
        <p>Perhaps you were looking for one of these?</p>
        {props.categories.map(({links, title}) => (
          <>
            <h2>{title}</h2>
            <ul>
              {links.map(({title, url}) => (
                <li key={url}>
                  <Link href={url}>
                    <a>{title}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ))}
      </div>
    </Layout>
  );
}
