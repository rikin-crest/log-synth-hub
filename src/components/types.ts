export type FormType = {
  productName: string;
  logCategory: string;
  file: File;
  logType: string;
};

export type StartWorkflowPayload = {
  product_name: string;
  product_log_name: string;
  raw_logs_path: File;
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
