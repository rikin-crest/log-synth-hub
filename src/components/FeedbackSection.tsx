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
  onRerun: (feedback: string) => Promise<void>;
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
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 1))",
        border: "1px solid hsl(var(--border))",
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
          placeholder="Provide feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={disabled}
          sx={{
            mb: 3,
            flexGrow: 1,
            "& .MuiOutlinedInput-root": {
              backgroundColor: disabled ? "hsl(var(--muted) / 0.2)" : "white",
              height: "100%",
              alignItems: "flex-start",

              // remove hover/focus border color & animation
              "& > fieldset": {
                borderColor: "hsl(var(--border)) !important",
                transition: "none !important", // <-- disables color animation
              },
              "&:hover > fieldset": {
                borderColor: "hsl(var(--border)) !important",
              },
              "&.Mui-focused > fieldset": {
                borderColor: "hsl(var(--border)) !important",
              },
              "&.Mui-disabled > fieldset": {
                borderColor: "hsl(var(--border)) !important",
              },
            },
            "& .MuiOutlinedInput-input": {
              overflow: "auto !important",
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
