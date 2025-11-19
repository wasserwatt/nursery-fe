import React, { useState, useEffect } from "react";
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
  Skeleton,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
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

const Overallplan: React.FC = () => {
  const { fetchOverallPlans, deleteOverallPlanMain, plans } = useOverallPlan();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [data, setData] = useState<Data[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  interface Data {
    pid: string;
    year: string;
    name: string;
    detail: JSX.Element;
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true); // เริ่มโหลด
      await fetchOverallPlans(); // ดึงข้อมูล
      setLoading(false); // เสร็จแล้ว
    };

    load();
  }, []);

  const handleDelete = async (id: string | number) => {
    const idStr = String(id);
    const idNum = Number(id);

    setData((prev) => prev.filter((d) => d.pid !== idStr));
    setFilteredRows((prev) => prev.filter((d) => d.pid !== idStr));

    try {
      await deleteOverallPlanMain(idNum);
    } catch (err) {
      fetchOverallPlans();
    }
  };

  useEffect(() => {
    const mapped = plans
      .sort((a, b) => Number(a.year) - Number(b.year)) // ➜ เรียงจากน้อยไปมาก
      .map((item) => ({
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

    setData(mapped);
    setFilteredRows(mapped);
  }, [plans]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredRows(data);
    } else {
      setFilteredRows(
        data.filter((row) =>
          row.year.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, data]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
                  {loading
                    ? // 🔥 แสดง Skeleton 8 แถว (หรือจะเพิ่ม/ลดจำนวนก็ได้)
                      [...Array(8)].map((_, i) => (
                        <TableRow key={i}>
                          {columns.map((col) => (
                            <TableCell key={col.id} align={col.align}>
                              <Skeleton
                                variant="rectangular"
                                height={20}
                                sx={{ borderRadius: 1 }}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    : filteredRows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                          >
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.id === "detail" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                      }}
                                    >
                                      {value}
                                    </div>
                                  ) : (
                                    value
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
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
