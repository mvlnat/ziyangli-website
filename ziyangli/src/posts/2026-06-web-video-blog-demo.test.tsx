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
    const scroll = HTMLElement.prototype.scrollIntoView as jest.Mock;
    expect(scroll.mock.instances[scroll.mock.instances.length - 1]).toBe(button);
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

test('stage clicks advance once, controls select exactly, and step boundaries are enforced', () => {
  const { container, unmount } = render(<WebVideoBlogDemo />);
  fireEvent.keyDown(window, { key: 'ArrowLeft' });
  expect(screen.getByRole('button', { name: 'Go to step 1' })).toHaveAttribute('aria-current', 'step');
  fireEvent.click(container.querySelector('.wvbd-stage-frame')!);
  expect(screen.getByRole('button', { name: 'Go to step 2' })).toHaveAttribute('aria-current', 'step');
  fireEvent.click(screen.getByRole('button', { name: 'Go to step 5' }));
  expect(screen.getByRole('button', { name: 'Go to step 5' })).toHaveAttribute('aria-current', 'step');
  fireEvent.keyDown(window, { key: 'End' });
  fireEvent.click(container.querySelector('.wvbd-stage-frame')!);
  expect(screen.getByRole('button', { name: 'Go to step 8' })).toHaveAttribute('aria-current', 'step');
  unmount();
  const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
  window.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(false);
});

test('progress scrolling respects reduced motion', () => {
  const original = window.matchMedia;
  window.matchMedia = jest.fn().mockReturnValue({ matches: true });
  try {
    render(<WebVideoBlogDemo />);
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenLastCalledWith({
      behavior: 'auto', block: 'nearest', inline: 'center',
    });
  } finally {
    window.matchMedia = original;
  }
});
