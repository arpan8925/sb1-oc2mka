import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAvatarUrl(userId: string) {
  return `https://source.unsplash.com/random/150x150?portrait&sig=${userId}`;
}