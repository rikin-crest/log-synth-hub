import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const columns = [
  "UDM Field Name",
  "RawLog Field Name",
  "Logic",
  "LLM Reasoning",
  "Human Feedback",
];

export const getColumns = (data: any) => {
  if (!data?.length) return [];

  const row = data?.[0];
  const columns = Object.keys(row).map((key) => key);

  return columns;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
