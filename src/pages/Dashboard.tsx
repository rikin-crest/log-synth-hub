import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import {
  Logout,
  Settings,
  Psychology,
  AccountTree,
  ExpandMore,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logoutUser } from "../api/auth";
import InputSection from "../components/InputSection";
import ChainOfThoughts from "../components/ChainOfThoughts";
import WorkflowGraph from "../components/WorkflowGraph";
import MappingTable from "../components/MappingTable";
import FeedbackSection from "../components/FeedbackSection";
import { generateConf, resumeWorkflow, startWorkflow } from "@/api/workflow";
import {
  GenerateConfPayload,
  ResumeWorkflowPayload,
  WorkflowResponse,
} from "@/components/types";
import { addToSessionStorage, getFromSessionStorage } from "@/lib/session";
import { getColumns } from "@/lib/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [thoughtSteps, setThoughtSteps] = useState<string[]>([]);
  const [mappingData, setMappingData] = useState<unknown[]>([]);
  const [expandedPanel, setExpandedPanel] = useState<string | false>(
    "thoughts"
  );
  const [workflowImageUrl] = useState<string | undefined>();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const handleGenerateMappings = async (formData: FormData) => {
    setIsProcessing(true);
    setThoughtSteps([]);
    setMappingData([]);

    const result: WorkflowResponse | null = await startWorkflow(formData);

    if (!result) {
      setIsProcessing(false);
      return;
    }

    addToSessionStorage("thread_id", result["thread_id"]);

    setMappingData(result.output || []);
    setIsProcessing(false);
  };

  const handleRerun = async (feedback: string) => {
    toast.info("Re-running AI analysis...");
    setIsProcessing(true);
    setThoughtSteps([]);
    setMappingData([]);

    const thread_id = getFromSessionStorage("thread_id");

    const payload: ResumeWorkflowPayload = {
      thread_id,
      feedback,
    };

    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    const result: WorkflowResponse | null = await resumeWorkflow(
      payload,
      headers
    );

    if (!result) {
      setIsProcessing(false);
      return;
    }

    setMappingData(result.output || []);
    setIsProcessing(false);
  };

  const handleConfGenerate = async () => {
    toast.info("Generating final configuration...");
    setThoughtSteps([]);
    setMappingData([]);

    const thread_id = getFromSessionStorage("thread_id");

    const payload: GenerateConfPayload = {
      thread_id,
    };

    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    await generateConf(payload, headers);
  };

  return (
    <Box sx={{ bgcolor: "background.default", overflow: "hidden !important" }}>
      {/* Header */}
      <AppBar
        position="sticky"
        sx={{
          background:
            "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src="/favicon.ico"
              alt="Logo"
              style={{
                height: "24px",
                width: "24px",
                marginRight: "12px",
                filter: "brightness(0) invert(1)",
              }}
            />
            {/* <AutoAwesome sx={{ mr: 1, fontSize: 32 }} /> */}
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              ParserPilot.ai
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
          <Avatar sx={{ ml: 2, bgcolor: "rgba(255, 255, 255, 0.2)" }}>U</Avatar>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        maxWidth="xl"
        sx={{
          py: 1,
          height: "91vh",
          overflow: "auto",
          display: "flex",
          gap: 3,
        }}
      >
        {/* Left Column - Configuration & Analysis */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "400px",
            minWidth: "400px",
            gap: 1,
          }}
        >
          {/* Input Section - Standalone */}
          <Box
            sx={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,1))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              p: 2,
              height: "fit-content",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Settings sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Input Configuration
              </Typography>
            </Box>
            <InputSection
              onSubmit={handleGenerateMappings}
              isProcessing={isProcessing}
            />
          </Box>

          {/* Chain of Thoughts Accordion */}
          <Accordion
            expanded={expandedPanel === "thoughts"}
            onChange={() =>
              setExpandedPanel(
                expandedPanel === "thoughts" ? false : "thoughts"
              )
            }
            sx={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 1))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px !important",
              "&:before": {
                display: "none",
              },
              "& .MuiAccordionSummary-root": {
                borderRadius: "12px",
              },
              "& .MuiAccordionDetails-root": {
                borderRadius: "0 0 12px 12px",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                  gap: 1,
                },
              }}
            >
              <Psychology sx={{ color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Chain of Thoughts
              </Typography>
              {thoughtSteps.length > 0 && (
                <Chip
                  label={`${thoughtSteps.length} steps`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              )}
            </AccordionSummary>
            <AccordionDetails
              sx={{
                height: 245,
                overflow: "auto",
                p: 2,
              }}
            >
              <ChainOfThoughts
                steps={thoughtSteps}
                isProcessing={isProcessing}
              />
            </AccordionDetails>
          </Accordion>

          {/* Workflow Graph Accordion */}
          <Accordion
            expanded={expandedPanel === "workflow"}
            onChange={() =>
              setExpandedPanel(
                expandedPanel === "workflow" ? false : "workflow"
              )
            }
            sx={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 1))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px !important",
              "&:before": {
                display: "none",
              },
              "& .MuiAccordionSummary-root": {
                borderRadius: "12px",
              },
              "& .MuiAccordionDetails-root": {
                borderRadius: "0 0 12px 12px",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                  gap: 1,
                },
              }}
            >
              <AccountTree sx={{ color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Workflow Graph
              </Typography>
              {workflowImageUrl && (
                <Chip
                  label="Generated"
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              )}
            </AccordionSummary>
            <AccordionDetails
              sx={{
                height: 260,
                overflow: "auto",
                p: 2,
              }}
            >
              <WorkflowGraph
                imageUrl={workflowImageUrl}
                isLoading={isProcessing}
              />
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Right Column - Results & Feedback */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 1,
          }}
        >
          {/* Mapping Table */}
          <Box sx={{ height: "100%", overflow: "visible", width: "100%" }}>
            <MappingTable
              data={mappingData}
              columns={getColumns(mappingData)}
              loading={isProcessing}
            />
          </Box>

          {/* Feedback Section */}
          <Box sx={{ height: "200px", overflow: "visible", width: "100%" }}>
            <FeedbackSection
              onRerun={handleRerun}
              onConfGenerate={handleConfGenerate}
              disabled={mappingData.length === 0}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
