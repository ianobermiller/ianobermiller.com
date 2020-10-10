import {parseISO} from 'date-fns';
import readdirp from 'readdirp';

export type Post = {
  date: string;
  timestamp: number;
  title: string;
  url: string;
};

export const blogPath = 'pages/blog/';

export async function getAllPosts(): Promise<Array<Post>> {
  const posts = [];

  for await (const {path} of readdirp(blogPath, {
    fileFilter: '*.mdx',
  })) {
    const slug = path
      .replace(/\.mdx$/, '')
      .replace(/\/index$/, '');
    const {
      metadata = {date: '', title: ''},
    } = require('../' + blogPath + path);

    posts.push({
      url: '/blog/' + slug,
      title: metadata.title,
      date: metadata.date,
      timestamp: parseISO(metadata.date).getTime(),
    });
  }

  posts.sort((a, b) => b.timestamp - a.timestamp);
  return posts;
}
