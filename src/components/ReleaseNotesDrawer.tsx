import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Typography, IconButton, Stack } from "@mui/material";
import { Close } from "@mui/icons-material";

interface ReleaseNote {
  version: string;
  date: string;
  features?: string[];
  improvements?: string[];
  bugFixes?: string[];
}

const releaseNotes: ReleaseNote[] = [
  {
    version: "2.1.0",
    date: "2023-10-27",
    features: [
      "New user dashboard with customizable widgets",
      "Integration with third-party analytics platforms",
      "Dark mode option for improved accessibility",
    ],
    improvements: [
      "Enhanced performance for large datasets",
      "Improved search functionality with fuzzy matching",
      "Refined UI/UX for a more intuitive experience",
    ],
    bugFixes: [
      "Fixed an issue where filters were not resetting correctly",
      "Addressed a memory leak in the data visualization module",
    ],
  },
  {
    version: "2.0.0",
    date: "2023-09-15",
    features: [
      "Completely redesigned user interface",
      "Real-time collaborative editing features",
      "Introduction of a new plugin architecture",
    ],
    improvements: [
      "Faster data loading times",
      "More robust error handling",
      "Optimized mobile responsiveness",
    ],
    bugFixes: [
      "Resolved a critical security vulnerability",
      "Fixed incorrect data display in certain reports",
    ],
  },
];

const ReleaseNotesDrawer = () => {
  // only keep 'right' state
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (nextOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setOpen(nextOpen);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const list = () => (
    <Box
      sx={{ width: 400, background: "#f2f1f1ff", height: "100vh" }}
      role="presentation"
      // onClick={toggleDrawer(false)}
      // onKeyDown={toggleDrawer(false)}
    >
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
          onClick={handleClose}
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
          Release Notes
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Latest updates and improvements
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
        <Stack spacing={3}>
          {releaseNotes.map((note, index) => (
            <Box
              key={index}
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
                {note.improvements}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );

  return (
    <div>
      {releaseNotes.map((notes) => {
        return <div onClick={toggleDrawer(true)}>{notes.version}</div>;
      })}

      <Drawer
        anchor="right"
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
          toggleDrawer(false);
        }}
      >
        {list()}
      </Drawer>
    </div>
  );
};

export default ReleaseNotesDrawer;
