import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { startWorkflow, resumeWorkflow, generateConf, getMappingDoc, uploadMapping, submitGenericFeedback } from "@/api/workflow";
import {
  WorkflowResponse,
  ResumeWorkflowPayload,
  GenerateConfPayload,
  ThoughtStep,
  MappingDocPayload,
} from "@/components/types";

/**
 * Hook for starting a new workflow
 */
export const useStartWorkflow = () => {
  return useMutation<
    WorkflowResponse | null,
    Error,
    { formData: FormData; onThought?: (thought: ThoughtStep) => void }
  >({
    mutationFn: async ({ formData, onThought }) => {
      return await startWorkflow(formData, onThought);
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
    {
      payload: ResumeWorkflowPayload;
      headers: HeadersInit;
      onThought?: (thought: ThoughtStep) => void;
    }
  >({
    mutationFn: async ({ payload, headers, onThought }) => {
      return await resumeWorkflow(payload, headers, onThought);
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
  return useMutation<string | void, Error, { payload: GenerateConfPayload; headers: HeadersInit }>({
    mutationFn: async ({ payload, headers }) => {
      return await generateConf(payload, headers);
    },
    onSuccess: () => {
      toast.success("Configuration file downloaded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate configuration file");
    },
  });
};

// Hook for fetching mapping documentation

export const useGetMappingDoc = () => {
  return useMutation<
    string | null,
    Error,
    {
      payload: MappingDocPayload;
      headers: HeadersInit;
    }
  >({
    mutationFn: async ({ payload, headers }) => {
      return await getMappingDoc(payload, headers);
    },
  });
};

/**
 * Hook for uploading existing mapping
 */
export const useUploadMapping = () => {
  return useMutation<WorkflowResponse | null, Error, FormData>({
    mutationFn: async (formData) => {
      return await uploadMapping(formData);
    },
    onSuccess: () => {
      toast.success("Mapping uploaded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload mapping");
    },
  });
};

/**
 * Hook for submitting generic feedback
 */
export const useSubmitFeedback = () => {
  return useMutation<boolean, Error, string>({
    mutationFn: async (feedback) => {
      return await submitGenericFeedback(feedback);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit feedback");
    },
  });
};
