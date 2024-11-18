// @ts-ignore
import dayjs from "dayjs";
// @ts-ignore
import utc from "dayjs/plugin/utc";
// @ts-ignore
import timezone from "dayjs/plugin/timezone";
// @ts-ignore
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

export const DEFAULT_TIMEZONE = "Asia/Shanghai";

export function formatDateTime(timestamp: number): string {
  return timestamp
    ? dayjs(timestamp).tz(DEFAULT_TIMEZONE).format("YYYY-MM-DD HH:MM")
    : "1970-01-01 00:00";
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatRelativeTime(timestamp: number): string {
  return dayjs(timestamp).fromNow();
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
