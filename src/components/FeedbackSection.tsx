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
  onRerun: () => void;
  onConfGenerate: (feedback: string) => void;
  disabled: boolean;
}

const FeedbackSection = ({
  onRerun,
  onConfGenerate,
  disabled,
}: FeedbackSectionProps) => {
  const [feedback, setFeedback] = useState("");

  const handleConfGenerate = () => {
    onConfGenerate(feedback);
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
          placeholder="Provide feedback on the generated mappings..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={disabled}
          sx={{
            mb: 3,
            flexGrow: 1,
            overflow: "auto",
            "& .MuiOutlinedInput-root": {
              backgroundColor: disabled ? "hsl(var(--muted) / 0.2)" : "white",
              height: "100%",
              alignItems: "flex-start",
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
            onClick={onRerun}
            disabled={disabled}
            sx={{
              fontWeight: 600,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            Re run
          </Button>
          <Button
            variant="contained"
            size="medium"
            startIcon={<CheckCircle />}
            onClick={handleConfGenerate}
            disabled={disabled}
            sx={{
              fontWeight: 600,
              background:
                "linear-gradient(135deg, hsl(145, 65%, 55%), hsl(145, 65%, 45%))",
              "&:hover": {
                background:
                  "linear-gradient(135deg, hsl(145, 65%, 50%), hsl(145, 65%, 40%))",
              },
            }}
          >
            Conf Generate
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
