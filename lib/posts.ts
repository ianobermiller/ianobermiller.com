import {parseISO} from 'date-fns';
import readdirp from 'readdirp';

export type Post = {
  date: string;
  path: string;
  timestamp: number;
  title: string;
  url: string;
};

export const blogPath = 'pages/blog/';

let posts = null;
export async function getAllPosts(): Promise<Array<Post>> {
  if (posts != null) {
    return posts;
  }

  posts = [];

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
      date: metadata.date,
      path,
      timestamp: parseISO(metadata.date).getTime(),
      title: metadata.title,
      url: '/blog/' + slug,
    });
  }

  posts.sort((a, b) => b.timestamp - a.timestamp);
  return posts;
}
