import {
  format,
  formatDistanceToNow,
  differenceInHours,
  differenceInDays,
  isBefore,
} from "date-fns";
import { zhCN } from "date-fns/locale";
import { TZDate } from "@date-fns/tz";

export const DEFAULT_TIMEZONE = "Asia/Shanghai";

export function formatDateTime(timestamp: number): string {
  if (!timestamp) return "1970-01-01 00:00";
  const date = new TZDate(timestamp, DEFAULT_TIMEZONE);
  return format(date, "yyyy-MM-dd HH:mm");
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
  return formatDistanceToNow(timestamp, { addSuffix: true, locale: zhCN });
}

/**
 * 根据创建时间计算合适的更新间隔
 * @param createdAt 创建时间的时间戳
 * @returns 更新间隔（毫秒）
 */
export function getUpdateInterval(createdAt: number): number {
  const now = new Date();
  const createdTime = new Date(createdAt);

  const hoursDiff = differenceInHours(now, createdTime);
  const daysDiff = differenceInDays(now, createdTime);

  // 根据时间差设置不同的更新频率
  if (hoursDiff < 1) {
    // 小于1小时
    return 60000; // 每分钟更新
  } else if (daysDiff < 1) {
    // 小于1天
    return 3600000; // 每小时更新
  } else {
    // 大于等于1天
    return 86400000; // 每天更新
  }
}

export function compareDates(
  dateA: string | number | Date | null | undefined,
  dateB: string | number | Date | null | undefined
): number {
  const a = new TZDate(dateA ?? Date.now(), DEFAULT_TIMEZONE);
  const b = new TZDate(dateB ?? Date.now(), DEFAULT_TIMEZONE);
  return isBefore(a, b) ? 1 : -1;
}
