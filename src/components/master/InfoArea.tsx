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
import { useCompetencies } from "../../contexts/master/CompetenciesContext";

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

type InfoRow = {
  id: number;
  competencies_detail: string;
};

const InfoArea: React.FC = () => {
  const { fetchM_competencies, createCompetencies, updateCompetencies, deleteCompetencies } = useCompetencies();

  const [rows, setRows] = useState<InfoRow[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
  const [current, setCurrent] = useState<InfoRow | null>(null);
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
      const data = await fetchM_competencies();
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
    return rows.filter((r) => r.competencies_detail.toLowerCase().includes(q) || String(r.id).includes(q));
  }, [rows, searchText]);

  // Dialog helpers
  const openCreate = () => {
    setDialogMode("create");
    setCurrent(null);
    setFormDetail("");
    setDialogOpen(true);
  };

  const openEdit = (item: InfoRow) => {
    setDialogMode("edit");
    setCurrent(item);
    setFormDetail(item.competencies_detail);
    setDialogOpen(true);
  };

  const openView = (item: InfoRow) => {
    setDialogMode("view");
    setCurrent(item);
    setFormDetail(item.competencies_detail);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (dialogLoading) return;
    setDialogOpen(false);
    setCurrent(null);
    setFormDetail("");
  };

  const handleSubmit = async () => {
    const detail = formDetail.trim();
    if (!detail) {
      setSnack({ open: true, severity: "error", message: "詳細を入力してください。" });
      return;
    }
    try {
      setDialogLoading(true);
      if (dialogMode === "create") {
        await createCompetencies({ competencies_detail: detail });
        setSnack({ open: true, severity: "success", message: "作成しました。" });
      } else if (dialogMode === "edit" && current) {
        await updateCompetencies(current.id, { competencies_detail: detail });
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
      await deleteCompetencies(toDeleteId);
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
          {/* Header */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: "#1976d2" }}>
              Competencies (育みたい 資質・能力)
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
                  placeholder="検索（ID / 詳細）"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
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
                  <TableCell sx={{ fontWeight: "bold" }}>詳細</TableCell>
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
                  filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.id}</TableCell>
                      <TableCell sx={{ whiteSpace: "pre-line" }}>{r.competencies_detail}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <IconButton size="small" onClick={() => openView(r)} color="info"><Visibility fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => openEdit(r)} color="primary"><Edit fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => confirmDelete(r.id)} color="error"><Delete fontSize="small" /></IconButton>
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
            {dialogMode === "create" && "新しい情報の作成"}
            {dialogMode === "edit" && "情報の編集"}
            {dialogMode === "view" && "情報の閲覧"}
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label="詳細"
              fullWidth
              multiline
              minRows={3}
              value={formDetail}
              onChange={(e) => setFormDetail(e.target.value)}
              disabled={dialogMode === "view" || dialogLoading}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} disabled={dialogLoading}>閉じる</Button>
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
            <Button onClick={() => setDeleteOpen(false)} disabled={dialogLoading}>キャンセル</Button>
            <Button color="error" onClick={handleDelete} disabled={dialogLoading} variant="contained">
              {dialogLoading ? <CircularProgress size={20} /> : "削除"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: "100%" }}>
            {snack.message}
          </Alert>
        </Snackbar>
      </ContentMain>
    </ThemeProvider>
  );
};

export default InfoArea;
