import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
} from "@mui/material";
import { AutoAwesome, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import InputSection from "../components/InputSection";
import ChainOfThoughts from "../components/ChainOfThoughts";
import MappingTable from "../components/MappingTable";
import FeedbackSection from "../components/FeedbackSection";
import { generateConf, resumeWorkflow, startWorkflow } from "@/api/workflow";
import {
  FormType,
  GenerateConfPayload,
  ResumeWorkflowPayload,
  StartWorkflowPayload,
  WorkflowResponse,
} from "@/components/types";
import { addToSessionStorage, getFromSessionStorage } from "@/lib/session";
import { getColumns } from "@/lib/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [thoughtSteps, setThoughtSteps] = useState<string[]>([]);
  const [mappingData, setMappingData] = useState<unknown[]>([]);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleGenerateMappings = async (formData: FormType) => {
    setIsProcessing(true);
    setThoughtSteps([]);
    setMappingData([]);

    console.log(formData);
    const payload: StartWorkflowPayload = {
      product_name: "microsoft_defender",
      product_log_name: "DeviceImageLoadEvents",
      raw_logs_path:
        "C:/Users/jainam.parekh/Downloads/parser-generation-tool/data/logs/microsoft_defender/device_image_load_events",
      udm_event_type: "process_module_load",
    };

    // const payload: StartWorkflowPayload = {
    //   product_name: formData.productName,
    //   product_log_name: formData.logCategory,
    //   raw_logs_path: formData.fileName,
    //   udm_event_type: formData.logType,
    // };

    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    try {
      const result: WorkflowResponse | null = await startWorkflow(
        payload,
        headers
      );

      if (!result) return;

      console.log("result", result);

      addToSessionStorage("thread_id", result["thread_id"]);

      setMappingData(result.output || []);

      // console.log(result);
    } catch (e) {
      toast.error("Failed to generate mappings!");
    } finally {
      setIsProcessing(false);
    }
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

    try {
      const result: WorkflowResponse | null = await resumeWorkflow(
        payload,
        headers
      );

      if (!result) return;

      setMappingData(result.output || []);

      console.log(result);
    } catch (e) {
      toast.error("Failed to Resume Workflow!");
    } finally {
      setIsProcessing(false);
    }
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

    try {
      await generateConf(payload, headers);
    } catch (e) {
      toast.error("Failed to Resume Workflow!");
    }
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
            <AutoAwesome sx={{ mr: 1, fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Parser Generator Dashboard
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
        {/* Top Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "800px",
            gap: 1,
          }}
        >
          {/* Left - Input Section */}
          <Box sx={{ height: "40vh" }}>
            <InputSection
              onSubmit={handleGenerateMappings}
              isProcessing={isProcessing}
            />
          </Box>

          {/* Left - Chain of Thoughts */}
          <Box
            sx={{
              height: "53vh",
            }}
          >
            <ChainOfThoughts steps={thoughtSteps} isProcessing={isProcessing} />
          </Box>
        </Box>

        {/* Bottom Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 1,
          }}
        >
          {/* Right - Mapping Table */}
          <Box sx={{ height: "60vh", overflow: "visible", width: "100%" }}>
            <MappingTable
              data={mappingData}
              columns={getColumns(mappingData)}
              loading={isProcessing}
            />
          </Box>

          {/* Right - Feedback Section */}
          <Box sx={{ height: "28vh", overflow: "visible", width: "100%" }}>
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
