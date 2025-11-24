import React, { useState, useEffect, useMemo, useCallback } from "react";
import ContentMain from "../content/Content";
import {
  Button,
  Grid,
  IconButton,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useOverallPlan } from "../../contexts/OverallplanContext";

interface Column {
  id: "pid" | "year" | "name" | "detail";
  label: string;
  minWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
}

interface Data {
  pid: string;
  year: string;
  name: string;
  detail: JSX.Element;
}

const useDebounced = (value: string, delay = 200) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const Overallplan: React.FC = () => {
  const { fetchOverallPlans, deleteOverallPlanMain, plans,socket } = useOverallPlan();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [data, setData] = useState<Data[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounced(searchTerm, 200);
  const [filteredRows, setFilteredRows] = useState<Data[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const columns: readonly Column[] = [
    {
      id: "year",
      label: t("overallplan.col_year"),
      minWidth: 50,
      align: "center",
    },
    {
      id: "name",
      label: t("overallplan.col_name"),
      minWidth: 50,
      align: "center",
    },
    {
      id: "detail",
      label: t("overallplan.col_action"),
      minWidth: 50,
      align: "right",
    },
  ];


 useEffect(() => {
  if (plans.length === 0) {  
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        await fetchOverallPlans();
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  } else {
    setLoading(false); 
  }
}, [plans, fetchOverallPlans]);

  const mapped = useMemo(() => {
    return (plans || [])
      .slice()
      .sort((a: any, b: any) => Number(a.year) - Number(b.year))
      .map((item: any) => ({
        pid: String(item.id),
        year: String(item.year),
        name: new Date(item.created_at).toLocaleString("ja-JP"),
        detail: (
          <>
            <IconButton
              aria-label="edit"
              size="small"
              onClick={() => navigate(`/report/overallplan/edit/${item.id}`)}
            >
              <EditIcon fontSize="small" className="text-sky-600" />
            </IconButton>

            <IconButton
              aria-label="view"
              size="small"
              onClick={() => navigate(`/report/overallplan/view/${item.id}`)}
            >
              <RemoveRedEyeIcon fontSize="small" className="text-amber-500" />
            </IconButton>

            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => {
                setDeleteId(Number(item.id));
                setOpenConfirm(true);
              }}
            >
              <DeleteIcon fontSize="small" className="text-red-600" />
            </IconButton>
          </>
        ),
      }));
  }, [plans, navigate]);

  useEffect(() => {
    setData(mapped);
    setFilteredRows(mapped);
  }, [mapped]);

  useEffect(() => {
    if (debouncedSearch === "") {
      setFilteredRows(data);
    } else {
      const q = debouncedSearch.toLowerCase();
      setFilteredRows(data.filter((row) => row.year.toLowerCase().includes(q)));
    }
    setPage(0);
  }, [debouncedSearch, data]);

  const handleDelete = useCallback(
    async (id: string | number) => {
      const idStr = String(id);
      const idNum = Number(id);

      setData((prev) => prev.filter((d) => d.pid !== idStr));
      setFilteredRows((prev) => prev.filter((d) => d.pid !== idStr));

      try {
        await deleteOverallPlanMain(idNum);
      } catch (err) {
        await fetchOverallPlans();
      }
    },
    [deleteOverallPlanMain, fetchOverallPlans]
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const visibleRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  return (
    <>
      <ContentMain>
        <Grid container spacing={2} className="pt-7" justifyContent="center">
          <Grid item xs={3} sm={4} md={2} lg={2}>
            <TextField
              id="outlined-search"
              label={t("overallplan.search_age")}
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ bgcolor: "white" }}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Button variant="contained" sx={{ marginLeft: { xs: 6, sm: 1 } }}>
              <Typography component="div" style={{ color: "white" }}>
                {t("overallplan.search_button")}
              </Typography>
            </Button>
          </Grid>
        </Grid>

        <Grid container className="pt-7" justifyContent="right">
          <Grid>
            <Button
              variant="contained"
              onClick={() => navigate("/report/overallplan/add")}
              size="small"
              startIcon={<AddIcon />}
            >
              <Typography style={{ color: "white" }}>
                {t("overallplan.add_button")}
              </Typography>
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} className="pt-10" justifyContent="center">
          <Paper sx={{ width: "95%", overflow: "hidden" }} className="ms-4">
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        align="center"
                        sx={{ py: 6 }}
                      >
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : filteredRows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        align="center"
                        sx={{ py: 6 }}
                      >
                        データがありません
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleRows.map((row, index) => (
                      <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                        {columns.map((column) => {
                          const value = row[column.id as keyof Data];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id === "detail" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  {value}
                                </Box>
                              ) : (
                                value
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={filteredRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this item?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => {
                if (deleteId != null) handleDelete(deleteId);
                setOpenConfirm(false);
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </ContentMain>
    </>
  );
};

export default Overallplan;
