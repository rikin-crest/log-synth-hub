import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDrawer } from "@/contexts/DrawerContext";

const ReleaseNotesDrawer = ({ note }: { note: string }) => {
  const { open, toggleDrawer } = useDrawer();
  
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
        <Box sx={{ width: 400, background: "#f2f1f1ff", height: "100vh" }} role="presentation">
          <Box
            sx={{
              p: 3,
              pb: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              position: "relative",
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
            <Typography variant="h2" fontWeight="700" sx={{ mb: 1 }}>
              Release Note
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Latest updates and improvements
            </Typography>
          </Box>
          <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 0.5,
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
                  p: 1,
                  fontFamily: "Geist Mono, monospace",
                }}
                fontSize="0.9rem"
              >
                {note}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default ReleaseNotesDrawer;
