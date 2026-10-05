/**
 * Format ISO date string to readable format
 * Example: "2024-01-15T00:00:00Z" -> "January 15, 2024"
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

/**
 * Format publication dates relative to the current UTC calendar day
 * Example: "2 days ago", "3 months ago"
 */
export const formatRelativeTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const publicationDay = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const diffDays = Math.round((today - publicationDay) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays < 0) {
    const daysAhead = -diffDays;
    if (daysAhead === 1) return 'Tomorrow';
    return `In ${daysAhead} days`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  const [count, unit] = diffDays < 30
    ? [Math.floor(diffDays / 7), 'week']
    : diffDays < 365
      ? [Math.floor(diffDays / 30), 'month']
      : [Math.floor(diffDays / 365), 'year'];
  return `${count} ${unit}${count === 1 ? '' : 's'} ago`;
};
