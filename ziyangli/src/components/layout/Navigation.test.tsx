import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from './Navigation';

test('keeps Blog active when reading an article', () => {
  render(<MemoryRouter initialEntries={['/blog/react-hooks-guide']}><Navigation /></MemoryRouter>);
  expect(screen.getByRole('link', { name: /Blog/ })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('link', { name: /Home/ })).not.toHaveAttribute('aria-current');
});

test('does not activate Blog for an unrelated path with the same prefix', () => {
  render(<MemoryRouter initialEntries={['/blogger']}><Navigation /></MemoryRouter>);
  screen.getAllByRole('link').forEach(link => {
    expect(link).not.toHaveAttribute('aria-current');
  });
});

test('only Home is active on the home page', () => {
  render(<MemoryRouter initialEntries={['/']}><Navigation /></MemoryRouter>);
  expect(screen.getByRole('link', { name: /Home/ })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('link', { name: /Blog/ })).not.toHaveAttribute('aria-current');
});
