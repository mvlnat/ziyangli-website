import { getPostBySlug } from './index';

jest.mock('../components/blog/CodeBlock', () => () => null);

test.each(['toString', 'constructor', '__proto__', 'hasOwnProperty', 'missing-post'])('rejects unknown post slug %s', slug => {
  expect(getPostBySlug(slug)).toBeUndefined();
});

test('still retrieves a registered article', () => {
  expect(getPostBySlug('my-first-post')).toMatchObject({ slug: 'my-first-post', title: 'My First Blog Post' });
});
