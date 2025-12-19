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

/**
 * 根据创建时间计算合适的更新间隔
 * @param createdAt 创建时间的时间戳
 * @returns 更新间隔（毫秒）
 */
export function getUpdateInterval(createdAt: number): number {
  const now = dayjs();
  const createdTime = dayjs(createdAt);

  // 计算不同单位的时间差
  const diffInHours = now.diff(createdTime, "hour");
  const diffInDays = now.diff(createdTime, "day");

  // 根据时间差设置不同的更新频率
  if (diffInHours < 1) {
    // 小于1小时
    return 60000; // 每分钟更新
  } else if (diffInDays < 1) {
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
  // ensure dateA and dateB are valid dates
  if (!dateA) {
    dateA = new Date().getTime() as unknown as Date;
  }
  if (!dateB) {
    dateB = new Date().getTime() as unknown as Date;
  }
  return dayjs(dateA)
    .tz(DEFAULT_TIMEZONE)
    .isBefore(dayjs(dateB).tz(DEFAULT_TIMEZONE))
    ? 1
    : -1;
}
