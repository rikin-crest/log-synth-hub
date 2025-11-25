import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const getColumns = (data: any) => {
  if (!data?.length) return [];

  // Get the first row to extract keys
  const row = data[0];

  // Object.keys preserves the insertion order for string keys in modern JavaScript
  // This ensures the column order matches the order in the response data
  const columns = Object.keys(row).map((key) => {
    let displayName = key;

    // Map key names to display names
    if (key.toLowerCase().includes("udm") && key.toLowerCase().includes("field")) {
      displayName = "UDM Field";
    } else if (key.toLowerCase().includes("ocsf") && key.toLowerCase().includes("field")) {
      displayName = "OCSF Field";
    } else if (
      key.toLowerCase().includes("rawlog") ||
      (key.toLowerCase().includes("field") && key.toLowerCase().includes("name"))
    ) {
      displayName = "Product Field";
    } else if (key.toLowerCase() === "logic") {
      displayName = "Logic";
    } else if (key.toLowerCase().includes("reasoning")) {
      displayName = "LLM Reasoning";
    } else if (key.toLowerCase().includes("confidence")) {
      displayName = "Confidence Score";
    }

    return {
      key: key,
      name: displayName,
    };
  });

  return columns;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
