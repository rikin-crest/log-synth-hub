import { Box, Typography, CircularProgress, Dialog, IconButton } from "@mui/material";
import { AccountTree, Close, Fullscreen } from "@mui/icons-material";
import { useState } from "react";
import image from "../assets/image.png"

interface WorkflowGraphProps {
  imageUrl?: string;
  isLoading?: boolean;
}

const WorkflowGraph = ({ imageUrl, isLoading = false }: WorkflowGraphProps) => {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const handleFullscreenOpen = () => {
    setFullscreenOpen(true);
  };

  const handleFullscreenClose = () => {
    setFullscreenOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
      }}
    >
      {/* {!imageUrl && !isLoading && (
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
      )} */}

      {/* {isLoading && (
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
      )} */}

      
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: '100%',
            height: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "relative",
              cursor: "pointer",
              "&:hover .fullscreen-btn": {
                opacity: 1,
              },
            }}
            onClick={handleFullscreenOpen}
          >
            <img
              src={image}
              alt="Workflow Graph"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            />
            <IconButton
              className="fullscreen-btn"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                opacity: 0,
                transition: "opacity 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                },
              }}
              size="small"
            >
              <Fullscreen fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Fullscreen Dialog */}
        <Dialog
          open={fullscreenOpen}
          onClose={handleFullscreenClose}
          maxWidth={false}
          fullScreen
          sx={{
            "& .MuiDialog-paper": {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 2,
            }}
          >
            <IconButton
              onClick={handleFullscreenClose}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                zIndex: 1,
              }}
            >
              <Close />
            </IconButton>
            <img
              src={image}
              alt="Workflow Graph - Fullscreen"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        </Dialog>
      
    </Box>
  );
};

export default WorkflowGraph;
