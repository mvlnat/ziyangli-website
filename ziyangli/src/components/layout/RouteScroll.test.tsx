import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import RouteScroll from './RouteScroll';

function Controls() {
  const navigate = useNavigate();
  return <>
    <button onClick={() => navigate('/blog')}>Blog</button>
    <button onClick={() => navigate('/blog/my-first-post')}>Article</button>
    <button onClick={() => navigate('/about', { replace: true })}>Replace</button>
    <button onClick={() => navigate(-1)}>Back</button>
    <button onClick={() => navigate(1)}>Forward</button>
  </>;
}

test('resets new routes but leaves browser history restoration alone', () => {
  const scroll = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(<MemoryRouter><RouteScroll /><Controls /></MemoryRouter>);
  expect(scroll).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText('Blog'));
  fireEvent.click(screen.getByText('Article'));
  expect(scroll).toHaveBeenCalledTimes(2);
  expect(scroll).toHaveBeenLastCalledWith(0, 0);
  fireEvent.click(screen.getByText('Back'));
  fireEvent.click(screen.getByText('Forward'));
  expect(scroll).toHaveBeenCalledTimes(2);
  fireEvent.click(screen.getByText('Replace'));
  expect(scroll).toHaveBeenCalledTimes(3);
  scroll.mockRestore();
});
