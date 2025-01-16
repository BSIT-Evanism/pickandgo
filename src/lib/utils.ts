import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId() {

  const label = 'pst'
  const date = new Date().toISOString().split('T')[0]

  return `${label}-${date}-${crypto.randomUUID().slice(0, 4)}`
}