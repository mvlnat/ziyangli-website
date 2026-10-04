import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import Layout from './Layout';

test.each(['/blog/web-video-blog-demo', '/blog/web-video-blog-demo/'])('uses the presentation layout at %s', path => {
  const { container } = render(<MemoryRouter initialEntries={[path]}><ThemeProvider><Layout>Presentation</Layout></ThemeProvider></MemoryRouter>);
  expect(container.querySelector('.presentation-app')).toBeInTheDocument();
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
});

test('keeps the normal site layout for other articles', () => {
  const { container } = render(<MemoryRouter initialEntries={['/blog/my-first-post']}><ThemeProvider><Layout>Article</Layout></ThemeProvider></MemoryRouter>);
  expect(container.querySelector('.presentation-app')).not.toBeInTheDocument();
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});
