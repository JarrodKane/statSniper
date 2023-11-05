import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTotalHours = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const convertTimeStamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const formattedShortDate =
    date.toLocaleString('default', { day: '2-digit', month: 'short' }) +
    ', ' +
    date.getFullYear();

  return formattedShortDate;
};
