import { useState, useEffect, lazy, Suspense } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Chip,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Logout,
  Settings,
  Psychology,
  AccountTree,
  Brightness4,
  Brightness7,
  Person,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isAuthenticated } from "../api/auth";
import { useLogout } from "../hooks/use-auth";
import { useThemeMode } from "../contexts/ThemeContext";
import { useStartWorkflow, useResumeWorkflow, useGenerateConf } from "../hooks/use-workflow";
import InputSection from "../components/InputSection";

// Lazy load heavy components
const ChainOfThoughts = lazy(() => import("../components/ChainOfThoughts"));
const WorkflowGraph = lazy(() => import("../components/WorkflowGraph"));
const MappingTable = lazy(() => import("../components/MappingTable"));
const FeedbackSection = lazy(() => import("../components/FeedbackSection"));

// Import LoadingFallback directly (not lazy since it's used in fallbacks)
import LoadingFallback from "../components/LoadingFallback";
import { addToSessionStorage, getFromSessionStorage } from "@/lib/session";
import { getColumns } from "@/lib/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, toggleTheme } = useThemeMode();
  const [thoughtSteps, setThoughtSteps] = useState<string[]>([]);
  const [mappingData, setMappingData] = useState<Record<string, unknown>[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState<string>("User");

  // TanStack Query hooks
  const logoutMutation = useLogout();
  const startWorkflowMutation = useStartWorkflow();
  const resumeWorkflowMutation = useResumeWorkflow();
  const generateConfMutation = useGenerateConf();

  // Compute loading state from mutations
  const isProcessing = startWorkflowMutation.isPending || resumeWorkflowMutation.isPending;

  // Check authentication on mount and load user info
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/", { replace: true });
    } else {
      // Load user info from localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUserName(userStr.toString() || "User");
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    handleMenuClose();
    logoutMutation.mutate();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGenerateMappings = (formData: FormData) => {
    setThoughtSteps([]);
    setMappingData([]);

    startWorkflowMutation.mutate(formData, {
      onSuccess: (result) => {
        if (result) {
          addToSessionStorage("thread_id", result["thread_id"]);
          setMappingData(result.output || []);
        }
      },
    });
  };

  const handleRerun = (feedback: string) => {
    toast.info("Re-running AI analysis...");
    setThoughtSteps([]);
    setMappingData([]);

    const thread_id = getFromSessionStorage("thread_id");

    const payload = {
      thread_id,
      feedback,
    };

    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    resumeWorkflowMutation.mutate(
      { payload, headers },
      {
        onSuccess: (result) => {
          if (result) {
            setMappingData(result.output || []);
          }
        },
      }
    );
  };

  const handleConfGenerate = () => {
    toast.info("Generating final configuration...");
    setThoughtSteps([]);
    setMappingData([]);

    const thread_id = getFromSessionStorage("thread_id");

    const payload = {
      thread_id,
    };

    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    generateConfMutation.mutate({ payload, headers });
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
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, md: 64 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src="/favicon.ico"
              alt="Logo"
              style={{
                height: isMobile ? "20px" : "24px",
                width: isMobile ? "20px" : "24px",
                marginRight: isMobile ? "8px" : "12px",
                filter: "brightness(0) invert(1)",
              }}
            />
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
              }}
            >
              ParserPilot.ai
            </Typography>
          </Box>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            size={isMobile ? "small" : "medium"}
            sx={{ mr: { xs: 0.5, md: 1 } }}
          >
            {mode === "dark" ? (
              <Brightness7 sx={{ fontSize: { xs: 20, md: 24 } }} />
            ) : (
              <Brightness4 sx={{ fontSize: { xs: 20, md: 24 } }} />
            )}
          </IconButton>
          <IconButton onClick={handleMenuOpen} size={isMobile ? "small" : "medium"}>
            <Avatar
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                width: { xs: 32, md: 40 },
                height: { xs: 32, md: 40 },
                fontSize: { xs: "0.875rem", md: "1rem" },
                fontWeight: 600,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1.5,
              },
            }}
          >
            <MenuItem>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText
                sx={{
                  pb: 0.2,
                }}
              >
                {userName}
              </ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText
                sx={{
                  color: "error.main",
                  pb: 0.2,
                }}
              >
                Logout
              </ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

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
            <InputSection onSubmit={handleGenerateMappings} isProcessing={isProcessing} />
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
              variant={"fullWidth"}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  minHeight: { xs: 48, md: 56 },
                  textTransform: "none",
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  fontWeight: 600,
                  px: { xs: 1, md: 2 },
                },
              }}
            >
              <Tab
                icon={<Psychology sx={{ fontSize: { xs: 18, md: 24 } }} />}
                iconPosition={isMobile ? "top" : "start"}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 0.5, md: 1 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "0.75rem", md: "0.875rem" },
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      {isMobile ? "Thoughts" : "Chain of Thoughts"}
                    </Typography>
                    {thoughtSteps.length > 0 && (
                      <Chip
                        label={`${thoughtSteps.length} steps`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: { xs: "0.65rem", md: "0.75rem" } }}
                      />
                    )}
                  </Box>
                }
              />
              <Tab
                icon={<AccountTree sx={{ fontSize: { xs: 18, md: 24 } }} />}
                iconPosition={isMobile ? "top" : "start"}
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
                        fontSize: { xs: "0.75rem", md: "0.875rem" },
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      {isMobile ? "Workflow" : "Workflow Graph"}
                    </Typography>
                  </Box>
                }
              />
            </Tabs>

            {/* Tab Content */}
            <Box
              sx={{
                p: { xs: 1.5, md: 2 },
                overflow: "auto",
                flex: 1,
                minHeight: { xs: 200, md: 245 },
              }}
            >
              {activeTab === 0 && (
                <Suspense fallback={<LoadingFallback message="Loading chain of thoughts..." />}>
                  <ChainOfThoughts steps={thoughtSteps} isProcessing={isProcessing} />
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
              <FeedbackSection
                onRerun={handleRerun}
                onConfGenerate={handleConfGenerate}
                disabled={mappingData.length === 0}
              />
            </Suspense>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
