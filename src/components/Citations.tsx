import { Box, Typography, Chip, Link } from "@mui/material";
import { Source, OpenInNew } from "@mui/icons-material";

interface CitationsProps {
  citations: Citation[];
  isProcessing: boolean;
}

interface Citation {
  id: string;
  title: string;
  source: string;
  url?: string;
}

const Citations = ({ citations, isProcessing }: CitationsProps) => {
  // Show empty state when no citations are available
  if (citations.length === 0 && !isProcessing) {
    return (
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
        <Source sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
        <Typography variant="body1">Sources used for mapping will appear here</Typography>
      </Box>
    );
  }

  const renderCitations = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {citations.map((citation, index) => {
        return (
          <Box
            key={citation.id}
            sx={{
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              overflow: "hidden",
              transition: "all 0.3s ease",
              display: "flex",
              "&:hover": {
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(0, 0, 0, 0.4)"
                    : "0 4px 12px rgba(0, 0, 0, 0.1)",
                borderColor: "primary.main",
              },
            }}
          >
            {/* Citation Number - Full Height Stripe */}
            <Box
              sx={{
                width: 40,
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.875rem",
                borderRadius: "8px 0 0 8px",
              }}
            >
              {index + 1}
            </Box>

            {/* Citation Content */}
            <Box
              sx={{
                p: 1.5,
                flex: 1,
                minWidth: 0,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: "0.8rem",
                  lineHeight: 1.4,
                }}
              >
                {citation.title}
              </Typography>

              {/* URL Preview */}
              {citation.url && (
                <Link
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "primary.main",
                    textDecoration: "none",
                    width: "fit-content",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  <OpenInNew sx={{ fontSize: 12 }} />
                  {citation.url.replace(/^https?:\/\//, "").substring(0, 50)}
                  {citation.url.length > 50 ? "..." : ""}
                </Link>
              )}

              {/* Source Badge */}
              <Box sx={{ mt: 0.75 }}>
                <Chip
                  label={citation.source}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.6rem",
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                  }}
                />
              </Box>
            </Box>
          </Box>
        );
      })}

      {/* Streaming Indicator */}
      {isProcessing && (
        <Box
          sx={{
            borderRadius: "8px",
            backgroundColor: "action.hover",
            border: "2px dashed",
            borderColor: "primary.main",
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 0.6 },
              "50%": { opacity: 1 },
            },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Loading citations...
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        overflow: "auto",
        p: 0.5,
        WebkitOverflowScrolling: "touch",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: (theme) =>
            theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: (theme) =>
            theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
          borderRadius: "3px",
          "&:hover": {
            background: (theme) =>
              theme.palette.mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
          },
        },
      }}
    >
      {renderCitations()}
    </Box>
  );
};

export default Citations;
