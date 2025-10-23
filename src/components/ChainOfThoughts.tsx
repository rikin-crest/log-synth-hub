import { Box, Typography, CircularProgress } from "@mui/material";
import { Psychology, CheckCircle } from "@mui/icons-material";

interface ChainOfThoughtsProps {
  steps: string[];
  isProcessing: boolean;
}

const ChainOfThoughts = ({ steps, isProcessing }: ChainOfThoughtsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
      }}
    >
      {steps.length === 0 && !isProcessing && (
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
          <Typography variant="body1">
            AI thoughts will appear here during processing
          </Typography>
        </Box>
      )}

      {steps.length === 0 && isProcessing && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 2,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body1" color="text.secondary">
            Generating chain of thoughts...
          </Typography>
        </Box>
      )}

      {steps.map((step, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: "hsl(var(--muted) / 0.3)",
            animation: "slide-in-up 0.4s ease-out",
            transition: "all 0.3s ease",
            flexShrink: 0,
            "&:hover": {
              backgroundColor: "hsl(var(--muted) / 0.5)",
              transform: "translateX(4px)",
            },
          }}
        >
          <CheckCircle
            sx={{
              color: "success.main",
              fontSize: 24,
              flexShrink: 0,
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
            >
              Step {index + 1}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {step}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ChainOfThoughts;
