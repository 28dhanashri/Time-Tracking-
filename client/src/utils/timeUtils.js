/**
 * Converts total seconds into HH:MM:SS format
 * Example: 65 -> "00:01:05", 3665 -> "01:01:05"
 */
export const formatSeconds = (totalSeconds) => {
  const seconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    String(hrs).padStart(2, '0'),
    String(mins).padStart(2, '0'),
    String(secs).padStart(2, '0')
  ].join(':');
};

/**
 * Converts total seconds into human readable duration string
 * Example: 3665 -> "1h 1m", 120 -> "2m", 45 -> "45s"
 */
export const formatDurationHuman = (totalSeconds) => {
  const seconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m`;
  }
  return `${secs}s`;
};

/**
 * Formats a Date object or ISO string into readable date string
 * Example: "2026-09-16" -> "16 Sep 2026"
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Formats a Date object or ISO string into 12-hour time format
 * Example: ISO timestamp -> "10:00 AM"
 */
export const formatTime = (dateInput) => {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '-';

  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Calculates current elapsed duration in seconds from a start timestamp
 */
export const calculateElapsedTime = (startTime) => {
  if (!startTime) return 0;
  const start = new Date(startTime).getTime();
  const now = new Date().getTime();
  return Math.max(0, Math.floor((now - start) / 1000));
};
