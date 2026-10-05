import React from 'react';
import fs from 'fs';
import path from 'path';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { getAllPosts } from './posts';

// CRA's Jest resolver cannot load refractor's ESM export map. Exercise our real
// CodeBlock component while replacing only the third-party highlighting engine.
jest.mock('react-syntax-highlighter', () => {
  const React = require('react');
  return {
    Prism: ({ children, customStyle, codeTagProps }: {
      children: React.ReactNode;
      customStyle: React.CSSProperties;
      codeTagProps: React.HTMLAttributes<HTMLElement>;
    }) => React.createElement('div', { style: customStyle }, React.createElement('code', codeTagProps, children)),
  };
});
jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({ vscDarkPlus: {}, vs: {} }));

beforeAll(() => {
  window.scrollTo = jest.fn();
  HTMLElement.prototype.scrollIntoView = jest.fn();
});

beforeEach(() => {
  localStorage.clear();
});

function openRoute(route: string) {
  window.history.replaceState({}, '', `/#${route}`);
  return render(<App />);
}

test.each([
  ['/', 'Ziyang Li'], ['/about', 'About'], ['/projects', 'Projects'],
  ['/blog', 'Blog'], ['/missing', '404'],
])('renders route %s with its main heading', (route, title) => {
  openRoute(route);
  expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();
});

test.each(getAllPosts())('renders $slug and resolves its local images', post => {
  const { container } = openRoute(`/blog/${post.slug}`);
  if (post.presentationMode) {
    expect(screen.getByRole('article', { name: post.title })).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to step 1' })).toHaveAttribute('aria-current', 'step');
  } else {
    expect(screen.getByRole('heading', { level: 1, name: post.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'page');
  }
  container.querySelectorAll('img').forEach(img => {
    const pathname = new URL(img.src).pathname;
    expect(fs.existsSync(path.join(__dirname, '../public', pathname))).toBe(true);
    expect(img.alt).not.toBe('');
  });
});

test('search and category filtering work together and recover from no results', () => {
  openRoute('/blog');
  fireEvent.change(screen.getByRole('textbox', { name: 'Search blog posts' }), { target: { value: '  kafka SYSTEM  ' } });
  expect(screen.getByRole('status')).toHaveTextContent('1 post');
  expect(screen.getByRole('link', { name: 'Kafka for System Design Interviews' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Leetcode' }));
  expect(screen.getByRole('status')).toHaveTextContent('0 posts');
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
  expect(screen.getAllByRole('article')).toHaveLength(getAllPosts().filter(post => post.category === 'Leetcode').length);
  fireEvent.click(screen.getByRole('button', { name: 'All' }));
  expect(screen.getAllByRole('article')).toHaveLength(getAllPosts().length);
});

test('theme selection persists across mounting the app again', () => {
  const first = openRoute('/');
  const toggle = screen.getByRole('switch', { name: 'Evening theme' });
  expect(toggle).not.toBeChecked();
  fireEvent.click(toggle);
  expect(toggle).toBeChecked();
  expect(localStorage.getItem('darkMode')).toBe('true');
  first.unmount();
  const second = openRoute('/about');
  expect(screen.getByRole('switch')).toBeChecked();
  expect(second.container.querySelector('.App')).toHaveClass('dark-mode');
});

test.each(['missing-post', 'constructor', '__proto__'])('unknown article %s renders 404', slug => {
  openRoute(`/blog/${slug}`);
  expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
});
