import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  Lock,
  AutoAwesome,
} from "@mui/icons-material";
import { toast } from "sonner";
import { loginUser, LoginCredentials } from "../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);

    try {
      const credentials: LoginCredentials = {
        username,
        password,
      };

      const result = await loginUser(credentials);

      if (result) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, hsl(280, 75%, 65%, 0.3), transparent)",
          top: "-10%",
          left: "-10%",
          animation: "pulse-glow 4s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, hsl(220, 70%, 55%, 0.3), transparent)",
          bottom: "-10%",
          right: "-10%",
          animation: "pulse-glow 4s ease-in-out infinite 2s",
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
            animation: "slide-in-up 0.6s ease-out",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <AutoAwesome sx={{ fontSize: 48, color: "white", mr: 1 }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "white",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              Google SecOps Parser Generator
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: 400,
            }}
          >
            Log Mapping Intelligence Platform
          </Typography>
        </Box>

        <Card
          sx={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            animation: "slide-in-up 0.6s ease-out 0.2s backwards",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              Welcome Back
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
