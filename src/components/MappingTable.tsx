import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Tooltip,
  IconButton,
  Paper,
  useTheme,
  alpha,
  CircularProgress,
  Grid,
  Snackbar,
  Autocomplete,
  TextField,
  Chip,
  Divider,
} from "@mui/material";
import {
  Download,
  InfoOutlined,
  CheckCircle,
  RadioButtonUnchecked,
  ContentCopy,
  TableChart,
} from "@mui/icons-material";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";


import FeedbackSection from "./FeedbackSection";

interface Column {
  key: string;
  name: string;
}

interface MappingTableProps {
  data: Record<string, unknown>[];
  columns: Column[];
  loading?: boolean;
}

// Helper function to get confidence status
const getConfidenceStatus = (score: number) => {
  if (score >= 70) {
    return {
      label: "High",
      color: "#10b981" as const, // Green
      bgColor: "#d1fae5" as const,
    };
  } else if (score >= 50) {
    return {
      label: "Medium",
      color: "#f59e0b" as const, // Yellow/Orange
      bgColor: "#fef3c7" as const,
    };
  } else {
    return {
      label: "Low",
      color: "#ef4444" as const, // Red
      bgColor: "#fee2e2" as const,
    };
  }
};

// Mock predicted fields for the UI demo (Top 3 suggestions)
const MOCK_PREDICTED_FIELDS = [
  "properties.InitiatingProcessToken",
  "properties.InitiatingProcessTokenElevation",
  "properties.InitiatingProcessTokenId",
];

// All available UDM fields for manual selection
const ALL_UDM_FIELDS = [
  "metadata.event_type",
  "metadata.product_name",
  "metadata.vendor_name",
  "metadata.product_version",
  "metadata.event_timestamp",
  "principal.hostname",
  "principal.ip",
  "principal.user.userid",
  "principal.user.username",
  "target.hostname",
  "target.ip",
  "target.port",
  "target.file.full_path",
  "target.file.sha256",
  "target.file.md5",
  "target.process.pid",
  "target.process.command_line",
  "network.http.method",
  "network.http.response_code",
  "network.dns.questions.name",
  "security_result.action",
  "security_result.severity",
  "security_result.rule_name",
  "about.file.full_path",
  "about.file.sha1",
  "about.file.sha256",
  "about.file.md5",
  "about.process.pid",
  "about.process.command_line",
  "about.process.file.full_path",
  "about.registry.registry_key",
  "about.registry.registry_value_name",
  "about.registry.registry_value_data",
  "properties.InitiatingProcessToken",
  "properties.InitiatingProcessTokenElevation",
  "properties.InitiatingProcessTokenId",
  "properties.SHA1",
  "properties.SHA256",
  "properties.FolderPath",
  "properties.FileName",
  "properties.ProcessCommandLine",
  "properties.AccountName",
  "properties.AccountDomain",
  "properties.LogonType",
  "properties.IpAddress",
  "properties.Port",
  "properties.Protocol",
  "properties.RemoteIP",
  "properties.RemotePort",
  "properties.LocalIP",
  "properties.LocalPort",
].sort();

// Custom Circular Gauge Component
const ScoreGauge = ({ score, color }: { score: number; color: string }) => {
  const theme = useTheme();

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      {/* Background Circle */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={120} // Restored size
        thickness={4}
        sx={{ color: alpha(theme.palette.grey[200], 0.5) }}
      />
      {/* Foreground Circle */}
      <CircularProgress
        variant="determinate"
        value={score}
        size={120} // Restored size
        thickness={4}
        sx={{
          color: color,
          position: "absolute",
          left: 0,
          strokeLinecap: "round",
          "& .MuiCircularProgress-circle": {
            transition: "stroke-dashoffset 1s ease-in-out",
          },
        }}
      />
      {/* Center Text */}
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: "text.primary" }}>
          {score}%
        </Typography>
      </Box>
    </Box>
  );
};

