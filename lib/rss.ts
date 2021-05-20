import {Feed} from 'feed';
import {mkdirSync, writeFileSync} from 'fs';
import {Post} from './posts';

const date = new Date();
const baseUrl = 'https://ianobermiller.com';

export async function writeRSSFile(posts: Post[]): Promise<void> {
  const feed = new Feed({
    title: `Ian Obermiller's Blog`,
    description: 'Personal blog of Ian Obermiller',
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    image: `${baseUrl}/favicon.svg`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${date.getFullYear()}, Ian Obermiller`,
    updated: date,
    feedLinks: {
      rss2: `${baseUrl}/rss/feed.xml`,
      json: `${baseUrl}/rss/feed.json`,
      atom: `${baseUrl}/rss/atom.xml`,
    },
    author: {
      name: 'Ian Obermiller',
      email: 'ian@obermillers.com',
      link: 'https://ianobermiller.com',
    },
  });

  posts.forEach(post => {
    const url = `${baseUrl}/blog/${post.url}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      date: new Date(post.timestamp),
    });
  });

  mkdirSync('./public/rss', {recursive: true});
  writeFileSync('./public/rss/feed.xml', feed.rss2());
  writeFileSync('./public/rss/atom.xml', feed.atom1());
  writeFileSync('./public/rss/feed.json', feed.json1());
}
