export type ToolCall = {
  name: string;
  args: string;
  output: string;
};

export type ThoughtStep = {
  agent_name: string;
  message_type: "AIMessage" | "ToolMessage";
  content: string;
  tool_calls: ToolCall[] | ToolCall;
};

export type AgentThoughts = {
  agent_name: string;
  thoughts: ThoughtStep[];
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

export type MappingDocPayload = {
  thread_id: string;
};

export type MappingDocResponse = string;