// Expandable content component
const ExpandedRowContent = ({ row }: { row: Record<string, unknown> }) => {
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [manualFieldSelection, setManualFieldSelection] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);


  // Extract values
  const productField = String(row["RawLog Field Name"] || "N/A");
  const udmField = String(row["UDM Field Name"] || "N/A");
  const logic = String(row["Logic"] || "N/A");
  const llmReasoning = String(row["LLM Reasoning"] || "N/A");
  const confidenceScore = Number(row["Confidence Score"] || 0);

  // Determine status color for the gauge using the shared helper
  const status = getConfidenceStatus(confidenceScore);
  const statusColor = status.color;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarOpen(true);
  };

  return (
    <>
      <Box sx={{ p: 2, }} onClick={(e) => e.stopPropagation()}> {/* Reduced padding */}
        {/* First Row: Gauge + Product/UDM Stack */}

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
          {/* Widget 1: Confidence Gauge */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 20%" }, minWidth: 0 }}> {/* Reduced from 25% to 20% */}
            <Paper
              elevation={0}
              sx={{
                p: 1.5, // Reduced padding
                height: "100%",
                width: "100%",
                borderRadius: "12px", // Slightly smaller radius
                boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, width: "100%", textAlign: "center", fontSize: "0.85rem" }}>
                Confidence Score
              </Typography>
              <ScoreGauge score={confidenceScore} color={statusColor} />
            </Paper>
          </Box>

          {/* Widget 2 & 3: Mapping Details Stacked */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 auto" }, minWidth: 0 }}>
            <Stack spacing={1.5} sx={{ height: "100%", width: "100%" }}> {/* Reduced spacing */}
              {/* Product Field (Source) */}
              <Paper
                elevation={0}
                sx={{
                  p: 1.5, // Reduced padding
                  width: "100%",
                  minHeight: "60px", // Reduced minHeight
                  flex: 1,
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  position: "relative",
                  boxSizing: "border-box",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.85rem" }}>
                    Product Field (Source)
                  </Typography>
                  <Tooltip title="Copy">
                    <IconButton size="small" onClick={() => handleCopy(productField)} sx={{ p: 0.5 }}>
                      <ContentCopy fontSize="small" sx={{ fontSize: 12 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#8b5cf6", wordBreak: "break-all", lineHeight: 1.5, fontSize: "0.9rem" }}>
                  {productField}
                </Typography>
              </Paper>

              {/* UDM Field (Target) */}
              <Paper
                elevation={0}
                sx={{
                  p: 1.5, // Reduced padding
                  width: "100%",
                  minHeight: "60px", // Reduced minHeight
                  flex: 1,
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  position: "relative",
                  boxSizing: "border-box",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.85rem" }}>
                    UDM Field (Target)
                  </Typography>
                  <Tooltip title="Copy">
                    <IconButton size="small" onClick={() => handleCopy(udmField)} sx={{ p: 0.5 }}>
                      <ContentCopy fontSize="small" sx={{ fontSize: 12 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#8b5cf6", wordBreak: "break-all", lineHeight: 1.5, fontSize: "0.9rem" }}>
                  {udmField}
                </Typography>
              </Paper>
            </Stack>
          </Box>
        </Box>

        {/* Remaining Items in Stack */}
        <Stack spacing={2} sx={{ mt: 2 }}> {/* Reduced spacing */}
          {/* Widget 4a: Logic */}
          {logic !== "N/A" && (
            <Paper
              elevation={0}
              sx={{
                p: 2, // Reduced padding
                width: "100%",
                borderRadius: "12px",
                boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
                overflow: "hidden",
                position: "relative"
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, fontSize: "0.85rem" }}>
                Logic
              </Typography>
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ p: 1.5, borderRadius: 1, border: "1px dashed #cbd5e1" }}>
                  <Typography variant="caption" sx={{ display: "block", fontSize: "0.8rem" }}>
                    {logic}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Widget 4b: AI Reasoning */}
          <Paper
            elevation={0}
            sx={{
              p: 2, // Reduced padding
              width: "100%",
              borderRadius: "12px",
              boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
              // bgcolor: "#fff",
              overflow: "hidden",
              position: "relative"
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, fontSize: "0.85rem" }}>
              AI Reasoning
            </Typography>
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.5, fontSize: "0.8rem", fontWeight: 500, }}>
                {llmReasoning}
              </Typography>
            </Box>
          </Paper>

          {/* Widget 5: Feedback / Filters */}
          <Paper
            elevation={0}
            sx={{
              p: 2, // Reduced padding
              width: "100%",
              borderRadius: "12px",
              boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                Refine Mapping
              </Typography>
              <IconButton size="small">
                <InfoOutlined fontSize="small" sx={{ color: "text.disabled", fontSize: 16 }} />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
              {/* Left: Suggested Alternatives */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", mb: 1.5, display: "block", fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Recommended
                </Typography>
                <Stack spacing={1}>
                  {MOCK_PREDICTED_FIELDS.map((field) => (
                    <Box
                      key={field}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedPrediction === field) {
                          setSelectedPrediction(null);
                        } else {
                          setSelectedPrediction(field);
                          setManualFieldSelection(null); // Clear manual selection if selecting a suggestion
                        }
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        bgcolor: selectedPrediction === field ? alpha("#8b5cf6", 0.08) : "transparent",
                        border: "1px solid",
                        borderColor: selectedPrediction === field ? "#8b5cf6" : "divider",
                        "&:hover": {
                          bgcolor: alpha("#8b5cf6", 0.04),
                          borderColor: selectedPrediction === field ? "#8b5cf6" : "text.disabled",
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500, color: selectedPrediction === field ? "#8b5cf6" : "text.primary", fontSize: "0.8rem" }}>
                        {field}
                      </Typography>
                      {selectedPrediction === field && (
                        <CheckCircle sx={{ fontSize: 18, color: "#8b5cf6" }} />
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Divider */}
              <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

              {/* Right: Manual Override */}
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", mb: 1.5, display: "block", fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Custom Selection
                </Typography>
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                    Search for a specific UDM field if the recommendations don't match.
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={ALL_UDM_FIELDS}
                    value={manualFieldSelection}
                    onChange={(_, newValue) => {
                      setManualFieldSelection(newValue);
                      if (newValue) {
                        setSelectedPrediction(null); // Clear suggestion if manually selecting
                      }
                    }}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search fields..."
                        variant="outlined"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          "& .MuiInputBase-input": { fontSize: "0.8rem" },
                        }}
                      />
                    )}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "background.paper",
                      }
                    }}
                  />

                  <Box sx={{ mt: "auto", display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      disabled={!selectedPrediction && !manualFieldSelection}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle apply logic here
                      }}
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        bgcolor: "#8b5cf6",
                        px: 3,
                        boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.39)",
                        "&:hover": {
                          bgcolor: "#7c3aed",
                          boxShadow: "0 6px 20px rgba(139, 92, 246, 0.23)",
                        },
                        "&:disabled": {
                          bgcolor: "action.disabledBackground",
                          color: "#ced1d7ac" // Light grey for better visibility when disabled
                        }
                      }}
                    >
                      Apply Changes
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Stack>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

const MappingTable = ({ data, columns, loading = false }: MappingTableProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const theme = useTheme();

  // Define columns for Material React Table
  const tableColumns = useMemo<MRT_ColumnDef<Record<string, unknown>>[]>(
    () =>
      columns
        .filter((col) => col.key !== "LLM Reasoning") // Hide LLM Reasoning column
        .map((col) => {
          const isConfidenceScore = col.key === "Confidence Score";

          return {
            accessorKey: col.key,
            header: isConfidenceScore ? "Confidence" : col.name, // Rename "Confidence Score" to "Confidence"
            size: 200,
            enableSorting: isConfidenceScore, // Enable sorting only for Confidence Score
            enableColumnFilter: isConfidenceScore, // Enable filtering only for Confidence Score
            filterVariant: isConfidenceScore ? 'multi-select' : undefined,
            filterSelectOptions: isConfidenceScore
              ? ['High Confidence', 'Partial Confidence', 'Low Confidence']
              : undefined,
            filterFn: isConfidenceScore ? (row, id, filterValue) => {
              if (!filterValue || filterValue.length === 0) return true;
              const score = Number(row.getValue(id) || 0);
              const status = getConfidenceStatus(score);
              return filterValue.includes(status.label);
            } : undefined,
            Cell: ({ cell }) => {
              const value = cell.getValue();

              if (isConfidenceScore) {
                const confidenceScore = Number(value || 0);
                const status = getConfidenceStatus(confidenceScore);

                return (
                  <Chip
                    label={status.label}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: status.color,
                      bgcolor: status.bgColor,
                      border: `1px solid ${status.color}`,
                      "& .MuiChip-label": {
                        px: 1.5,
                      },
                    }}
                  />
                );
              }

              return (
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    maxWidth: 200,
                    display: "block",
                    color: "text.primary",
                    letterSpacing: "-0.01em" // Reduce spacing between characters
                  }}
                  title={String(value || "")}
                >
                  {String(value || "")}
                </Typography>
              );
            },
          };
        }),
    [columns, theme]
  );

  const exportToCsv = () => {
    if (data.length === 0) return;

    const escapeCsvValue = (value: unknown): string => {
      const strValue = String(value ?? "");
      if (strValue.includes(",") || strValue.includes('"') || strValue.includes("\n")) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    };

    const csvContent = [
      columns.map((col) => escapeCsvValue(col.name)).join(","),
      ...data.map((row) => columns.map((col) => escapeCsvValue(row[col.key])).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "mapping-data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const table = useMaterialReactTable({
    columns: tableColumns,
    data,
    enableExpanding: true,
    enableExpandAll: false,
    getRowId: (row, index) => String(index),
    displayColumnDefOptions: {
      'mrt-row-expand': {
        size: 0,
        minSize: 0,
        maxSize: 0,
        muiTableHeadCellProps: {
          sx: {
            display: 'none',
            width: 0,
            minWidth: 0,
            padding: 0,
          },
        },
        muiTableBodyCellProps: {
          sx: {
            display: 'none',
            width: 0,
            minWidth: 0,
            padding: 0,
          },
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontSize: "0.8rem", // Smaller font size for table cells
        py: 1, // Reduced vertical padding
        paddingLeft: 1.5, // Left padding to prevent sticking to boundary
        paddingRight: 0.5, // Minimal right padding for tight column spacing
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        cursor: "pointer",
        transition: "all 0.2s ease",
        bgcolor: "background.paper", // Match header background color
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.04),
        },
      },
      onClick: () => row.toggleExpanded(),
    }),
    renderDetailPanel: ({ row }) => <ExpandedRowContent row={row.original} />,
    state: {
      globalFilter,
      isLoading: loading,
    },
    onGlobalFilterChange: setGlobalFilter,
    enableGlobalFilter: true,
    enableColumnActions: false,
    enableColumnFilters: true, // Enable column filters
    enableSorting: false, // Disable global sorting
    enableGrouping: false, // Disable grouping
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    initialState: {
      density: "compact",
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: 1,
        borderColor: "divider",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent overflow
        position: "relative", // Prevent upward movement
      },
    },
    muiTableContainerProps: {
      sx: {
        flexGrow: 1,
        flexShrink: 1,
        minHeight: 0, // Allow container to shrink
        maxHeight: "600px", // Set a max height
        overflow: "auto",
        position: "relative", // Ensure proper positioning
      },
    },
    muiTopToolbarProps: {
      sx: {
        px: { xs: 2, md: 3 },
        pt: { xs: 2, md: 3 },
        pb: { xs: 1.5, md: 2 },
        flexShrink: 0, // Prevent toolbar from shrinking
        position: "sticky",
        top: 0,
        zIndex: 2,
        bgcolor: "background.paper",
      },
    },
    enablePagination: true, // Enable pagination
    enableStickyHeader: true, // Enable sticky header
    muiBottomToolbarProps: {
      sx: {
        display: data.length === 0 ? "none" : "flex", // Hide bottom toolbar when no data
        borderTop: 1,
        borderColor: "divider",
        flexShrink: 0, // Prevent bottom toolbar from shrinking
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 600,
        bgcolor: "background.paper",
        position: "sticky",
        top: 0,
        zIndex: 1,
        paddingLeft: 1.5, // Left padding to align with body cells
        paddingRight: 0.5, // Minimal right padding for tight column spacing
      },
    },
    renderEmptyRowsFallback: () => (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          py: 8,
        }}
      >
        <TableChart sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
        <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
          No Mappings Yet
        </Typography>
        <Typography variant="body2" sx={{ color: "text.disabled" }}>
          Generate or upload mappings to get started
        </Typography>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TableChart sx={{ color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Mapping Sheet
          </Typography>
        </Box>
        <Tooltip title="View the generated field mappings here" arrow placement="top">
          <IconButton size="small">
            <InfoOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderToolbarInternalActions: () => (
      <Box sx={{ display: "flex", gap: 1 }}>
        {data.length > 0 && (
          <Button
            variant="contained"
            size="small"
            startIcon={<Download sx={{ fontSize: 16 }} />}
            onClick={exportToCsv}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              py: 0.75,
              borderRadius: 2,
              fontSize: 14,
              background: "linear-gradient(135deg, hsl(220, 70%, 55%), hsl(260, 85%, 60%))",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              "& .MuiButton-startIcon": {
                marginRight: 1,
                marginLeft: 0,
              },
              "&:hover": {
                background: "linear-gradient(135deg, hsl(220, 70%, 50%), hsl(260, 85%, 55%))",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Export CSV
          </Button>
        )}
      </Box>

    ),
  });

  return <MaterialReactTable table={table} />;
};

export default MappingTable;
