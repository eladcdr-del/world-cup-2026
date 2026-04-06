import { format, formatDistanceToNow, differenceInSeconds } from "date-fns";
import { he } from "date-fns/locale";

export function formatDate(date: string | Date): string {
  return format(new Date(date), "d בMMMM yyyy", { locale: he });
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), "HH:mm");
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "d/M/yyyy HH:mm", { locale: he });
}

export function formatMatchDate(date: string | Date): string {
  const d = new Date(date);
  return `${format(d, "EEEE", { locale: he })}, ${format(d, "d בMMMM", { locale: he })}`;
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { locale: he, addSuffix: true });
}

export function getTimeRemaining(deadline: string | Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
} {
  const totalSeconds = differenceInSeconds(new Date(deadline), new Date());
  const isExpired = totalSeconds <= 0;

  if (isExpired) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true };
  }

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalSeconds, isExpired };
}

export function formatCountdown(deadline: string | Date): string {
  const { days, hours, minutes, isExpired } = getTimeRemaining(deadline);
  if (isExpired) return "הזמן עבר";

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} ימים`);
  if (hours > 0) parts.push(`${hours} שעות`);
  if (minutes > 0) parts.push(`${minutes} דקות`);

  return parts.join(", ");
}
