import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import WebVideoBlogDemo from './2026-06-web-video-blog-demo';

beforeAll(() => {
  HTMLElement.prototype.scrollIntoView = jest.fn();
});

test('each presentation step is an accessible button that selects that step', () => {
  render(<WebVideoBlogDemo />);
  for (let step = 1; step <= 8; step++) {
    const button = screen.getByRole('button', { name: `Go to step ${step}` });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-current', 'step');
    expect(document.querySelector(`.wvbd-step-${step}`)).toBeInTheDocument();
  }
});

test('presentation shortcuts advance the stage but leave focused buttons alone', () => {
  render(<WebVideoBlogDemo />);
  fireEvent.keyDown(window, { key: 'ArrowRight' });
  expect(screen.getByRole('button', { name: 'Go to step 2' })).toHaveAttribute('aria-current', 'step');
  const button = screen.getByRole('button', { name: 'Go to step 2' });
  fireEvent.keyDown(button, { key: ' ', cancelable: true });
  expect(button).toHaveAttribute('aria-current', 'step');
  fireEvent.keyDown(window, { key: 'End' });
  expect(screen.getByRole('button', { name: 'Go to step 8' })).toHaveAttribute('aria-current', 'step');
});
