import { useState, lazy, Suspense } from "react";
import { Box, Typography, IconButton, Tabs, Tab } from "@mui/material";
import { Settings, Psychology, AccountTree, Fullscreen } from "@mui/icons-material";
import { toast } from "sonner";
import { useStartWorkflow, useResumeWorkflow, useGenerateConf } from "../hooks/use-workflow";
import InputSection from "../components/InputSection";
import { ThoughtStep, AgentThoughts } from "../components/types";

import { DrawerProvider } from "@/contexts/DrawerContext";

// Import Navigation bar
import NavigationBar from "@/components/NavigationBar";

// Lazy load heavy components
const ChainOfThoughts = lazy(() => import("../components/ChainOfThoughts"));
const WorkflowGraph = lazy(() => import("../components/WorkflowGraph"));
const MappingTable = lazy(() => import("../components/MappingTable"));
const FeedbackSection = lazy(() => import("../components/FeedbackSection"));
// const ReleaseNotes = lazy(() => import("../components/ReleaseNotes"));
const ReleaseNotesDrawer = lazy(() => import("../components/ReleaseNotesDrawer"));

// Import LoadingFallback directly (not lazy since it's used in fallbacks)
import LoadingFallback from "../components/LoadingFallback";
import { addToSessionStorage, getFromSessionStorage } from "@/lib/session";
import { getColumns } from "@/lib/utils";

