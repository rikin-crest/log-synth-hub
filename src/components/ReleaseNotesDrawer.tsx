import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Typography } from "@mui/material";
import { Newspaper } from "@mui/icons-material";

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
  {
    version: "1.5.1",
    date: "2023-08-01",
    bugFixes: [
      "Hotfix for a login authentication issue",
      "Corrected a minor styling bug on Safari",
    ],
  },
  {
    version: "1.5.0",
    date: "2023-07-20",
    features: ["Export data to CSV and PDF formats", "Customizable email notification settings"],
    improvements: [
      "Improved accessibility for keyboard navigation",
      "Better handling of concurrent user requests",
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

  const list = () => (
    <Box
      sx={{ width: 700 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
        <Newspaper sx={{ mr: 1, color: "primary.main", display: "flex" }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, display: "flex", alignItems: "center", pb: 0.2 }}
        >
          Release Note
        </Typography>
      </Box>
      <Box></Box>
    </Box>
  );

  return (
    <div>
      {releaseNotes.map((notes) => {
        return <div onClick={toggleDrawer(true)}>{notes.version}</div>;
      })}

      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
};

export default ReleaseNotesDrawer;
