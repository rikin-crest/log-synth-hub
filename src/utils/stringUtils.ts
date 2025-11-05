/**
 * Formats a node name by:
 * 1. Replacing underscores with spaces
 * 2. Capitalizing the first letter
 * 3. Lowercasing the rest of the string
 *
 * @param {string} str - The string to format
 * @returns {string} Formatted string
 */
export const formatNodeName = (str?: string): string => {
  if (!str || str.length === 0) return "";
  return str
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
