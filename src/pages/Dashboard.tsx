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

const Dashboard = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [thoughtSteps, setThoughtSteps] = useState<string[]>([]);
  const [mappingData, setMappingData] = useState<any[]>([]);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleGenerateMappings = (formData: any) => {
    setIsProcessing(true);
    setThoughtSteps([]);
    setMappingData([]);

    const thoughts = [
      "Analyzing log file structure...",
      "Identifying key fields and patterns...",
      "Parsing JSON/KV/XML format...",
      "Extracting metadata and attributes...",
      "Generating mapping relationships...",
      "Optimizing mapping configuration...",
      "Validating mapping consistency...",
      "Finalizing mapping schema...",
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < thoughts.length) {
        setThoughtSteps((prev) => [...prev, thoughts[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);

        const sampleData = Array.from({ length: 35 }, (_, i) => ({
          id: i + 1,
          sourceField: `field_${i + 1}`,
          targetField: `mapped_field_${i + 1}`,
          dataType: ["string", "integer", "boolean", "date", "array"][i % 5],
          transformation: ["direct", "concat", "split", "format", "lookup"][
            i % 5
          ],
          status: ["mapped", "pending", "conflict"][i % 3],
        }));

        setMappingData(sampleData);
        toast.success("Mappings generated successfully!");
      }
    }, 800);
  };

  const handleRerun = () => {
    toast.info("Rerunning AI analysis...");
    setThoughtSteps([]);
    setMappingData([]);
  };

  const handleConfGenerate = (feedback: string) => {
    if (!feedback.trim()) {
      toast.error("Please provide feedback before generating");
      return;
    }
    toast.success("Generating final configuration...");
    console.log("Feedback:", feedback);
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
              AI Mapper Dashboard
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
          <Avatar sx={{ ml: 2, bgcolor: "rgba(255, 255, 255, 0.2)" }}>U</Avatar>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4, height: "90vh", overflow: "auto" }}>
        {/* Top Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Left - Input Section */}
          <Box sx={{ height: "450px", width: 1 / 3, flexShrink: 0 }}>
            <InputSection
              onSubmit={handleGenerateMappings}
              isProcessing={isProcessing}
            />
          </Box>

          {/* Right - Mapping Table */}
          <Box sx={{ height: "450px", overflow: "auto", width: "100%" }}>
            <MappingTable data={mappingData} />
          </Box>
        </Box>

        {/* Bottom Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
          }}
        >
          {/* Left - Chain of Thoughts */}
          <Box
            sx={{
              height: "380px",
              width: 1 / 3,
              flexShrink: 0,
            }}
          >
            <ChainOfThoughts steps={thoughtSteps} isProcessing={isProcessing} />
          </Box>

          {/* Right - Feedback Section */}
          <Box sx={{ height: "380px", overflow: "auto", width: "100%" }}>
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
