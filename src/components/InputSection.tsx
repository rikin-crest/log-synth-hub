import { useState, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { CloudUpload, Description, Close } from "@mui/icons-material";
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
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    console.log(selectedFile)
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      toast.success(`File selected: ${selectedFile.name}`);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName("");
    // Clear the input value so onChange will fire again for the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("File removed successfully");
  };

  const handleProductNameChange = (value: string) => {
    setProductName(value);
  };

  const handleLogTypeChange = (value: string) => {
    setLogType(value);
  };

  const handleSubmit = async () => {
    if (!productName || !logType) {
      toast.error("Please fill all the required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("product_name", productName);
    formData.append("product_log_name", logCategory);
    formData.append("udm_event_type", logType);
    formData.append("raw_logs_path", file);

    onSubmit(formData);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
      }}
    >
      {/* Inputs in grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
        }}
      >
        <FormControl fullWidth size="small" required>
          <InputLabel>Product Name</InputLabel>
          <Select
            value={productName}
            onChange={(e) => handleProductNameChange(e.target.value)}
            label="Product Name"
          >
            <MenuItem value="microsoft_defender">MS Defender</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" required>
          <InputLabel>Log Format</InputLabel>
          <Select
            value={logType}
            onChange={(e) => handleLogTypeChange(e.target.value)}
            label="Log Format"
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
        />

        <Box sx={{ position: "relative", height: "100%" }}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<CloudUpload />}
            sx={{
              p: 0,
              height: "100%",
              borderStyle: "dashed",
              borderWidth: 2,
              wordBreak: "break-word",
              "&:hover": { borderStyle: "dashed", borderWidth: 2 },
            }}
          >
            {fileName || "Upload Log File"}
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".json,.xml,.log,.txt"
            />
          </Button>
          {fileName && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleRemoveFile}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                minWidth: "auto",
                width: 28,
                height: 28,
                p: 0,
                border: "none",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              <Close sx={{ fontSize: 18 }} />
            </Button>
          )}
        </Box>
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
    </Box>
  );
};

export default InputSection;
