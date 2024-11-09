// @ts-ignore
import dayjs from "dayjs";
// @ts-ignore
import utc from "dayjs/plugin/utc";
// @ts-ignore
import timezone from "dayjs/plugin/timezone";

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export const DEFAULT_TIMEZONE = "Asia/Shanghai";

export function formatDateTime(timestamp: number): string {
  return timestamp
    ? dayjs(timestamp).tz(DEFAULT_TIMEZONE).format("YYYY-MM-DD HH:MM")
    : "1970-01-01 00:00";
}

export function formatDate(timestamp: number | string | Date): string {
  return dayjs(timestamp).tz(DEFAULT_TIMEZONE).format("YYYY-MM-DD");
}

export function compareDates(
  dateA: string | number | Date,
  dateB: string | number | Date
): number {
  return dayjs(dateA)
    .tz(DEFAULT_TIMEZONE)
    .isBefore(dayjs(dateB).tz(DEFAULT_TIMEZONE))
    ? 1
    : -1;
}
