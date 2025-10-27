import { createTheme, PaletteMode } from "@mui/material/styles";

export const createMuiTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "hsl(260, 85%, 60%)",
        light: "hsl(260, 85%, 70%)",
        dark: "hsl(260, 85%, 45%)",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "hsl(220, 70%, 55%)",
        light: "hsl(220, 70%, 65%)",
        dark: "hsl(220, 70%, 45%)",
        contrastText: "#ffffff",
      },
      background:
        mode === "light"
          ? {
              default: "hsl(220, 25%, 97%)",
              paper: "#ffffff",
            }
          : {
              default: "hsl(220, 15%, 15%)",
              paper: "hsl(220, 15%, 15%)",
            },
      text:
        mode === "light"
          ? {
              primary: "hsl(240, 20%, 15%)",
              secondary: "hsl(240, 10%, 45%)",
            }
          : {
              primary: "hsl(0, 0%, 95%)",
              secondary: "hsl(0, 0%, 70%)",
            },
      error: {
        main: "hsl(0, 85%, 60%)",
      },
      success: {
        main: "hsl(145, 65%, 55%)",
      },
      warning: {
        main: "hsl(35, 90%, 60%)",
      },
      divider: mode === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)",
      action:
        mode === "light"
          ? {
              hover: "rgba(0, 0, 0, 0.04)",
              selected: "rgba(0, 0, 0, 0.08)",
              disabledBackground: "rgba(0, 0, 0, 0.05)",
            }
          : {
              hover: "rgba(255, 255, 255, 0.08)",
              selected: "rgba(255, 255, 255, 0.16)",
              disabledBackground: "rgba(255, 255, 255, 0.05)",
            },
    },
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 600,
        fontSize: "2rem",
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.25rem",
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 500,
        fontSize: "1.125rem",
        lineHeight: 1.5,
      },
      h6: {
        fontWeight: 500,
        fontSize: "1rem",
        lineHeight: 1.5,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            padding: "10px 24px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
          },
          contained: {
            background: "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))",
            "&:hover": {
              background: "linear-gradient(135deg, hsl(260, 85%, 55%), hsl(220, 70%, 50%))",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            borderRadius: 16,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
              "&:hover:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline": {
                borderColor: "hsl(260, 85%, 60%)",
              },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });
