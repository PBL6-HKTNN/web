import { formatDuration } from "date-fns";

export const timeDurationFormat = (minutes: number | string) => {
  // Convert minutes to number if it's a string
  const minutesNum = typeof minutes === "string" ? parseInt(minutes) : minutes;

  return formatDuration(
    {
      minutes: minutesNum,
    },
    {
      format: ["hours", "minutes"],
    }
  );
};

/**
 * Converts a timespan string in "hh:mm:ss" format to total seconds as integer
 * @param timeString - Time string in "hh:mm:ss" format
 * @returns Total seconds as integer, or 0 if invalid format
 */
export const parseTimespanToSeconds = (timeString: string): number => {
  if (!timeString || typeof timeString !== "string") {
    return 0;
  }

  const parts = timeString.split(":");

  // Handle different formats: hh:mm:ss, mm:ss, ss
  if (parts.length === 3) {
    // hh:mm:ss format
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const seconds = parseInt(parts[2], 10) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    // mm:ss format
    const minutes = parseInt(parts[0], 10) || 0;
    const seconds = parseInt(parts[1], 10) || 0;
    return minutes * 60 + seconds;
  } else if (parts.length === 1) {
    // ss format
    return parseInt(parts[0], 10) || 0;
  }

  return 0;
};

export const parseTimespanToMinutes = (timeString: string): number => {
  const totalSeconds = parseTimespanToSeconds(timeString);
  return Math.floor(totalSeconds / 60);
};

export const formatSecondsToTimespan = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];

  if (hours > 0) {
    parts.push(String(hours).padStart(2, "0"));
  }
  parts.push(String(minutes).padStart(2, "0"));
  parts.push(String(seconds).padStart(2, "0"));

  return parts.join(":");
};
