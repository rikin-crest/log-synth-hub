import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  startWorkflow,
  resumeWorkflow,
  generateConf,
} from "@/api/workflow";
import {
  WorkflowResponse,
  ResumeWorkflowPayload,
  GenerateConfPayload,
} from "@/components/types";

/**
 * Hook for starting a new workflow
 */
export const useStartWorkflow = () => {
  return useMutation<WorkflowResponse | null, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      return await startWorkflow(formData);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to start workflow");
    },
  });
};

/**
 * Hook for resuming an existing workflow
 */
export const useResumeWorkflow = () => {
  return useMutation<
    WorkflowResponse | null,
    Error,
    { payload: ResumeWorkflowPayload; headers: HeadersInit }
  >({
    mutationFn: async ({ payload, headers }) => {
      return await resumeWorkflow(payload, headers);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resume workflow");
    },
  });
};

/**
 * Hook for generating configuration file
 */
export const useGenerateConf = () => {
  return useMutation<
    void,
    Error,
    { payload: GenerateConfPayload; headers: HeadersInit }
  >({
    mutationFn: async ({ payload, headers }) => {
      await generateConf(payload, headers);
    },
    onSuccess: () => {
      toast.success("Configuration file downloaded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate configuration file");
    },
  });
};
