import { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Psychology, ExpandMore, Close, Build } from "@mui/icons-material";
import { ThoughtStep, ToolCall, AgentThoughts } from "./types";
import LoadingFallback from "./LoadingFallback";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChainOfThoughtsProps {
  agentThoughts: AgentThoughts[];
  isProcessing: boolean;
  isFullscreen?: boolean;
  onFullscreenClose?: () => void;
}

const ChainOfThoughts = ({
  agentThoughts,
  isProcessing,
  isFullscreen = false,
  onFullscreenClose = () => {},
}: ChainOfThoughtsProps) => {
  // Track expanded state for each agent accordion
  const [expandedAgents, setExpandedAgents] = useState<Record<string, boolean>>({});

  // Normalize tool_calls to always be an array
  const normalizeToolCalls = (toolCalls: ToolCall[] | ToolCall) => {
    if (!toolCalls) return [];
    return Array.isArray(toolCalls) ? toolCalls : [toolCalls];
  };

  // Component for individual thought step
  const ThoughtStepItem = ({ step }: { step: ThoughtStep }) => {
    const toolCalls = normalizeToolCalls(step.tool_calls);
    const hasSingleToolCall = toolCalls.length === 1 && toolCalls[0].name;
    const [expanded, setExpanded] = useState(false);

    return (
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{
          borderRadius: "4px",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.01)",
          "&:before": { display: "none" },
          "&.Mui-expanded": {
            margin: 0,
            mb: 1.5,
          },
          mb: 1.5,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            minHeight: 40,
            px: 2,
            py: 0.5,
            borderRadius: "4px",
            "&.Mui-expanded": {
              borderRadius: "4px 4px 0 0",
            },
            "& .MuiAccordionSummary-content": {
              my: 0.5,
              alignItems: "center",
              gap: 1.5,
            },
          }}
        >
          {step.message_type === "AIMessage" ? (
            <Psychology sx={{ fontSize: 18, color: "primary.main", mr: -0.2 }} />
          ) : (
            <Build sx={{ fontSize: 16, color: "secondary.main" }} />
          )}
          <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
            {hasSingleToolCall ? toolCalls[0].name : "AI Message"}
          </Typography>
          <Chip
            label={step.message_type === "AIMessage" ? "AI" : "Tool"}
            size="small"
            color={step.message_type === "AIMessage" ? "primary" : "secondary"}
            sx={{ height: 18, fontSize: "0.6rem" }}
          />
        </AccordionSummary>

        <AccordionDetails
          sx={{
            p: 2,
            pt: 1,
            maxHeight: 400,
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: (theme) =>
                theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: (theme) =>
                theme.palette.mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
              borderRadius: "3px",
              "&:hover": {
                background: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
              },
            },
          }}
        >
          {/* Content */}
          {step.content?.length > 0 && (
            <Box
              sx={
                {
                  // p: 1.5,
                  // mb: 1.5,
                }
              }
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  mb: 0.5,
                  display: "block",
                  fontSize: "0.65rem",
                }}
              >
                Content:
              </Typography>
              <Box
                sx={{
                  color: "text.primary",
                  fontSize: "0.8rem",
                  wordBreak: "break-word",
                  lineHeight: 1.5,
                  maxHeight: 150,
                  overflow: "auto",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor: "divider",
                  "& p": { margin: 0, marginBottom: "0.5em" },
                  "& p:last-child": { marginBottom: 0 },
                  "& ul, & ol": { margin: 0, paddingLeft: "1.5em", marginBottom: "0.5em" },
                  "& li": { marginBottom: "0.25em" },
                  "& code": {
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                    padding: "0.1em 0.3em",
                    borderRadius: "3px",
                    fontSize: "0.9em",
                    fontFamily: "monospace",
                  },
                  "& pre": {
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.05)",
                    padding: "0.5em",
                    borderRadius: "4px",
                    overflow: "auto",
                    marginBottom: "0.5em",
                  },
                  "& pre code": {
                    backgroundColor: "transparent",
                    padding: 0,
                  },
                  "& strong": { fontWeight: 600 },
                  "& em": { fontStyle: "italic" },
                  "& h1, & h2, & h3, & h4, & h5, & h6": {
                    margin: 0,
                    marginBottom: "0.5em",
                    fontWeight: 600,
                  },
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.content}</ReactMarkdown>
              </Box>
            </Box>
          )}

          {/* Tool Call */}
          {hasSingleToolCall && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {/* Tool Args */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    mb: 0.5,
                    display: "block",
                    fontSize: "0.65rem",
                  }}
                >
                  Arguments:
                </Typography>
                <Box
                  sx={{
                    bgcolor: "background.default",
                    p: 1,
                    borderRadius: "4px",
                    overflow: "auto",
                    maxHeight: 150,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      fontFamily: "monospace",
                      fontSize: "0.7rem",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {typeof toolCalls[0].args === "string"
                      ? JSON.stringify(JSON.parse(toolCalls[0].args), null, 2)
                      : JSON.stringify(toolCalls[0].args, null, 2)}
                  </pre>
                </Box>
              </Box>

              {/* Tool Output */}
              {toolCalls[0].output && (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      mb: 0.5,
                      display: "block",
                      fontSize: "0.65rem",
                    }}
                  >
                    Output:
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: "background.default",
                      p: 1,
                      borderRadius: "4px",
                      overflow: "auto",
                      maxHeight: 150,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <pre
                      style={{
                        margin: 0,
                        fontFamily: "monospace",
                        fontSize: "0.7rem",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {typeof toolCalls[0].output === "string"
                        ? JSON.stringify(JSON.parse(toolCalls[0].output), null, 2)
                        : JSON.stringify(toolCalls[0].output, null, 2)}
                    </pre>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderThoughts = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Render each agent's thoughts */}
      {agentThoughts.map((agent) => {
        const isMapper = agent.agent_name === "mapper";
        const displayName = isMapper
          ? "Mapper Agent"
          : `Corrector Agent - Invocation ${agent.agent_name.split("-")[1]}`;

        // Initialize expanded state for new agents (default to expanded for latest agent)
        const isExpanded = expandedAgents[agent.agent_name];

        return (
          <Accordion
            key={agent.agent_name}
            expanded={isExpanded}
            onChange={() =>
              setExpandedAgents((prev) => ({ ...prev, [agent.agent_name]: !isExpanded }))
            }
            sx={{
              borderRadius: "4px",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              "&:before": { display: "none" },
              "&.Mui-expanded": {
                margin: 0,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                minHeight: 48,
                px: 2,
                backgroundColor: isMapper ? "primary.main" : "secondary.main",
                color: isMapper ? "primary.contrastText" : "secondary.contrastText",
                borderRadius: "4px",
                "&.Mui-expanded": {
                  borderRadius: "4px 4px 0 0",
                },
                "& .MuiAccordionSummary-content": {
                  my: 1,
                  alignItems: "center",
                  gap: 1,
                },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
                {displayName}
              </Typography>
              <Chip
                label={`${agent.thoughts.length} steps`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.7rem",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "inherit",
                }}
              />
            </AccordionSummary>
            <AccordionDetails sx={{ p: 2, backgroundColor: "background.paper" }}>
              {agent.thoughts.map((step, stepIdx) => (
                <ThoughtStepItem key={`${agent.agent_name}-${stepIdx}`} step={step} />
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Streaming Indicator */}
      {isProcessing && (
        <Box
          sx={{
            borderRadius: "4px",
            backgroundColor: "action.hover",
            border: "1px dashed",
            borderColor: "primary.main",
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

  if (agentThoughts?.length === 0 && !isProcessing) {
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
        <Typography variant="body1">Sources used for mapping will appear here</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "100%",
          overflow: "auto",
          p: 0.5,
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: (theme) =>
              theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: (theme) =>
              theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
            borderRadius: "3px",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
            },
          },
        }}
      >
        {renderThoughts()}
      </Box>

      {/* Fullscreen Modal */}
      <Dialog
        open={isFullscreen}
        onClose={onFullscreenClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "90vh",
            height: "90vh",
            backgroundColor: "background.paper",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
            py: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Psychology sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Chain of Thoughts
            </Typography>
          </Box>
          <IconButton onClick={onFullscreenClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, overflow: "auto", pt: "24px !important" }}>
          {renderThoughts()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChainOfThoughts;
