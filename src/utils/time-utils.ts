import { formatDuration } from "date-fns";

export const timeDurationFormat = (minutes: number) => {
  return formatDuration(
    {
      minutes: minutes,
    },
    {
      format: ["hours", "minutes"],
    }
  );
};
