import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into a human-readable format
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Check if a deadline is past due
 */
export function isOverdue(deadline: string, status: string): boolean {
  if (status === "completed") return false;
  try {
    return new Date(deadline) < new Date();
  } catch {
    return false;
  }
}

/**
 * Get relative time string (e.g. "2 days ago", "in 3 days")
 */
export function relativeTime(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const days = Math.round(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days === -1) return "Yesterday";
    if (days > 0) return `In ${days} days`;
    return `${Math.abs(days)} days ago`;
  } catch {
    return "";
  }
}
