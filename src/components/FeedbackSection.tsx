import { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Feedback, Refresh, CheckCircle } from "@mui/icons-material";

interface FeedbackSectionProps {
  onRerun: (feedback: string) => void;
  onConfGenerate: () => void;
  disabled: boolean;
}

const FeedbackSection = ({
  onRerun,
  onConfGenerate,
  disabled,
}: FeedbackSectionProps) => {
  const [feedback, setFeedback] = useState("");

  const handleConfGenerate = () => {
    onConfGenerate();
    setFeedback("");
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

          ".MuiCardContent-root:last-child": {
            p: 0,
          },
        }}
      >
        <Box sx={{ display: "flex", mb: 1, flexShrink: 0 }}>
          <Feedback sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Feedback & Actions
          </Typography>
        </Box>

        <TextField
          fullWidth
          placeholder={
            disabled ? "Generate mappings first..." : "Provide feedback..."
          }
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={disabled}
          sx={{
            mb: 3,
            flexGrow: 1,
            "& .MuiOutlinedInput-root": {
              backgroundColor: disabled
                ? "action.disabledBackground"
                : "background.default",
              height: "100%",
              alignItems: "flex-start",
              cursor: disabled ? "no-drop" : "text",

              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "divider !important",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: disabled
                  ? "divider !important"
                  : "primary.main !important",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: disabled
                  ? "divider !important"
                  : "primary.main !important",
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
            onClick={handleConfGenerate}
            disabled={disabled}
            sx={{
              fontWeight: 600,
              "&:disabled": {
                cursor: "no-drop",
                pointerEvents: "auto",
                color: "#9ca3af !important",
              },
              background:
                "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))",
              "&:hover": {
                background: disabled
                  ? "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))"
                  : "linear-gradient(135deg, hsl(260, 85%, 55%), hsl(220, 70%, 50%))",
              },
            }}
          >
            Generate Conf
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
