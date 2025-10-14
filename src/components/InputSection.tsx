import { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { CloudUpload, AutoAwesome, Description } from "@mui/icons-material";
import { toast } from "sonner";

interface InputSectionProps {
  onSubmit: (data: any) => void;
  isProcessing: boolean;
}

const InputSection = ({ onSubmit, isProcessing }: InputSectionProps) => {
  const [productName, setProductName] = useState("");
  const [logCategory, setLogCategory] = useState("");
  const [logType, setLogType] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleSubmit = () => {
    onSubmit({ productName, logCategory, logType, fileName });
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,1))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          gap: 2,
          p: 2,
          height: "100%",
          overflow: "auto"
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <AutoAwesome sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Input Configuration
          </Typography>
        </Box>

        {/* Inputs in grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >
          <FormControl fullWidth size="small">
            <InputLabel>Product Name *</InputLabel>
            <Select
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              label="Product Name *"
              // sx={{ height: "100%" }}
            >
              <MenuItem value="Product A">Product A</MenuItem>
              <MenuItem value="Product B">Product B</MenuItem>
              <MenuItem value="Product C">Product C</MenuItem>
              <MenuItem value="Product D">Product D</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Log Type *</InputLabel>
            <Select
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              label="Log Type *"
              // sx={{
              //   height: "100%",
              // }}
            >
              <MenuItem value="json">JSON</MenuItem>
              <MenuItem value="kv">Key-Value (KV)</MenuItem>
              <MenuItem value="xml">XML</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            fullWidth
            label="Product Log Category"
            value={logCategory}
            onChange={(e) => setLogCategory(e.target.value)}
            placeholder="Optional category"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description color="primary" />
                </InputAdornment>
              ),
            }}
            // sx={{
            //   ".MuiOutlinedInput-root": {
            //     height: "100%",
            //   },
            // }}
          />

          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<CloudUpload />}
            sx={{
              p: 0,
              px: 1,
              height: "100%",
              borderStyle: "dashed",
              borderWidth: 2,
              wordBreak: "break-word",
              "&:hover": { borderStyle: "dashed", borderWidth: 2 },
            }}
          >
            {fileName || "Upload Log File *"}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".json,.xml,.log,.txt"
            />
          </Button>
        </Box>

        {/* Button at the bottom */}
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={isProcessing}
          sx={{
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            cursor: isProcessing ? "no-drop" : "pointer",
            background:
              "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))",
            "&:hover": {
              background:
                "linear-gradient(135deg, hsl(260, 85%, 55%), hsl(220, 70%, 50%))",
            },
          }}
        >
          {isProcessing ? "Generating..." : "Generate Mappings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default InputSection;
