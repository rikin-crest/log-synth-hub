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
import CrestLogo from "../assets/Crest_Logo.svg";

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
          "linear-gradient(135deg, hsl(220, 30%, 85%), hsl(240, 25%, 90%))",
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 1,
            animation: "slide-in-up 0.6s ease-out",
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <img
              src={CrestLogo}
              alt="Crest Data Logo"
              style={{
                maxWidth: "100%",
                height: "auto",
                maxHeight: "120px",
                filter: "drop-shadow(0 4px 16px rgba(135, 56, 237, 0.3))",
                position: "relative",
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: "none",
                maskImage: `url(${CrestLogo})`,
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskImage: `url(${CrestLogo})`,
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  width: "200%",
                  height: "200%",
                  background:
                    "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.8) 50%, transparent 70%)",
                  transform:
                    "translateX(-100%) translateY(-100%) rotate(45deg)",
                  animation: "sparkle 5s ease-in-out infinite",
                  zIndex: 1,
                },
                "@keyframes sparkle": {
                  "0%": {
                    transform:
                      "translateX(-100%) translateY(-100%) rotate(45deg)",
                  },
                  "50%": {
                    transform:
                      "translateX(100%) translateY(100%) rotate(45deg)",
                  },
                  "100%": {
                    transform:
                      "translateX(-100%) translateY(-100%) rotate(45deg)",
                  },
                },
              }}
            />
          </Box>
        </Box>

        <Card
          sx={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            animation: "slide-in-up 0.6s ease-out 0.2s backwards",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                textAlign: "center",
                mb: 4,
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
                <AutoAwesome
                  sx={{ fontSize: 40, color: "primary.main", mr: 1 }}
                />
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                  }}
                >
                  Google SecOps Parser Generator
                </Typography>
              </Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "text.secondary",
                  fontWeight: 400,
                  mb: 3,
                }}
              >
                Log Mapping Intelligence Platform
              </Typography>
            </Box>

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

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mt: 3,
                pr: 0.5,
                opacity: 0.8,
                transition: "opacity 0.2s ease-in-out",
                "&:hover": {
                  opacity: 1,
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  background: "linear-gradient(to right, #13044a 2%, #3b168f 25%, #8738ed 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  letterSpacing: "0.5px",
                  fontStyle: "italic",
                }}
              >
                By Crest Data
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