const Dashboard = () => {
  const [agentThoughts, setAgentThoughts] = useState<AgentThoughts[]>([]);
  const [currentInvocationNumber, setCurrentInvocationNumber] = useState<number>(0);
  const [mappingData, setMappingData] = useState<Record<string, unknown>[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isThoughtsFullscreen, setIsThoughtsFullscreen] = useState(false);
  const [releaseNote, setReleaseNote] = useState("");

  // Passing mapping schema to handle state of buttons
  const [mappingSchema, setMappingSchema] = useState("");

  // TanStack Query hooks
  const startWorkflowMutation = useStartWorkflow();
  const resumeWorkflowMutation = useResumeWorkflow();
  const generateConfMutation = useGenerateConf();

  // Compute loading state from mutations
  const isProcessing = startWorkflowMutation.isPending || resumeWorkflowMutation.isPending;

  // Toggle release notes drawer

  const handleGenerateMappings = (formData: FormData) => {
    setAgentThoughts([]);
    setMappingData([]);
    setCurrentInvocationNumber(0); // Reset invocation counter

    // Process streaming thought steps
    const processThoughtStep = (thought: ThoughtStep) => {
      if (thought) {
        setAgentThoughts((prevAgents) => {
          // Determine agent name - mapper thoughts go to "mapper", corrector thoughts go to current invocation
          const agentName = thought.agent_name.toLowerCase().includes("mapper")
            ? "mapper"
            : "mapper"; // During initial generation, only mapper thoughts should come

          // Check if this agent already exists
          const existingAgentIndex = prevAgents.findIndex((a) => a.agent_name === agentName);

          if (existingAgentIndex >= 0) {
            // Add thought to existing agent
            const updated = [...prevAgents];
            updated[existingAgentIndex] = {
              ...updated[existingAgentIndex],
              thoughts: [...updated[existingAgentIndex].thoughts, thought],
            };
            return updated;
          } else {
            // Create new agent entry
            return [...prevAgents, { agent_name: agentName, thoughts: [thought] }];
          }
        });
      }
    };

    // Start the workflow with streaming support
    startWorkflowMutation.mutate(
      {
        formData,
        onThought: processThoughtStep,
      },
      {
        onSuccess: (result) => {
          if (result) {
            addToSessionStorage("thread_id", result.thread_id);
            setMappingData(result.output || []);
          }
        },
      }
    );
  };

  const handleRerun = (feedback: string) => {
    toast.info("Re-running AI analysis...");
    // Don't reset agentThoughts to preserve chain of thoughts from previous agents
    setMappingData([]);

    // Increment invocation number for this new corrector run
    const invocationNumber = currentInvocationNumber + 1;
    setCurrentInvocationNumber(invocationNumber);

    const thread_id = getFromSessionStorage("thread_id");

    const payload = {
      thread_id,
      feedback,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    // Process streaming thought steps
    const processThoughtStep = (thought: ThoughtStep) => {
      if (thought) {
        setAgentThoughts((prevAgents) => {
          // Use the invocation number that was set when handleRerun was called
          const agentName = `corrector-${invocationNumber}`;

          // Check if this agent already exists
          const existingAgentIndex = prevAgents.findIndex((a) => a.agent_name === agentName);

          if (existingAgentIndex >= 0) {
            // Add thought to existing agent
            const updated = [...prevAgents];
            updated[existingAgentIndex] = {
              ...updated[existingAgentIndex],
              thoughts: [...updated[existingAgentIndex].thoughts, thought],
            };
            return updated;
          } else {
            // Create new agent entry
            return [...prevAgents, { agent_name: agentName, thoughts: [thought] }];
          }
        });
      }
    };

    resumeWorkflowMutation.mutate(
      {
        payload,
        headers,
        onThought: processThoughtStep,
      },
      {
        onSuccess: (result) => {
          if (result) {
            setMappingData(result.output || []);
          }
        },
      }
    );
  };

  const handleConfGenerate = async () => {
    toast.info("Generating final configuration...");
    // Don't reset agentThoughts to preserve chain of thoughts from previous agents
    setMappingData([]);

    const thread_id = getFromSessionStorage("thread_id");
    const payload = {
      thread_id,
    };

    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    await generateConfMutation.mutateAsync(
      { payload, headers },
      {
        onSuccess: (data) => {
          if (data) setReleaseNote(data);
        },
      }
    );
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        overflow: "hidden !important",
        height: "100vh",
      }}
    >
      {/* Header */}
      <NavigationBar />

      {/* Main Content */}
      <Box
        sx={{
          py: { xs: 1, md: 1 },
          px: { xs: 1, sm: 2 },
          minHeight: {
            xs: "calc(100vh - 56px)",
            md: "calc(100vh - 64px)",
          },
          height: {
            xs: "calc(100vh - 56px)",
            md: "calc(100vh - 64px)",
          },
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 1, md: 1 },
          width: "100%",
          maxWidth: "none",
        }}
      >
        {/* Left Column - Configuration & Analysis */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", md: "400px" },
            minWidth: { xs: "auto", md: "400px" },
            minHeight: { xs: "auto", md: "600px" },
            gap: 1,
            order: { xs: 1, md: 1 },
          }}
        >
          {/* Input Section - Standalone */}
          <Box
            sx={{
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
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
              mappingSchema={mappingSchema}
              setMappingSchema={setMappingSchema}
            />
          </Box>

          {/* Analysis Section with Tabs */}
          <Box
            sx={{
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {/* Tab Bar */}
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  minHeight: { xs: 48, md: 56 },
                  textTransform: "none",
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  fontWeight: 600,
                  px: { xs: 2, md: 3 },
                },
              }}
            >
              <Tab
                icon={<Psychology sx={{ fontSize: { xs: 24, md: 24 } }} />}
                iconPosition={"start"}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "0.875rem", md: "0.875rem" },
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      Thoughts
                    </Typography>
                    {agentThoughts.length > 0 && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsThoughtsFullscreen(true);
                        }}
                        sx={{
                          p: 0.5,
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        <Fullscreen fontSize="small" color="primary" />
                      </IconButton>
                    )}
                  </Box>
                }
              />
              <Tab
                icon={<AccountTree sx={{ fontSize: { xs: 24, md: 24 } }} />}
                iconPosition={"start"}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 0.5, md: 1 },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "0.875rem", md: "0.875rem" },
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      Workflow Graph
                    </Typography>
                  </Box>
                }
              />
            </Tabs>

            {/* Tab Content */}
            <Box
              sx={{
                p: { xs: 1.5, md: 1.5 },
                overflow: "hidden",
                flex: 1,
                minHeight: { xs: 200, md: 245 },
                maxHeight: { xs: "60vh", md: "none" },
              }}
            >
              {activeTab === 0 && (
                <Suspense fallback={<LoadingFallback message="Loading chain of thoughts..." />}>
                  <>
                    <ChainOfThoughts
                      agentThoughts={agentThoughts}
                      isProcessing={isProcessing}
                      isFullscreen={isThoughtsFullscreen}
                      onFullscreenClose={() => setIsThoughtsFullscreen(false)}
                    />
                  </>
                </Suspense>
              )}
              {activeTab === 1 && (
                <Suspense fallback={<LoadingFallback message="Loading workflow graph..." />}>
                  <WorkflowGraph />
                </Suspense>
              )}
            </Box>
          </Box>
        </Box>

        {/* Right Column - Results & Feedback */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            minWidth: { xs: "auto", md: "400px" },
            minHeight: { xs: "auto", md: "600px" },
            gap: 1,
            order: { xs: 2, md: 2 },
          }}
        >
          {/* Mapping Table */}
          <Box
            sx={{
              height: {
                xs: "400px", // Mobile
                md: "100%", // Desktop - flexible
              },
              minHeight: { xs: "400px", md: "auto" },
              overflow: "hidden",
              width: "100%",
              maxWidth: "100%",
              flex: { xs: "0 0 auto", md: 1 },
            }}
          >
            <Suspense
              fallback={
                <LoadingFallback message="Loading mapping table..." size={40} height="100%" />
              }
            >
              <MappingTable
                data={mappingData}
                columns={getColumns(mappingData)}
                loading={isProcessing}
              />
            </Suspense>
          </Box>

          {/* Feedback Section */}
          <Box
            sx={{
              height: { xs: "100%", md: "200px" },
              overflow: "visible",
              width: "100%",
            }}
          >
            <Suspense
              fallback={
                <LoadingFallback message="Loading feedback section..." size={28} height="100%" />
              }
            >
              <DrawerProvider>
                <FeedbackSection
                  onRerun={handleRerun}
                  onConfGenerate={handleConfGenerate}
                  disabled={mappingData.length === 0 || mappingSchema === "ocsf"}
                />
                <ReleaseNotesDrawer note={releaseNote} />
              </DrawerProvider>
            </Suspense>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
