import {parseISO} from 'date-fns';
import readdirp from 'readdirp';

export type Post = {
  date: string;
  path: string;
  timestamp: number;
  title: string;
  url: string;
  isDraft: boolean;
};

export const BLOG_DIRECTORY = 'pages/blog/';

let posts: Array<Post> | null = null;
export async function getAllPosts(): Promise<Array<Post>> {
  if (posts != null) {
    return posts;
  }

  posts = [];

  for await (const {path} of readdirp(BLOG_DIRECTORY, {fileFilter: '*.mdx'})) {
    const slug = path.replace(/\.mdx$/, '').replace(/\/index$/, '');
    const fullPath = `../${BLOG_DIRECTORY}${path}`;
    const {metadata = {date: '', title: ''}} = require(fullPath);
    posts.push({
      date: metadata.date,
      path,
      timestamp: parseISO(metadata.date).getTime(),
      title: metadata.title,
      url: '/blog/' + slug,
      isDraft: Boolean(metadata.isDraft),
    });
  }

  return posts
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter(p => !p.isDraft);
}
