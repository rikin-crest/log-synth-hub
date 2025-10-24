/**
 * Environment configuration
 * All environment variables must be prefixed with VITE_ to be exposed to the client
 */

interface EnvConfig {
  apiBaseUrl: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];

  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`);
  }

  return value || defaultValue || "";
};

export const env: EnvConfig = {
  apiBaseUrl: getEnvVar("VITE_API_BASE_URL", "https://10.50.1.12:8002"),
};
