export type ToolCall = {
  name: string;
  args: string;
  output: string;
};

export type ThoughtStep = {
  node_name: string;
  message_type: "AIMessageChunk" | "ToolMessageChunk";
  content: string;
  tool_calls: ToolCall[];
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
