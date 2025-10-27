import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TableChart, Download, Search, InfoOutlined } from "@mui/icons-material";

interface Column {
  key: string;
  name: string;
}

interface MappingTableProps {
  data: Record<string, any>[];
  columns: Column[];
  loading?: boolean;
}
const MappingTable = ({ data, columns, loading = false }: MappingTableProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const gridColumns: GridColDef[] = columns.map((col) => ({
    field: col.key,
    headerName: col.name,
    flex: 1,
    minWidth: 120,
    resizable: false,
    sortable: true,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          width: "100%",
          minWidth: 0,
        }}
        title={String(params.value || "")}
      >
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minWidth: 0,
          }}
        >
          {params.value || ""}
        </span>
      </Box>
    ),
  }));

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, columns, searchTerm]);

  const gridRows = filteredData.map((row, index) => ({ id: index, ...row }));

  const CustomLoadingOverlay = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 2,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body1" color="text.secondary">
        It may take a few minutes to generate mappings.
      </Typography>
    </Box>
  );

  const exportToCsv = () => {
    if (filteredData.length === 0) return;

    // Helper function to escape CSV values
    const escapeCsvValue = (value: any): string => {
      const strValue = String(value ?? "");
      if (strValue.includes(",") || strValue.includes('"') || strValue.includes("\n")) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    };

    const csvContent = [
      columns.map((col) => escapeCsvValue(col.name)).join(","), // Header row with escaped names
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

    // Cleanup: revoke the object URL to prevent memory leaks
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <TableChart sx={{ mr: 1, color: "primary.main", display: "flex" }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}
            >
              Mapping Sheet
            </Typography>
            <Tooltip title="View the generated field mappings here" arrow placement="top">
              <IconButton size="small" sx={{ p: 0.5, display: "flex", alignItems: "center" }}>
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
              <>
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
              </>
            )}
          </Stack>
        </Box>

        {/* DataGrid */}
        <Box
          sx={{
            flexGrow: 1,
            px: { xs: 2, md: 3 },
            pb: { xs: 2, md: 3 },
            width: "100%",
            overflow: "hidden",
          }}
        >
          <DataGrid
            rows={gridRows}
            columns={gridColumns}
            disableRowSelectionOnClick
            density="compact"
            sortingOrder={["asc", "desc"]}
            loading={loading}
            localeText={{
              noRowsLabel: "No Mappings",
              noColumnsOverlayLabel: "No Mappings",
            }}
            slots={{
              loadingOverlay: CustomLoadingOverlay,
            }}
            sx={{
              border: 1,
              borderColor: "divider",
              height: { xs: "300px", md: "100%" },
              "& .MuiDataGrid-columnHeaders": {
                fontWeight: 600,
                fontSize: { xs: "0.75rem", md: "0.875rem" },
              },
              "& .MuiDataGrid-cell": {
                fontSize: { xs: "0.75rem", md: "0.875rem" },
                padding: { xs: "4px 8px", md: "8px 16px" },
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-columnHeader": {
                borderRight: 1,
                borderColor: "divider",
                "&:last-child": {
                  borderRight: "none",
                },
              },
              "& .MuiDataGrid-columnSeparator--sideRight": {
                display: "none !important",
              },
              "& .MuiDataGrid-columnHeader--last": {
                borderRight: "none",
              },
              "& .MuiDataGrid-overlay": {
                backgroundColor: "background.paper",
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                "&:last-child": {
                  borderBottom: 1,
                  borderColor: "divider",
                },
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "block",
                color: "divider",
              },
              "& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "& MuiDataGrid-columnSeparator--sideRight": {
                display: "none",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600,
              },
              "& .MuiDataGrid-filler": {
                display: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflow: "auto",
              },
              "& .MuiDataGrid-main": {
                overflow: "hidden",
              },
              "& .MuiDataGrid-toolbarContainer": {
                padding: "8px 16px",
                borderBottom: 1,
                borderColor: "divider",
                backgroundColor: "action.hover",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: 1,
                borderColor: "divider",
              },
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 20, page: 0 } },
            }}
            pageSizeOptions={[10, 20, 50, 100]}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default MappingTable;
