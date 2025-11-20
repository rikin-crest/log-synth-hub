import React, { useState, useRef, useMemo } from "react";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Tooltip,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { Close, AutoAwesome, InfoOutlined, CloudUpload, InsertDriveFile } from "@mui/icons-material";
import { toast } from "sonner";

interface ProductOption {
  label: string;
  value: string;
}

interface MappingSchemaOptions {
  label: string;
  value: string;
}

interface InputSectionProps {
  onSubmit: (data: unknown) => void;
  onUpload: (data: FormData) => void;
  isProcessing: boolean;
  mappingSchema: string;
  setMappingSchema: React.Dispatch<React.SetStateAction<string>>;
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

const mappingSchemaOptions: MappingSchemaOptions[] = [
  { label: "UDM", value: "udm" },
  { label: "OCSF", value: "OCSF" },
];

// Product to log category mapping
const productLogCategories: Record<string, string[]> = {
  microsoft_defender: [
    "DeviceLogonEvents",
    "DeviceImageLoadEvents",
    "EmailEvents",
    "EmailPostDeliveryEvents",
  ],
  sentinel_one: ["MaliciousFile"],
  jamf: ["jamfThreats"],
  gcp_firewall: [],
  gcp_dns: [],
  zscalar_dlp: [],
  pan_firewall: [],
  cisco_duo: [],
  gcp_cloud_nat: [],
};

const InputSection = ({
  onSubmit,
  onUpload,
  isProcessing,
  mappingSchema,
  setMappingSchema,
}: InputSectionProps) => {
  const [productName, setProductName] = useState("");
  const [logCategory, setLogCategory] = useState("");
  const [logType, setLogType] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = useState("");
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  // Get log category options based on selected product
  const getLogCategoryOptions = () => {
    if (!productName) return [];
    return productLogCategories[productName as keyof typeof productLogCategories] || [];
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

  const handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadFile(selectedFile);
      setUploadFileName(selectedFile.name);
      toast.success(`File selected: ${selectedFile.name}`);
    }
  };

  const handleRemoveUploadFile = () => {
    setUploadFile(null);
    setUploadFileName("");
    if (uploadFileInputRef.current) {
      uploadFileInputRef.current.value = "";
    }
  };

  const handleUploadSubmit = () => {
    if (!uploadFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);
    onUpload(formData);
    setIsUploadModalOpen(false);
    handleRemoveUploadFile();
  };

  const handleProductNameChange = (value: string | null) => {
    setProductName(value ?? "");
    // Reset log category when product changes
    setLogCategory("");
  };

  const handleMappingSchemaChange = (value: string | null) => {
    setMappingSchema(value ?? "");
  };

  const handleLogTypeChange = (value: string) => {
    setLogType(value);
  };

  const isLogFormatDisabled = useMemo(() => mappingSchema === "ocsf", [mappingSchema]);

  const handleSubmit = async () => {
    if (!productName) {
      toast.error("Please fill all the required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("product_name", productName);
    formData.append("target_schema_name", mappingSchema);
    formData.append("product_log_name", logCategory);
    formData.append("raw_log_type", logType);
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
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Autocomplete
          size="small"
          fullWidth
          options={productOptions}
          value={productOptions.find((option) => option.value === productName) || null}
          onChange={(_, newValue) => handleProductNameChange(newValue?.value)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          getOptionLabel={(option) => option.label}
          disablePortal={false}
          ListboxProps={{
            style: {
              maxHeight: 200,
              overflow: "auto",
              wordBreak: "break-word",
              whiteSpace: "normal",
            },
          }}
          slotProps={{
            paper: {
              style: {
                maxHeight: 200,
                overflow: "auto",
                zIndex: 1400,
                wordBreak: "break-word",
                whiteSpace: "normal",
                minWidth: "250px",
              },
            },
          }}
          componentsProps={{
            popper: {
              style: {
                zIndex: 1400,
              },
              disablePortal: false,
              placement: "bottom-start",
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Product Name"
              placeholder="Select product"
              required
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: -1, ml: 0 }}>
                    <Tooltip
                      title="Select the security product or service that generated the logs"
                      arrow
                      placement="top"
                    >
                      <IconButton size="small" edge="start">
                        <InfoOutlined fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-input": {
                  pl: 1,
                },
              }}
            />
          )}
        />

