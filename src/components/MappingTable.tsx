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
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TableChart, Download, Search } from "@mui/icons-material";

interface Column {
  key: string;
  name: string;
}

interface MappingTableProps {
  data: Record<string, any>[];
  columns: Column[];
  loading?: boolean;
}

const MappingTable = ({
  data,
  columns,
  loading = false,
}: MappingTableProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const gridColumns: GridColDef[] = columns.map((col) => ({
    field: col.key,
    headerName: col.name,
    flex: 1,
    minWidth: 150,
    sortable: true,
    renderCell: (params) => (
      <Box
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        }}
        title={String(params.value || "")}
      >
        {params.value || ""}
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
        It will take few minutes to generate mappings.
      </Typography>
    </Box>
  );

  const exportToCsv = () => {
    if (filteredData.length === 0) return;

    const csvContent = [
      columns.map((col) => col.name).join(","), // Header row with display names
      ...filteredData.map((row) =>
        columns
          .map((col) => {
            const value = row[col.key] ?? "";
            // Escape commas and quotes in CSV
            return typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(",")
      ),
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
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 1))",
        border: "1px solid hsl(var(--border))",
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
            px: 3,
            pt: 3,
            pb: 2,
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TableChart sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Mapping Sheet
            </Typography>
          </Box>

          {/* Search Bar */}
          {data.length > 0 && (
            <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
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
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
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
            sx={{ ml: "auto" }}
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
                    background:
                      "linear-gradient(135deg, hsl(220, 70%, 55%), hsl(260, 85%, 60%))",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    "& .MuiButton-startIcon": {
                      marginRight: 1,
                      marginLeft: 0,
                    },
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, hsl(220, 70%, 50%), hsl(260, 85%, 55%))",
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
        <Box sx={{ flexGrow: 1, px: 3, pb: 3 }}>
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
              border: "1px solid rgba(224, 224, 224, 1)",
              height: 340,
              backgroundColor: "white",
              "& .MuiDataGrid-columnHeaders": {
                fontWeight: 600,
                backgroundColor: "background.default",
              },
              "& .MuiDataGrid-cell": {
                borderRight: "1px solid rgba(224, 224, 224, 0.5)",
                "&:last-child": {
                  borderRight: "none",
                },
              },
              "& .MuiDataGrid-columnHeader": {
                borderRight: "1px solid rgba(224, 224, 224, 0.8)",
                "&:last-child": {
                  borderRight: "none",
                },
              },
              "& .MuiDataGrid-overlay": {
                backgroundColor: "rgba(255,255,255,0.8)",
              },
              "& .MuiDataGrid-row": {
                "&:last-child": {
                  borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                },
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "block",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600,
              },
              "& .MuiDataGrid-filler": {
                display: "none",
              },
              "& .MuiDataGrid-scrollbarFiller": {
                display: "none",
              },
              "& .MuiDataGrid-toolbarContainer": {
                padding: "8px 16px",
                borderBottom: "1px solid rgba(224, 224, 224, 0.8)",
                backgroundColor: "rgba(250, 250, 250, 0.8)",
              },
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default MappingTable;
