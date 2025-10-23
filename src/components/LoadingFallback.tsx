import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingFallbackProps {
  message?: string;
  size?: number;
  height?: string | number;
}

const LoadingFallback = ({
  message = "Loading...",
  size = 32,
  height = "200px",
}: LoadingFallbackProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height,
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress size={size} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingFallback;
