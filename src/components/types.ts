export type ResumeWorkflowPayload = {
  thread_id: string;
  feedback: string;
};

export type GenerateConfPayload = {
  thread_id: string;
};

export type WorkflowResponse = {
  thread_id: string;
  output: Record<string, string>[];
  message?: string;
};
