import { formatDate, formatRelativeTime } from './dateUtils';

test('publication dates use UTC even when local formatting would show the previous day', () => {
  const formatter = jest.spyOn(Date.prototype, 'toLocaleDateString');
  expect(formatDate('2024-01-15T00:00:00Z')).toBe('January 15, 2024');
  expect(formatter).toHaveBeenCalledWith('en-US', expect.objectContaining({ timeZone: 'UTC' }));
  formatter.mockRestore();
});

test('relative dates handle future dates and singular units', () => {
  jest.useFakeTimers().setSystemTime(new Date('2026-10-04T12:00:00Z'));
  expect(formatRelativeTime('2026-10-04T10:00:00Z')).toBe('Today');
  expect(formatRelativeTime('2026-10-04T18:00:00Z')).toBe('Today');
  expect(formatRelativeTime('2026-10-03T23:59:59Z')).toBe('Yesterday');
  expect(formatRelativeTime('2026-10-03T12:00:00Z')).toBe('Yesterday');
  expect(formatRelativeTime('2026-10-05T12:00:00Z')).toBe('Tomorrow');
  expect(formatRelativeTime('2026-10-06T12:00:00Z')).toBe('In 2 days');
  expect(formatRelativeTime('2026-09-27T12:00:00Z')).toBe('1 week ago');
  expect(formatRelativeTime('2026-09-04T12:00:00Z')).toBe('1 month ago');
  expect(formatRelativeTime('2025-10-04T12:00:00Z')).toBe('1 year ago');
  jest.useRealTimers();
});
