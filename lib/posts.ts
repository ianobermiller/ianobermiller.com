import {readFileSync} from 'fs';
import matter from 'gray-matter';
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
    const fullPath = `${BLOG_DIRECTORY}${path}`;
    const fileContents = readFileSync(fullPath, 'utf8');
    const {
      data: {date, title, isDraft = false},
    } = matter(fileContents);

    posts.push({
      date,
      path,
      timestamp: new Date(date).getTime(),
      title,
      url: '/blog/' + slug,
      isDraft,
    });
  }

  return posts
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter(p => !p.isDraft);
}
