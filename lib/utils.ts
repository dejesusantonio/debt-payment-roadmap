import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind classes without conflicts — required by shadcn-style components */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
