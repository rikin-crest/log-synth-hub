import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import { Logout, Brightness4, Brightness7, Person } from "@mui/icons-material";

import { useState, useEffect } from "react";
import { useThemeMode } from "../contexts/ThemeContext";
import { useLogout } from "../hooks/use-auth";
import { isAuthenticated } from "../api/auth";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, toggleTheme } = useThemeMode();

  const [userName, setUserName] = useState<string>("User");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // TanStack Query hooks
  const logoutMutation = useLogout();

  // Check authentication on mount and load user info
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/", { replace: true });
    } else {
      // Load user info from localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUserName(userStr.toString() || "User");
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }
    }
  }, [navigate]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logoutMutation.mutate();
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, md: 64 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src="/favicon.ico"
              alt="Logo"
              style={{
                height: isMobile ? "20px" : "24px",
                width: isMobile ? "20px" : "24px",
                marginRight: isMobile ? "8px" : "12px",
                filter: "brightness(0) invert(1)",
              }}
            />
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
              }}
            >
              ParserPilot.ai
            </Typography>
          </Box>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            size={isMobile ? "small" : "medium"}
            sx={{ mr: { xs: 0.5, md: 1 } }}
          >
            {mode === "dark" ? (
              <Brightness7 sx={{ fontSize: { xs: 20, md: 24 } }} />
            ) : (
              <Brightness4 sx={{ fontSize: { xs: 20, md: 24 } }} />
            )}
          </IconButton>
          <IconButton onClick={handleMenuOpen} size={isMobile ? "small" : "medium"}>
            <Avatar
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                width: { xs: 32, md: 40 },
                height: { xs: 32, md: 40 },
                fontSize: { xs: "0.875rem", md: "1rem" },
                fontWeight: 600,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1.5,
              },
            }}
          >
            <MenuItem>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText
                sx={{
                  pb: 0.2,
                }}
              >
                {userName}
              </ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText
                sx={{
                  color: "error.main",
                  pb: 0.2,
                }}
              >
                Logout
              </ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavigationBar;
