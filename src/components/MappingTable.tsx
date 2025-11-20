import { useState, useMemo, Fragment } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Paper,
  useTheme,
  alpha,
  CircularProgress,
  Grid,
  Snackbar,
  Autocomplete,
} from "@mui/material";
import {
  TableChart,
  Download,
  Search,
  InfoOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  CheckCircle,
  RadioButtonUnchecked,
  ContentCopy,
} from "@mui/icons-material";

interface Column {
  key: string;
  name: string;
}

interface MappingTableProps {
  data: Record<string, unknown>[];
  columns: Column[];
  loading?: boolean;
}

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
        size={120}
        thickness={4}
        sx={{ color: alpha(theme.palette.grey[200], 0.5) }}
      />
      {/* Foreground Circle */}
      <CircularProgress
        variant="determinate"
        value={score}
        size={120}
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
        <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: "text.primary" }}>
          {score}%
        </Typography>
        <Typography variant="caption" component="div" sx={{ color: "text.secondary", mt: -0.5 }}>
          Confidence
        </Typography>
      </Box>
    </Box>
  );
};

const Row = ({
  row,
  columns,
}: {
  row: Record<string, unknown>;
  columns: Column[];
}) => {
  const [open, setOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [manualFieldSelection, setManualFieldSelection] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();

  // Extract values
  const productField = String(row["RawLog Field Name"] || "N/A");
  const udmField = String(row["UDM Field Name"] || "N/A");
  const logic = String(row["Logic"] || "N/A");
  const llmReasoning = String(row["LLM Reasoning"] || "N/A");
  const confidenceScore = Number(row["Confidence Score"] || 0);

  // Determine status color for the main row pill and gauge
  let statusColor = theme.palette.error.main;
  if (confidenceScore > 90) statusColor = theme.palette.success.main;
  else if (confidenceScore > 80) statusColor = theme.palette.warning.main;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarOpen(true);
  };

  return (
    <Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
          "& .expand-icon": {
            opacity: open ? 1 : 0,
            transition: "opacity 0.2s ease",
          },
          "&:hover .expand-icon": {
            opacity: 1,
          },
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell padding="checkbox" sx={{ width: 40 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            className="expand-icon"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        {columns.map((col) => {
          const isConfidenceScore = col.key === "Confidence Score";
          const value = row[col.key];

          if (isConfidenceScore) {
            return (
              <TableCell key={col.key}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: statusColor }}>
                    {confidenceScore}%
                  </Typography>
                </Box>
              </TableCell>
            );
          }

          return (
            <TableCell key={col.key}>
              <Typography
                variant="body2"
                noWrap
                sx={{ maxWidth: 200, display: "block", color: "text.primary" }}
                title={String(value || "")}
              >
                {String(value || "")}
              </Typography>
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottom: "none" }} colSpan={columns.length + 1}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 4, px: 4, bgcolor: "#f3f4f6" }}>
              {/* First Row: Gauge + Product/UDM Stack */}
              <Grid container spacing={3} sx={{ flexWrap: "wrap" }}>
                {/* Widget 1: Confidence Gauge */}
                <Grid item xs={12} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      height: "100%",
                      width: "100%",
                      borderRadius: "16px",
                      boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxSizing: "border-box",
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, width: "100%", textAlign: "center" }}>
                      Score
                    </Typography>
                    <ScoreGauge score={confidenceScore} color={statusColor} />
                  </Paper>
                </Grid>

                {/* Widget 2 & 3: Mapping Details Stacked */}
                <Grid item xs={12} md={9} sx={{ display: "flex", flexGrow: 1, minWidth: 0 }}>
                  <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
                    {/* Product Field (Source) */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        width: "100%",
                        minHeight: "80px",
                        flex: 1,
                        borderRadius: "16px",
                        boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        position: "relative",
                        boxSizing: "border-box",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                          Product Field (Source)
                        </Typography>
                        <Tooltip title="Copy">
                          <IconButton size="small" onClick={() => handleCopy(productField)} sx={{ p: 0.5 }}>
                            <ContentCopy fontSize="small" sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1e293b", wordBreak: "break-all", lineHeight: 1.3 }}>
                        {productField}
                      </Typography>
                    </Paper>

                    {/* UDM Field (Target) */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        width: "100%",
                        minHeight: "80px",
                        flex: 1,
                        borderRadius: "16px",
                        boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        position: "relative",
                        boxSizing: "border-box",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                          UDM Field (Target)
                        </Typography>
                        <Tooltip title="Copy">
                          <IconButton size="small" onClick={() => handleCopy(udmField)} sx={{ p: 0.5 }}>
                            <ContentCopy fontSize="small" sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#8b5cf6", wordBreak: "break-all", lineHeight: 1.3 }}>
                        {udmField}
                      </Typography>
                    </Paper>
                  </Stack>
                </Grid>
              </Grid>

              {/* Remaining Items in Stack */}
              <Stack spacing={3} sx={{ mt: 3 }}>
                {/* Widget 4a: Logic */}
                {logic !== "N/A" && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      width: "100%",
                      borderRadius: "16px",
                      boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
                      bgcolor: "#fff",
                      overflow: "hidden",
                      position: "relative"
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Logic
                    </Typography>
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2, border: "1px dashed #cbd5e1" }}>
                        <Typography variant="caption" sx={{ fontFamily: "monospace", color: "#475569", display: "block" }}>
                          {logic}
                        </Typography>
                      </Box>
                    </Box>
                    {/* Decorative gradient blob */}
                    <Box sx={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", bgcolor: alpha("#06b6d4", 0.1), zIndex: 0 }} />
                  </Paper>
                )}

                {/* Widget 4b: AI Reasoning */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    width: "100%",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
                    bgcolor: "#fff",
                    overflow: "hidden",
                    position: "relative"
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    AI Reasoning
                  </Typography>
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                      {llmReasoning}
                    </Typography>
                  </Box>
                  {/* Decorative gradient blob */}
                  <Box sx={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", bgcolor: alpha("#06b6d4", 0.1), zIndex: 0 }} />
                </Paper>

                {/* Widget 5: Feedback / Filters */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    width: "100%",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Refine Mapping
                    </Typography>
                    <IconButton size="small">
                      <InfoOutlined fontSize="small" sx={{ color: "text.disabled" }} />
                    </IconButton>
                  </Box>

                  <Grid container spacing={3}>
                    {/* Left: 60% - Suggested Alternatives */}
                    <Grid item xs={12} md={7}>
                      <Typography variant="caption" sx={{ color: "text.secondary", mb: 1.5, display: "block", fontWeight: 600 }}>
                        Suggested Alternatives
                      </Typography>
                      <Stack spacing={1}>
                        {MOCK_PREDICTED_FIELDS.map((field) => (
                          <Box
                            key={field}
                            onClick={() => {
                              setSelectedPrediction(field);
                              setManualFieldSelection(null); // Clear manual selection if selecting a suggestion
                            }}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1.5,
                              borderRadius: "12px",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              bgcolor: selectedPrediction === field ? alpha("#8b5cf6", 0.05) : "transparent",
                              border: selectedPrediction === field ? "2px solid #8b5cf6" : "2px solid transparent",
                              "&:hover": { bgcolor: alpha("#8b5cf6", 0.05) },
                            }}
                          >
                            {selectedPrediction === field ? (
                              <CheckCircle sx={{ fontSize: 20, color: "#8b5cf6", mr: 1.5 }} />
                            ) : (
                              <RadioButtonUnchecked sx={{ fontSize: 20, color: "text.disabled", mr: 1.5 }} />
                            )}
                            <Typography variant="body2" sx={{ fontWeight: 500, color: selectedPrediction === field ? "#8b5cf6" : "text.primary" }}>
                              {field}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Grid>

                    {/* Right: 40% - Manual Override (Centered) */}
                    <Grid item xs={12} md={5} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Box sx={{ bgcolor: "#f8fafc", p: 3, borderRadius: "16px", width: "100%", maxWidth: "400px" }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", mb: 1.5, display: "block", fontWeight: 600 }}>
                          Manual Override
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, display: "block", fontSize: "11px" }}>
                          Search and select from all available UDM fields
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
                              placeholder="Search all fields..."
                              variant="outlined"
                            />
                          )}
                          sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "#fff",
                              borderRadius: "12px",
                              "& fieldset": { borderColor: "#e2e8f0" },
                              "&:hover fieldset": { borderColor: "#cbd5e1" },
                              "&.Mui-focused fieldset": { borderColor: "#8b5cf6" },
                            }
                          }}
                        />
                        <Button
                          fullWidth
                          variant="contained"
                          disabled={!selectedPrediction && !manualFieldSelection}
                          sx={{
                            borderRadius: "12px",
                            py: 1,
                            textTransform: "none",
                            fontWeight: 600,
                            bgcolor: "#8b5cf6",
                            boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.39)",
                            "&:hover": {
                              bgcolor: "#7c3aed",
                              boxShadow: "0 6px 20px rgba(139, 92, 246, 0.23)",
                            },
                            "&:disabled": {
                              bgcolor: "#e2e8f0",
                              color: "#94a3b8"
                            }
                          }}
                        >
                          Apply Changes
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Fragment>
  );
};

const MappingTable = ({ data, columns, loading = false }: MappingTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, columns, searchTerm]);

  const exportToCsv = () => {
    if (filteredData.length === 0) return;

    const escapeCsvValue = (value: unknown): string => {
      const strValue = String(value ?? "");
      if (strValue.includes(",") || strValue.includes('"') || strValue.includes("\n")) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    };

    const csvContent = [
      columns.map((col) => escapeCsvValue(col.name)).join(","),
      ...filteredData.map((row) => columns.map((col) => escapeCsvValue(row[col.key])).join(",")),
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

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 0,
          overflow: "hidden",
          "&:last-child": { p: 0 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            pt: { xs: 2, md: 3 },
            pb: { xs: 1.5, md: 2 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            flexShrink: 0,
            gap: { xs: 1.5, md: 2 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TableChart sx={{ mr: 1, color: "primary.main", display: "flex" }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, display: "flex", alignItems: "center", pb: 0.2 }}
            >
              Mapping Sheet
            </Typography>
            <Tooltip title="View the generated field mappings here" arrow placement="top">
              <IconButton size="small" sx={{ pt: 0.7, display: "flex", alignItems: "center" }}>
                <InfoOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Search Bar */}
          {data.length > 0 && (
            <Box
              sx={{
                flexGrow: 1,
                maxWidth: { xs: "100%", md: 400 },
                order: { xs: 2, md: 0 },
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Search across all fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: 18, color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 36,
                    borderRadius: 2,
                    backgroundColor: "background.default",
                    fontSize: 14,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "6px 8px",
                  },
                }}
              />
            </Box>
          )}

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              ml: { xs: 0, md: "auto" },
              order: { xs: 3, md: 0 },
              justifyContent: { xs: "flex-end", md: "flex-start" },
            }}
          >
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
          </Stack>
        </Box>

        {/* Table Container */}
        <TableContainer sx={{ flexGrow: 1, overflow: "auto", px: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>
          <Table stickyHeader aria-label="collapsible table" size="small">
            <TableHead>
              <TableRow>
                <TableCell width={40} />
                {columns.map((col) => (
                  <TableCell key={col.key} sx={{ fontWeight: 600, bgcolor: "background.paper" }}>
                    {col.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <Row key={index} row={row} columns={columns} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No Mappings Found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default MappingTable;
