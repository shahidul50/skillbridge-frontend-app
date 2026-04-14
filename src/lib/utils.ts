import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getInitials(name: string) {
  if (!name) return "NA";

  const words = name.split(" ");
  if (words.length === 1) {
    return words[0].toUpperCase().substring(0, 2);
  }

  return words.map(word => word[0]).join("").toUpperCase().substring(0, 2);
}