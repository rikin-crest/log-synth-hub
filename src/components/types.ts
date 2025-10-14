export type FormType = {
  productName: string;
  logCategory: string;
  fileName: string;
  logType: string;
};

export type StartWorkflowPayload = {
  product_name: string;
  product_log_name: string;
  raw_logs_path: string;
  udm_event_type: string;
};

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
