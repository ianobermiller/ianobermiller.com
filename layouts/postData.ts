import {getAllPosts} from '../lib/posts';

export type RelatedPost = {
  name: string;
  title: string;
  url: string;
};

export async function getStaticProps(): Promise<{
  props: {relatedPosts: Array<RelatedPost>};
}> {
  // Super hack way to get the path
  const currentPostPath = new Error().stack.match(
    /\/pages\/blog\/(.*\.mdx)/,
  )[1];
  const posts = await getAllPosts();
  const currentPostIndex = posts.findIndex(
    p => p.path === currentPostPath,
  );
  const getRelated = (name, index) => {
    const post = posts[index];
    if (!post) return;

    return {
      name,
      title: post.title,
      url: post.url,
    };
  };
  const relatedPosts = [
    getRelated('Previous', currentPostIndex + 1),
    getRelated('Next', currentPostIndex - 1),
  ].filter(Boolean);
  return {
    props: {
      relatedPosts,
    },
  };
}
