import { formatDistanceToNow, parseISO } from "date-fns";

export function getRelativeTime(timestamp: string) {
  // Parse the ISO 8601 timestamp to a Date object
  const date = parseISO(timestamp);
  // Get the relative time string
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });
  return relativeTime;
}
