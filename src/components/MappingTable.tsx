import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  LinearProgress,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TableChart } from "@mui/icons-material";

interface MappingTableProps {
  data: Record<string, any>[];
  columns: string[];
  loading?: boolean;
}

const MappingTable = ({
  data,
  columns,
  loading = false,
}: MappingTableProps) => {
  const gridColumns: GridColDef[] = columns.map((col) => ({
    field: col,
    headerName: col,
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
        title={String(params.value ?? "")}
      >
        {params.value ?? "-"}
      </Box>
    ),
  }));

  const gridRows = data.map((row, index) => ({ id: index, ...row }));

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
          }}
        >
          <TableChart sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Mapping Sheet
          </Typography>
          {data.length > 0 && (
            <Chip
              label={`${data.length} mappings`}
              size="small"
              color="primary"
              sx={{ ml: "auto" }}
            />
          )}
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
              loadingOverlay: LinearProgress, // ✅ use LinearProgress bar as loader
            }}
            sx={{
              border: "none",
              backgroundColor: "transparent",
              "& .MuiDataGrid-columnHeaders": {
                fontWeight: 600,
                backgroundColor: "background.default",
              },
              "& .MuiDataGrid-overlay": {
                backgroundColor: "rgba(255,255,255,0.8)",
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
