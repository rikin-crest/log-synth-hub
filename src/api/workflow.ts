import {
  GenerateConfPayload,
  MappingDocPayload,
  MappingDocResponse,
  ResumeWorkflowPayload,
  ThoughtStep,
  WorkflowResponse,
} from "@/components/types";
import { API_CONFIG } from "./api";
import { toast } from "sonner";
import { getAuthHeader, handleUnauthorized } from "./auth";
// import { sample_res } from "../../sample_res";

export const startWorkflow = async (
  payload: FormData,
  onThought?: (thought: ThoughtStep) => void
): Promise<WorkflowResponse | null> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.START_WORKFLOW}`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        Accept: "text/event-stream",
      },
      body: payload,
    });

    if (!response.ok) {
      let errorMessage;

      switch (response.status) {
        case 400:
          errorMessage = "Invalid request. Please check your input data.";
          break;
        case 401:
          errorMessage = "Authentication failed. Please log in again.";
          handleUnauthorized();
          break;
        case 403:
          errorMessage = "Access denied. You don't have permission to perform this action.";
          break;
        case 404:
          errorMessage = "Workflow endpoint not found. Please contact support.";
          break;
        case 422:
          errorMessage = "Validation failed. Please check your input data and try again.";
          break;
        case 429:
          errorMessage = "Too many requests. Please wait a moment and try again.";
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = "Service temporarily unavailable. Please try again later.";
          break;
        default:
          errorMessage = `Request failed with status ${response.status}. Please try again.`;
      }

      console.log("HTTP Error:", response.status, errorMessage);
      toast.error(errorMessage);
      return null;
    }

    console.log("Response:", response);

    // Handle streaming response
    if (!response.body) {
      throw new Error("No response body received");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedBuffer = "";
    let result: WorkflowResponse | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode the chunk and append to our accumulated buffer
      const chunk = decoder.decode(value, { stream: true });
      accumulatedBuffer += chunk;

      console.log({ chunk, accumulatedBuffer });

      // Process all complete JSON objects in the accumulated buffer
      let startIndex = 0;
      let endIndex = 0;
      let jsonProcessed = false;

      while (startIndex < accumulatedBuffer.length) {
        // Find the start of a JSON object
        startIndex = accumulatedBuffer.indexOf("{", startIndex);
        if (startIndex === -1) break;

        // Try to parse from startIndex to end of buffer
        try {
          const jsonStr = accumulatedBuffer.slice(startIndex);
          const jsonData = JSON.parse(jsonStr);

          // If we get here, we have a valid JSON object
          endIndex = startIndex + jsonStr.length;
          jsonProcessed = true;

          if (jsonData.agent_name && jsonData.message_type) {
            // This is a valid thought object
            if (onThought) {
              onThought(jsonData);
            }
          } else if (jsonData.output) {
            // Handle final result
            result = jsonData;
          } else if (jsonData.event === "error") {
            throw new Error(jsonData.data?.message || "An error occurred during processing");
          }

          // Move startIndex to after this JSON object
          startIndex = endIndex;
        } catch (e: unknown) {
          console.error("Error parsing JSON chunk:", e);
          // If parsing fails, we might have a partial JSON object at the end
          break;
        }
      }

      // If we processed any complete JSON objects, remove them from the buffer
      if (jsonProcessed && endIndex > 0) {
        accumulatedBuffer = accumulatedBuffer.slice(endIndex);
      }
    }

    // After the stream ends, try to process any remaining data in the buffer
    if (accumulatedBuffer.trim()) {
      try {
        const jsonData = JSON.parse(accumulatedBuffer.trim());
        if (jsonData.agent_name && jsonData.message_type) {
          if (onThought) onThought(jsonData);
        } else if (jsonData.output) {
          result = jsonData;
        }
      } catch (e) {
        console.error("Error parsing final JSON chunk:", accumulatedBuffer, e);
      }
    }

    if (result) {
      return result;
    }

    throw new Error("No valid mapping data received!");
  } catch (e: unknown) {
    const errorMessage = (e as { message: string })?.message || "Failed to start workflow!";
    console.error("Workflow error:", errorMessage, e);
    toast.error(errorMessage);
    return null;
  }
};

export const resumeWorkflow = async (
  payload: ResumeWorkflowPayload,
  headers: HeadersInit,
  onThought?: (thought: ThoughtStep) => void
): Promise<WorkflowResponse | null> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.RESUME_WORKFLOW}`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        ...getAuthHeader(),
        ...headers,
        Accept: "text/event-stream",
      },
    });

    if (!response.ok) {
      let errorMessage;

      switch (response.status) {
        case 400:
          errorMessage = "Invalid request. Please check your workflow data.";
          break;
        case 401:
          errorMessage = "Authentication failed. Please log in again.";
          handleUnauthorized();
          break;
        case 403:
          errorMessage = "Access denied. You don't have permission to resume this workflow.";
          break;
        case 404:
          errorMessage = "Workflow not found. It may have expired or been deleted.";
          break;
        case 422:
          errorMessage = "Invalid workflow state. Please start a new workflow.";
          break;
        case 429:
          errorMessage = "Too many requests. Please wait a moment and try again.";
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = "Service temporarily unavailable. Please try again later.";
          break;
        default:
          errorMessage = `Request failed with status ${response.status}. Please try again.`;
      }

      console.log("HTTP Error:", response.status, errorMessage);
      toast.error(errorMessage);
      return null;
    }

    // Handle streaming response
    if (!response.body) {
      throw new Error("No response body received");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedBuffer = "";
    let result: WorkflowResponse | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode the chunk and append to our accumulated buffer
      const chunk = decoder.decode(value, { stream: true });
      accumulatedBuffer += chunk;

      console.log({ chunk, accumulatedBuffer });

      // Process all complete JSON objects in the accumulated buffer
      let startIndex = 0;
      let endIndex = 0;
      let jsonProcessed = false;

      while (startIndex < accumulatedBuffer.length) {
        // Find the start of a JSON object
        startIndex = accumulatedBuffer.indexOf("{", startIndex);
        if (startIndex === -1) break;

        // Try to parse from startIndex to end of buffer
        try {
          const jsonStr = accumulatedBuffer.slice(startIndex);
          const jsonData = JSON.parse(jsonStr);

          // If we get here, we have a valid JSON object
          endIndex = startIndex + jsonStr.length;
          jsonProcessed = true;

          if (jsonData.agent_name && jsonData.message_type) {
            // This is a valid thought object
            if (onThought) {
              onThought(jsonData);
            }
          } else if (jsonData.output) {
            // Handle final result
            result = jsonData;
          } else if (jsonData.event === "error") {
            throw new Error(jsonData.data?.message || "An error occurred during processing");
          }

          // Move startIndex to after this JSON object
          startIndex = endIndex;
        } catch (e: unknown) {
          console.error("Error parsing JSON chunk:", e);
          // If parsing fails, we might have a partial JSON object at the end
          break;
        }
      }

      // If we processed any complete JSON objects, remove them from the buffer
      if (jsonProcessed && endIndex > 0) {
        accumulatedBuffer = accumulatedBuffer.slice(endIndex);
      }
    }

    // After the stream ends, try to process any remaining data in the buffer
    if (accumulatedBuffer.trim()) {
      try {
        const jsonData = JSON.parse(accumulatedBuffer.trim());
        if (jsonData.agent_name && jsonData.message_type) {
          if (onThought) onThought(jsonData);
        } else if (jsonData.output) {
          result = jsonData;
        }
      } catch (e) {
        console.error("Error parsing final JSON chunk:", accumulatedBuffer, e);
      }
    }

    if (result) {
      return result;
    }

    throw new Error("No valid mapping data received!");
  } catch (e: unknown) {
    const errorMessage = (e as { message: string })?.message || "Failed to resume workflow!";
    console.error("Workflow error:", errorMessage, e);
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
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
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
      contentDisposition?.split("filename=")[1]?.replace(/"/g, "") || "generated_conf.conf";

    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (e: unknown) {
    const errorMessage =
      (e as { message: string })?.message || "Failed to download configuration file!";
    toast.error(errorMessage);
  }
};

export const getMappingDoc = async (
  payload: MappingDocPayload,
  headers: HeadersInit
): Promise<string | null> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.GET_MAPPING_DOC}?thread_id=${payload.thread_id}`,
      {
        method: "GET",
        headers: {
          ...getAuthHeader(),
          ...headers,
          Accept: "application/json",
        },
      }
    );

    const markdownData = await response.text();
    return markdownData;
  } catch (e: unknown) {
    const errorMessage = (e as { message: string })?.message || "Failed to get mapping document!";
    toast.error(errorMessage);
    return null;
  }
};
