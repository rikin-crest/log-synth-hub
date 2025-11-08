import { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
  Tooltip,
  IconButton,
  useTheme,
} from "@mui/material";
import { Feedback, Refresh, CheckCircle, InfoOutlined } from "@mui/icons-material";

interface FeedbackSectionProps {
  onRerun: (feedback: string) => void;
  onConfGenerate: () => void;
  onGetMappingDoc: () => void;
  disabled: boolean;
}

const FeedbackSection = ({ onRerun, onConfGenerate, disabled }: FeedbackSectionProps) => {
  const [feedback, setFeedback] = useState("");

  const theme = useTheme();

  const handleConfGenerate = () => {
    onConfGenerate();
    setFeedback("");
  };

  const openMappingDocTab = () => {
    window.open("/mappingDoc", "_blank");
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          px: 3,

          ".MuiCardContent-root:last-child": {
            p: 0,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1, flexShrink: 0 }}>
          <Feedback sx={{ color: "primary.main", display: "flex", mr: 1 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, display: "flex", alignItems: "center", pb: 0.6 }}
          >
            Feedback & Actions
          </Typography>
          <Tooltip
            title="Provide feedback to refine the mappings and generate the final configuration file"
            arrow
            placement="top"
          >
            <IconButton size="small" sx={{ pb: 0.8, display: "flex", alignItems: "center" }}>
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <TextField
          fullWidth
          placeholder={disabled ? "Generate mappings first..." : "Provide feedback..."}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={disabled}
          sx={{
            mb: 3,
            flexGrow: 1,
            "& .MuiOutlinedInput-root": {
              backgroundColor: disabled ? "action.disabledBackground" : "background.default",
              height: "100%",
              alignItems: "flex-start",
              cursor: disabled ? "no-drop" : "text",

              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "divider !important",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: disabled ? "divider !important" : "primary.main !important",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: disabled ? "divider !important" : "primary.main !important",
              },
              "&.Mui-disabled": {
                cursor: "no-drop !important",
                pointerEvents: "auto !important",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider !important",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider !important",
                },
              },
            },
            "& .MuiOutlinedInput-input": {
              overflow: "auto !important",
              cursor: disabled ? "no-drop !important" : "text",
            },
          }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<Refresh />}
            onClick={() => onRerun(feedback)}
            disabled={disabled}
            sx={{
              fontWeight: 600,
              borderWidth: 2,
              "&:disabled": {
                cursor: "no-drop",
                pointerEvents: "auto",
                borderColor: theme.palette.divider,
              },
              "&:hover": {
                background: disabled ? "inherit" : "inherit",
                boxShadow: disabled ? "none" : "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            Submit Feedback
          </Button>
          <Button
            variant="contained"
            size="medium"
            startIcon={<CheckCircle />}
            onClick={openMappingDocTab}
            // disabled={disabled}
            sx={{
              fontWeight: 600,
              "&:disabled": {
                cursor: "no-drop",
                pointerEvents: "auto",
                color: "#9ca3af !important",
              },
              background: "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))",
              "&:hover": {
                background: disabled
                  ? "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))"
                  : "linear-gradient(135deg, hsl(260, 85%, 55%), hsl(220, 70%, 50%))",
              },
            }}
          >
            Mapping Document
          </Button>
          <Button
            variant="contained"
            size="medium"
            startIcon={<CheckCircle />}
            onClick={handleConfGenerate}
            disabled={disabled}
            sx={{
              fontWeight: 600,
              "&:disabled": {
                cursor: "no-drop",
                pointerEvents: "auto",
                color: "#9ca3af !important",
              },
              background: "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))",
              "&:hover": {
                background: disabled
                  ? "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))"
                  : "linear-gradient(135deg, hsl(260, 85%, 55%), hsl(220, 70%, 50%))",
              },
            }}
          >
            Generate Configuration
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
