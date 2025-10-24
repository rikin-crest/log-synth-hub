import { env } from "@/config/env";

export const API_CONFIG = {
  BASE_URL: env.apiBaseUrl,
  ENDPOINTS: {
    START_WORKFLOW: "api/v1/start_workflow",
    RESUME_WORKFLOW: "api/v1/resume_workflow",
    GENERATE_CONF: "api/v1/generate_conf",
    LOGIN: "api/v1/login",
  },
};
