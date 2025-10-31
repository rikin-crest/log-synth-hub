import {
  Box,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Psychology, SmartToy, Build, ExpandMore, Code } from "@mui/icons-material";
import { ThoughtStep } from "./types";
import LoadingFallback from "./LoadingFallback";

interface ChainOfThoughtsProps {
  steps: ThoughtStep[];
  isProcessing: boolean;
}

const ChainOfThoughts = ({ steps, isProcessing }: ChainOfThoughtsProps) => {
  if (steps?.length === 0 && isProcessing) {
    return <LoadingFallback message="AI is thinking..." size={40} height="100%" />;
  }

  if (steps?.length === 0 && !isProcessing) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "text.secondary",
        }}
      >
        <Psychology sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
        <Typography variant="body1">AI thoughts will appear here during processing</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {steps.map((step, index) => (
        <Box
          key={index}
          sx={{
            borderRadius: 2,
            backgroundColor: "action.hover",
            animation: "slide-in-up 0.4s ease-out",
            transition: "all 0.3s ease",
            flexShrink: 0,
            overflow: "hidden",
            border: 1,
            borderColor: "divider",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 2,
              borderBottom: step.tool_calls?.length > 0 ? 1 : 0,
              borderColor: "divider",
            }}
          >
            {step.message_type === "AIMessageChunk" ? (
              <SmartToy sx={{ color: "primary.main", fontSize: 24, flexShrink: 0 }} />
            ) : (
              <Build sx={{ color: "secondary.main", fontSize: 24, flexShrink: 0 }} />
            )}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}
              >
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Step {index + 1}
                </Typography>
                <Chip
                  label={step.message_type === "AIMessageChunk" ? "AI" : "Tool"}
                  size="small"
                  color={step.message_type === "AIMessageChunk" ? "primary" : "secondary"}
                  sx={{ height: 20, fontSize: "0.65rem" }}
                />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {step.node_name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  wordBreak: "break-word",
                }}
              >
                {step.content}
              </Typography>
            </Box>
          </Box>

          {/* Tool Calls Group */}
          {step.tool_calls?.length > 0 && (
            <Box sx={{ px: 2, pb: 2, pt: 2 }}>
              <Accordion
                defaultExpanded={false}
                sx={{
                  "&:before": { display: "none" },
                  boxShadow: "none",
                  border: 1,
                  borderColor: "divider",
                  "&.Mui-expanded": {
                    mt: 0,
                    mb: 1,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    minHeight: 48,
                    px: 2,
                    "& .MuiAccordionSummary-content": {
                      my: 1,
                      alignItems: "center",
                      gap: 1.5,
                    },
                    "&.Mui-expanded": {
                      minHeight: 48,
                    },
                  }}
                >
                  <Code sx={{ fontSize: 18, color: "info.main" }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {step.tool_calls.length} Tool Call{step.tool_calls.length > 1 ? "s" : ""}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, borderTop: 1, borderColor: "divider" }}>
                  <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2.5 }}>
                    {step.tool_calls.map((toolCall, toolIndex) => (
                      <Box
                        key={toolIndex}
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Accordion
                          sx={{
                            "&:before": { display: "none" },
                            boxShadow: "none",
                            m: 0,
                            "&.Mui-expanded": {
                              mt: 0,
                              mb: 0.5,
                            },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMore />}
                            sx={{
                              minHeight: 40,
                              backgroundColor: "background.default",
                              "& .MuiAccordionSummary-content": {
                                my: 0.5,
                                alignItems: "center",
                                gap: 1,
                              },
                            }}
                          >
                            <Code sx={{ fontSize: 16, color: "info.main" }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {toolCall.name}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ p: 0, borderTop: 1, borderColor: "divider" }}>
                            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                              {/* Tool Args */}
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 600,
                                    mb: 0.5,
                                    display: "block",
                                  }}
                                >
                                  Arguments:
                                </Typography>
                                <Box
                                  sx={{
                                    bgcolor: "background.default",
                                    p: 1.5,
                                    borderRadius: 1,
                                    overflow: "auto",
                                    maxHeight: 150,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontFamily: "monospace",
                                      fontSize: "0.75rem",
                                      whiteSpace: "pre-wrap",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {toolCall.args}
                                  </Typography>
                                </Box>
                              </Box>
                              {/* Tool Output */}
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 600,
                                    mb: 0.5,
                                    display: "block",
                                  }}
                                >
                                  Output:
                                </Typography>
                                <Box
                                  sx={{
                                    bgcolor: "background.default",
                                    p: 1.5,
                                    borderRadius: 1,
                                    overflow: "auto",
                                    maxHeight: 150,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontFamily: "monospace",
                                      fontSize: "0.75rem",
                                      whiteSpace: "pre-wrap",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {toolCall.output}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </Box>
      ))}

      {/* Streaming Indicator - shown while processing and thoughts are present */}
      {isProcessing && steps.length > 0 && (
        <Box
          sx={{
            borderRadius: 2,
            backgroundColor: "action.hover",
            border: 1,
            borderColor: "primary.main",
            borderStyle: "dashed",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 0.6 },
              "50%": { opacity: 1 },
            },
          }}
        >
          <LoadingFallback message="Streaming AI thoughts..." size={24} height="auto" />
        </Box>
      )}
    </Box>
  );
};

export default ChainOfThoughts;
