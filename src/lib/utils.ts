import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const getColumns = (data: any) => {
  if (!data?.length) return [];

  const row = data?.[0];
  const columns = Object.keys(row).map((key) => {
    let displayName = key;

    if (key.includes("UDM Field Name")) {
      displayName = "UDM Name";
    } else if (key.includes("RawLog Field Name")) {
      displayName = "Product Field";
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
