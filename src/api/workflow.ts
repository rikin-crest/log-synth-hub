import {
  GenerateConfPayload,
  ResumeWorkflowPayload,
  WorkflowResponse,
} from "@/components/types";
import { API_CONFIG } from "./api";
import { toast } from "sonner";
import { getAuthHeader } from "./auth";

export const startWorkflow = async (
  payload: FormData
): Promise<WorkflowResponse | null> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.START_WORKFLOW}`,
      {
        method: "POST",
        headers: {
          ...getAuthHeader(),
        },
        body: payload,
      }
    );

    return response.json();
  } catch (e: unknown) {
    const errorMessage =
      (e as { message: string })?.message || "Failed to start workflow!";
    toast.error(errorMessage);

    return null;
  }
};

export const resumeWorkflow = async (
  payload: ResumeWorkflowPayload,
  headers: HeadersInit
): Promise<WorkflowResponse | null> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.RESUME_WORKFLOW}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          ...getAuthHeader(),
          ...headers,
        },
      }
    );

    return response.json();
  } catch (e: unknown) {
    const errorMessage =
      (e as { message: string })?.message || "Failed to resume workflow!";
    toast.error(errorMessage);

    return null;
  }
};

export const generateConf = async (
  payload: GenerateConfPayload,
  headers: HeadersInit
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.GENERATE_CONF}?thread_id=${payload.thread_id}`,
      {
        method: "GET",
        headers: {
          ...getAuthHeader(),
          ...headers,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate configuration file!");
    }

    // Convert response to Blob
    const blob = await response.blob();

    // Create a temporary URL
    const url = window.URL.createObjectURL(blob);

    // Create an <a> element for download
    const a = document.createElement("a");
    a.href = url;

    // Optional: set filename dynamically if API sends it in headers
    const contentDisposition = response.headers.get("Content-Disposition");
    const fileName =
      contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
      "generated_conf.conf";

    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (e: unknown) {
    const errorMessage =
      (e as { message: string })?.message ||
      "Failed to download configuration file!";
    toast.error(errorMessage);
  }
};
