import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete, Search, Visibility, FilterList, Add } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ContentMain from "../content/Content";
import { useFigures } from "../../contexts/master/FiguresContext";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 20, textTransform: "none", fontWeight: 600 } } },
  },
});

type CareContentRow = {
  id: number;
  ten_detail: string;
};

const CareContent: React.FC = () => {
  const { fetchM_ten_figures, createFigures, updateFigures, deleteFigures } = useFigures();

  const [rows, setRows] = useState<CareContentRow[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
  const [current, setCurrent] = useState<CareContentRow | null>(null);
  const [formDetail, setFormDetail] = useState("");
  const [dialogLoading, setDialogLoading] = useState(false);

  // Delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);

  // Snackbar
  const [snack, setSnack] = useState<{ open: boolean; severity: "success" | "error"; message: string }>({
    open: false,
    severity: "success",
    message: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchM_ten_figures();
      setRows(data || []);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: "error", message: "データの読み込みに失敗しました。" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (!searchText.trim()) return rows;
    const q = searchText.toLowerCase();
    return rows.filter((r) => r.ten_detail.toLowerCase().includes(q) || String(r.id).includes(q));
  }, [rows, searchText]);

  // Dialog helpers
  const openCreate = () => {
    setDialogMode("create");
    setCurrent(null);
    setFormDetail("");
    setDialogOpen(true);
  };

  const openEdit = (row: CareContentRow) => {
    setDialogMode("edit");
    setCurrent(row);
    setFormDetail(row.ten_detail);
    setDialogOpen(true);
  };

  const openView = (row: CareContentRow) => {
    setDialogMode("view");
    setCurrent(row);
    setFormDetail(row.ten_detail);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (dialogLoading) return;
    setDialogOpen(false);
    setCurrent(null);
    setFormDetail("");
  };

  const handleSubmit = async () => {
    if (!formDetail.trim()) {
      setSnack({ open: true, severity: "error", message: "内容を入力してください。" });
      return;
    }
    try {
      setDialogLoading(true);
      if (dialogMode === "create") {
        await createFigures({ ten_detail: formDetail });
        setSnack({ open: true, severity: "success", message: "作成しました。" });
      } else if (dialogMode === "edit" && current) {
        await updateFigures(current.id, { ten_detail: formDetail });
        setSnack({ open: true, severity: "success", message: "更新しました。" });
      }
      await loadData();
      closeDialog();
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: "error", message: "エラーが発生しました。" });
    } finally {
      setDialogLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setToDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (toDeleteId == null) return;
    try {
      setDialogLoading(true);
      await deleteFigures(toDeleteId);
      setSnack({ open: true, severity: "success", message: "削除しました。" });
      await loadData();
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: "error", message: "削除に失敗しました。" });
    } finally {
      setDialogLoading(false);
      setDeleteOpen(false);
      setToDeleteId(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ContentMain>
        <Box sx={{ p: 3, minHeight: "100vh" }}>
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: "#1976d2" }}>
              Ten Figures (10の姿)
            </Typography>
            <Button startIcon={<Add />} variant="contained" onClick={openCreate}>
              新規作成
            </Button>
          </Box>

          {/* Filter */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FilterList sx={{ mr: 1, color: "#1976d2" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                フィルター
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="検索（内容 / ID）"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Table */}
          <TableContainer component={Paper} sx={{ borderRadius: "16px" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f3e5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>内容</TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: 150 }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                      データがありません
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell sx={{ whiteSpace: "pre-line" }}>{row.ten_detail}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <IconButton size="small" onClick={() => openView(row)} color="info">
                            <Visibility fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => openEdit(row)} color="primary">
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => confirmDelete(row.id)} color="error">
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Dialog */}
        <Dialog open={dialogOpen} fullWidth maxWidth="sm" onClose={closeDialog}>
          <DialogTitle>
            {dialogMode === "create" && "新規作成"}
            {dialogMode === "edit" && "編集"}
            {dialogMode === "view" && "閲覧"}
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label="内容"
              fullWidth
              multiline
              minRows={3}
              value={formDetail}
              onChange={(e) => setFormDetail(e.target.value)}
              disabled={dialogMode === "view" || dialogLoading}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} disabled={dialogLoading}>
              閉じる
            </Button>
            {dialogMode !== "view" && (
              <Button variant="contained" onClick={handleSubmit} disabled={dialogLoading}>
                {dialogLoading ? <CircularProgress size={20} /> : dialogMode === "create" ? "作成" : "保存"}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogTitle>削除確認</DialogTitle>
          <DialogContent>
            <Typography>このレコードを削除してもよろしいですか？</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)} disabled={dialogLoading}>
              キャンセル
            </Button>
            <Button color="error" variant="contained" onClick={handleDelete} disabled={dialogLoading}>
              {dialogLoading ? <CircularProgress size={20} /> : "削除"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: "100%" }}>
            {snack.message}
          </Alert>
        </Snackbar>
      </ContentMain>
    </ThemeProvider>
  );
};

export default CareContent;
