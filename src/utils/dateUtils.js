/**
 * Formats an ISO date string into a human-readable date.
 * Example: "Sat, Nov 14, 2026"
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats time from an ISO date string.
 * Example: "02:30 PM"
 */
export function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Combined Date and Time formatting
 * Example: "Nov 14, 2026 • 2:30 PM"
 */
export function formatDateTime(isoString) {
  if (!isoString) return '';
  return `${formatDate(isoString)} • ${formatTime(isoString)}`;
}

/**
 * Checks if an event is in the past
 */
export function isPastEvent(isoString) {
  if (!isoString) return false;
  const eventDate = new Date(isoString);
  return eventDate.getTime() < Date.now();
}

/**
 * Calculates human relative time description
 */
export function getRelativeTime(isoString) {
  if (!isoString) return '';
  const eventDate = new Date(isoString);
  const now = new Date();
  const diffMs = eventDate.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Ended';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 30) return `In ${Math.round(diffDays / 7)} weeks`;
  return `In ${Math.round(diffDays / 30)} months`;
}
