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
  Autocomplete,
} from "@mui/material";
import {
  CloudUpload,
  Description,
  Close,
  AutoAwesome,
} from "@mui/icons-material";
import { toast } from "sonner";

interface ProductOption {
  label: string;
  value: string;
}

interface InputSectionProps {
  onSubmit: (data: any) => void;
  isProcessing: boolean;
}

const productOptions: ProductOption[] = [
  { label: "Microsoft Defender", value: "microsoft_defender" },
  { label: "SentinelOne", value: "sentinel_one" },
  { label: "Jamf", value: "jamf" },
  { label: "GCP Firewall", value: "gcp_firewall" },
  { label: "GCP DNS", value: "gcp_dns" },
  { label: "Zscaler DLP", value: "zscalar_dlp" },
  { label: "PAN Firewall", value: "pan_firewall" },
  { label: "Cisco Duo", value: "cisco_duo" },
  { label: "GCP Cloud NAT", value: "gcp_cloud_nat" },
];

// Product to log category mapping
const productLogCategories: Record<string, string[]> = {
  microsoft_defender: [
    "DeviceLogonEvents",
    "DeviceImageLoadEvents",
    "EmailEvents",
    "EmailPostDeliveryEvents",
  ],
  sentinel_one: [],
  jamf: ["jamfThreats"],
  gcp_firewall: [],
  gcp_dns: [],
  zscalar_dlp: [],
  pan_firewall: [],
  cisco_duo: [],
  gcp_cloud_nat: [],
};

const InputSection = ({ onSubmit, isProcessing }: InputSectionProps) => {
  const [productName, setProductName] = useState("");
  const [logCategory, setLogCategory] = useState("");
  const [logType, setLogType] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get log category options based on selected product
  const getLogCategoryOptions = () => {
    if (!productName) return [];
    return (
      productLogCategories[productName as keyof typeof productLogCategories] ||
      []
    );
  };

  // Check if categories are available for the selected product
  const hasCategoriesAvailable = () => {
    const options = getLogCategoryOptions();
    return options.filter((option) => option !== "").length > 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    console.log(selectedFile);
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

  const handleProductNameChange = (value: string | null) => {
    setProductName(value ?? "");
    // Reset log category when product changes
    setLogCategory("");
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
        <Autocomplete
          size="small"
          fullWidth
          options={productOptions}
          value={
            productOptions.find((option) => option.value === productName) ||
            null
          }
          onChange={(_, newValue) => handleProductNameChange(newValue?.value)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="Product Name" required />
          )}
        />

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

        <Autocomplete
          size="small"
          fullWidth
          options={getLogCategoryOptions()}
          value={logCategory}
          onChange={(_, newValue) => {
            setLogCategory(newValue || "");
          }}
          freeSolo
          disabled={!productName || !hasCategoriesAvailable()}
          noOptionsText={
            !productName
              ? "Select product first"
              : !hasCategoriesAvailable()
              ? "No categories available"
              : "No matching categories"
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Product Log Category"
              placeholder={
                !productName
                  ? "Select product first"
                  : !hasCategoriesAvailable()
                  ? "No categories available"
                  : "Type category"
              }
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <Description color="primary" />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  cursor:
                    !productName || !hasCategoriesAvailable()
                      ? "not-allowed"
                      : "text",
                  "&.Mui-disabled": {
                    cursor: "not-allowed",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.23) !important",
                    },
                  },
                  "&.Mui-disabled:hover": {
                    cursor: "not-allowed",
                  },
                },
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  cursor: "not-allowed",
                },
              }}
            />
          )}
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
        startIcon={<AutoAwesome />}
        onClick={handleSubmit}
        disabled={isProcessing}
        sx={{
          py: 1.5,
          fontSize: "1rem",
          fontWeight: 600,
          cursor: isProcessing ? "no-drop" : "pointer",
          "&:disabled": {
            color: "#9ca3af !important",
          },
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
