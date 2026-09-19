/**
 * Formats a Date object into YYYY-MM-DD string in local timezone
 */
const getFormattedDate = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculates duration in seconds between two dates
 */
const calculateDurationInSeconds = (startTime, endTime) => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.max(0, Math.floor((end - start) / 1000));
};

/**
 * Formats seconds into HH:MM:SS format
 */
const formatSeconds = (totalSeconds) => {
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
 * Formats seconds into human readable string (e.g. "01h 30m" or "45m 12s")
 */
const formatDurationHuman = (totalSeconds) => {
  const seconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
};

module.exports = {
  getFormattedDate,
  calculateDurationInSeconds,
  formatSeconds,
  formatDurationHuman
};
