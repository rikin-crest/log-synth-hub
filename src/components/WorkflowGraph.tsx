import { Box, Typography, CircularProgress } from "@mui/material";
import { AccountTree } from "@mui/icons-material";

interface WorkflowGraphProps {
  imageUrl?: string;
  isLoading?: boolean;
}

const WorkflowGraph = ({ imageUrl, isLoading = false }: WorkflowGraphProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
      }}
    >
      {!imageUrl && !isLoading && (
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
          <AccountTree sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
          <Typography variant="body1">
            Workflow graph will appear here after processing
          </Typography>
        </Box>
      )}

      {isLoading && (
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
            Generating workflow graph...
          </Typography>
        </Box>
      )}

      {imageUrl && !isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <img
            src={imageUrl}
            alt="Workflow Graph"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default WorkflowGraph;