        <Autocomplete
          size="small"
          fullWidth
          options={mappingSchemaOptions}
          value={mappingSchemaOptions.find((option) => option.value === mappingSchema) || null}
          onChange={(_, newValue) => handleMappingSchemaChange(newValue?.value)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          getOptionLabel={(option) => option.label}
          disablePortal={false}
          ListboxProps={{
            style: {
              maxHeight: 200,
              overflow: "auto",
              wordBreak: "break-word",
              whiteSpace: "normal",
            },
          }}
          slotProps={{
            paper: {
              style: {
                maxHeight: 200,
                overflow: "auto",
                zIndex: 1400,
                wordBreak: "break-word",
                whiteSpace: "normal",
                minWidth: "250px",
              },
            },
          }}
          componentsProps={{
            popper: {
              style: {
                zIndex: 1400,
              },
              disablePortal: false,
              placement: "bottom-start",
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Target Mapping Schema"
              placeholder="Select product"
              required
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: -1, ml: 0 }}>
                    <Tooltip
                      title="Select the security product or service that generated the logs"
                      arrow
                      placement="top"
                    >
                      <IconButton size="small" edge="start">
                        <InfoOutlined fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-input": {
                  pl: 1,
                },
              }}
            />
          )}
        />

        <Autocomplete
          size="small"
          fullWidth
          options={getLogCategoryOptions()}
          value={logCategory}
          onChange={(_, newValue) => {
            setLogCategory(newValue || "");
          }}
          disabled={!productName || !hasCategoriesAvailable()}
          freeSolo
          getOptionLabel={(option) => option}
          disablePortal={false}
          ListboxProps={{
            style: {
              maxHeight: 200,
              overflow: "auto",
              wordBreak: "break-word",
              whiteSpace: "normal",
            },
          }}
          slotProps={{
            paper: {
              style: {
                maxHeight: 200,
                overflow: "auto",
                zIndex: 1400,
                wordBreak: "break-word",
                whiteSpace: "normal",
                minWidth: "250px",
              },
            },
          }}
          componentsProps={{
            popper: {
              style: {
                zIndex: 1400,
              },
              disablePortal: false,
              placement: "bottom-start",
            },
          }}
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
                    : "Type here"
              }
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: -1, ml: 0 }}>
                    <Tooltip
                      title="Specify the log category for the selected product"
                      arrow
                      placement="top"
                    >
                      <IconButton size="small" edge="start">
                        <InfoOutlined fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  cursor: !productName || !hasCategoriesAvailable() ? "not-allowed" : "text",
                  "&.Mui-disabled": {
                    cursor: "not-allowed",
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

        <FormControl fullWidth size="small">
          <InputLabel>Log Format</InputLabel>
          <Select
            value={logType}
            onChange={(e) => handleLogTypeChange(e.target.value)}
            label="Log Format"
            displayEmpty
            disabled={isLogFormatDisabled}
            startAdornment={
              <InputAdornment position="start" sx={{ mr: 0, ml: -1 }}>
                <Tooltip
                  title="Select the format of your log data (JSON, Key-Value pairs, or XML)"
                  arrow
                  placement="top"
                >
                  <IconButton size="small" edge="start">
                    <InfoOutlined fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            }
            renderValue={(selected) => {
              if (!selected) {
                return <span style={{ color: "#9ca3af" }}>Select format</span>;
              }
              const formats: Record<string, string> = {
                json: "JSON",
                kv: "Key-Value (KV)",
                xml: "XML",
              };
              return formats[selected];
            }}
            sx={{
              "& .MuiSelect-root": {
                pl: 0,
              },
              "&.Mui-disabled": {
                cursor: "not-allowed", // 🚫 cursor on the root
              },
              "&.Mui-disabled .MuiSelect-select": {
                cursor: "not-allowed !important", // 🚫 cursor on the inner text area
              },
              "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                cursor: "not-allowed !important",
              },
              "&.Mui-disabled .MuiSelect-icon": {
                cursor: "not-allowed !important", // 🚫 cursor on dropdown arrow
              },
            }}
          >
            <MenuItem value="json">JSON</MenuItem>
            <MenuItem value="kv">Key-Value (KV)</MenuItem>
            <MenuItem value="xml">XML</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* <Box>
        <Button
          variant="outlined"
          component="label"
          fullWidth
          startIcon={
            <Tooltip
              title="Upload a sample log file in JSON, XML, or text format"
              arrow
              placement="top"
            >
              <InfoOutlined fontSize="inherit" />
            </Tooltip>
          }
          sx={{
            p: 0,
            height: { xs: "40px", sm: "100%" },
            minHeight: "40px",
            borderStyle: "dashed",
            borderWidth: 2,
            fontSize: 14,
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
      </Box> */}

      {/* Button at the bottom */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Button
          variant="outlined"
          size="large"
          startIcon={<CloudUpload />}
          onClick={() => setIsUploadModalOpen(true)}
          disabled={isProcessing}
          sx={{
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            borderColor: "divider",
            color: "text.secondary",
            "&:hover": {
              borderColor: "primary.main",
              color: "primary.main",
              bgcolor: "action.hover",
            },
          }}
        >
          Upload existing mapping
        </Button>

        <Button
          variant="contained"
          size="large"
          startIcon={isProcessing ? undefined : <AutoAwesome />}
          onClick={handleSubmit}
          disabled={isProcessing}
          sx={{
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            cursor: isProcessing ? "no-drop" : "pointer",
            position: "relative",
            overflow: "hidden",
            "&:disabled": {
              color: "#9ca3af !important",
            },
            background: "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))",
            "&:hover": {
              background: "linear-gradient(135deg, hsl(260, 85%, 55%), hsl(220, 70%, 50%))",
            },
            "&::before": isProcessing
              ? {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                animation: "shimmer 1.5s infinite",
              }
              : {},
            "@keyframes shimmer": {
              "0%": { left: "-100%" },
              "100%": { left: "100%" },
            },
          }}
        >
          {isProcessing ? "Generating Mappings..." : "Generate Mappings"}
        </Button>
      </Box>

      {/* Upload Modal */}
      <Dialog
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1.5,
            backgroundImage: "none",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Upload Existing Mapping
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Upload a CSV, XLSX, or CONF file to load existing mappings.
            </Typography>

            <Box sx={{ height: "180px" }}>
              {!uploadFileName ? (
                <Button
                  component="label"
                  fullWidth
                  sx={{
                    p: 4,
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    height: "100%",
                    bgcolor: "background.default",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "action.hover",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CloudUpload fontSize="large" />
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Click to upload file
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Supported formats: .csv, .xlsx, .conf
                    </Typography>
                  </Box>
                  <input
                    ref={uploadFileInputRef}
                    type="file"
                    hidden
                    onChange={handleUploadFileChange}
                    accept=".csv,.xlsx,.conf"
                  />
                </Button>
              ) : (
                <Box
                  sx={{
                    p: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    bgcolor: "background.paper",
                    position: "relative",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      bgcolor: "primary.light",
                      color: "primary.main",
                      display: "flex",
                    }}
                  >
                    <InsertDriveFile />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                      {uploadFileName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ready to upload
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={handleRemoveUploadFile}
                    sx={{
                      color: "text.secondary",
                      "&:hover": { color: "error.main", bgcolor: "error.lighter" },
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setIsUploadModalOpen(false)}
            color="inherit"
            sx={{ fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUploadSubmit}
            variant="contained"
            disabled={!uploadFile}
            sx={{
              px: 3,
              fontWeight: 600,
              background: "linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))",
              "&:hover": {
                background: "linear-gradient(135deg, hsl(260, 85%, 55%), hsl(220, 70%, 50%))",
              },
              "&:disabled": {
                background: "action.disabledBackground",
              },
            }}
          >
            Load data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InputSection;
