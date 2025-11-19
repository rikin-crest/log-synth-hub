import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Typography, IconButton, TextField, Button, Divider } from "@mui/material";
import { Close, Send } from "@mui/icons-material";
import { useDrawer } from "@/contexts/DrawerContext";
import { toast } from "sonner";

const ReleaseNotesDrawer = ({ note }: { note: string }) => {
  const { open, toggleDrawer } = useDrawer();
  const [feedback, setFeedback] = useState("");

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) return;

    // In a real app, this would send data to backend
    toast.success("Feedback submitted successfully!");
    setFeedback("");
  };

  return (
    <div>
      <Drawer
        anchor="right"
        open={open}
        onClose={(_event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
          toggleDrawer(false);
        }}
      >
        <Box sx={{ width: 400, background: "#f2f1f1ff", height: "100vh", display: "flex", flexDirection: "column" }} role="presentation">
          <Box
            sx={{
              p: 3,
              pb: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <IconButton
              onClick={() => toggleDrawer(false)}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                color: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              <Close />
            </IconButton>
            <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
              Notes & Feedback
            </Typography>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Release Notes Section */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: "text.primary" }}>
                Release Note
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#374151",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    fontFamily: "Geist Mono, monospace",
                    whiteSpace: "pre-wrap",
                  }}
                  fontSize="0.85rem"
                >
                  {note || "No configuration generated yet."}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* Generic Feedback Section */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: "text.primary" }}>
                Generic Feedback
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                Have suggestions or found an issue? Let us know how we can improve.
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Type your feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                sx={{
                  bgcolor: "white",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  }
                }}
              />

              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmitFeedback}
                disabled={!feedback.trim()}
                endIcon={<Send />}
                sx={{
                  mt: 2,
                  py: 1,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontWeight: 600,
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a6fd6 0%, #6b4392 100%)",
                  }
                }}
              >
                Submit Feedback
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default ReleaseNotesDrawer;
