import { format, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { TZDate } from "@date-fns/tz";

export const DEFAULT_TIMEZONE = "Asia/Shanghai";

export function formatDateTime(timestamp: number): string {
  if (!timestamp) return "1970-01-01 00:00";
  const date = new TZDate(timestamp, DEFAULT_TIMEZONE);
  return format(date, "yyyy-MM-dd HH:mm");
}

export function formatRelativeTime(timestamp: number): string {
  return formatDistanceToNow(timestamp, { addSuffix: true, locale: zhCN });
}
