import { ThoughtStep } from "@/components/types";

// Example usage
export const thoughts: ThoughtStep[] = [
  {
    node_name: "initial_analysis",
    message_type: "AIMessageChunk",
    content: "Analyzing the input data structure...",
    tool_calls: [],
  },
  {
    node_name: "data_processing",
    message_type: "ToolMessageChunk",
    content: "Processing complete",
    tool_calls: [
      {
        name: "process_data",
        args: '{"input": "sample.log", "format": "json"}',
        output: '{"status": "success", "records_processed": 42}',
      },
    ],
  },
];
