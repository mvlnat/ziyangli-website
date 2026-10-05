import { blogPosts, getAllPosts, getPostBySlug } from './index';

jest.mock('../components/blog/CodeBlock', () => () => null);

test.each(['toString', 'constructor', '__proto__', 'hasOwnProperty', 'missing-post'])('rejects unknown post slug %s', slug => {
  expect(getPostBySlug(slug)).toBeUndefined();
});

test('still retrieves a registered article', () => {
  expect(getPostBySlug('my-first-post')).toMatchObject({ slug: 'my-first-post', title: 'My First Blog Post' });
});

test('unpublished articles are unavailable both in listings and by direct URL', () => {
  const post = blogPosts['my-first-post'];
  const published = post.published;
  try {
    post.published = false;
    expect(getAllPosts()).not.toContain(post);
    expect(getPostBySlug(post.slug)).toBeUndefined();
  } finally {
    post.published = published;
  }
});
