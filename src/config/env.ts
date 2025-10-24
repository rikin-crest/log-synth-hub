/**
 * Environment configuration
 * All environment variables must be prefixed with VITE_ to be exposed to the client
 */

interface EnvConfig {
  apiBaseUrl: string;
}

const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Environment variable ${key} is not set. Please check your .env file.`);
  }

  return value;
};

export const env: EnvConfig = {
  apiBaseUrl: getEnvVar("VITE_API_BASE_URL"),
};
