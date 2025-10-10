import {
  Card,
  CardContent,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
} from "@mui/material";
import { TableChart, Circle } from "@mui/icons-material";

interface MappingTableProps {
  data: any[];
}

const MappingTable = ({ data }: MappingTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "mapped":
        return "success";
      case "pending":
        return "warning";
      case "conflict":
        return "error";
      default:
        return "default";
    }
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
        }}
      >
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

        <TableContainer
          sx={{ flexGrow: 1, px: 3, pb: 3, overflow: "auto", minHeight: 0 }}
        >
          {data.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "text.secondary",
              }}
            >
              <TableChart sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography variant="body1">
                Mapping data will appear here after generation
              </Typography>
            </Box>
          ) : (
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {[
                    "Source Field",
                    "Target Field",
                    "Data Type",
                    "Transformation",
                    "Status",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: 600,
                        bgcolor: "background.default", // solid background (prevents transparency)
                        position: "sticky",
                        top: 0,
                        zIndex: 2, // ensures it stays above the body rows
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "hsl(var(--muted) / 0.2)",
                      },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <TableCell>
                      <Tooltip title={row.sourceField} arrow>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.sourceField}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={row.targetField} arrow>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.targetField}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.dataType}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {row.transformation}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<Circle sx={{ fontSize: 8 }} />}
                        label={row.status}
                        size="small"
                        color={getStatusColor(row.status) as any}
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default MappingTable;
