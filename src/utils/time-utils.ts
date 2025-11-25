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
