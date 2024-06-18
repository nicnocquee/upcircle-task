import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

export const getPredefinedTimeRanges = () => {
  const timeRange = [
    ["Today", startOfDay(new Date()), endOfDay(new Date())],
    ["This week", startOfWeek(new Date()), endOfWeek(new Date())],
    ["This month", startOfMonth(new Date()), endOfMonth(new Date())],
    ["This year", startOfYear(new Date()), endOfYear(new Date())],
  ] as const;

  return timeRange;
};
