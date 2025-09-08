import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString()
}

export function formatDateTime(timestamp: number) {
  return new Date(timestamp).toLocaleString()
}

export function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

export function calculatePercentage(score: number, total: number) {
  if (total === 0) return 0
  return Math.round((score / total) * 100)
}
