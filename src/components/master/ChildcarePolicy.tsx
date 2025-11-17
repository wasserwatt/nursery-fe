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
import {
  Edit,
  Delete,
  Search,
  Visibility,
  FilterList,
  Add,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ContentMain from "../content/Content";
import { usePolicy } from "../../contexts/master/PolicyContext";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2", light: "#42a5f5", dark: "#1565c0" },
    secondary: { main: "#9c27b0", light: "#ba68c8", dark: "#7b1fa2" },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: "16px" } } },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: "20px", textTransform: "none", fontWeight: 600 },
      },
    },
  },
});

type PolicyRow = {
  id: number;
  policy_detail: string; // 保育方針
};

const OverallplanMain: React.FC = () => {
  const { fetchM_policy, createPolicy, updatePolicy, deletePolicy } =
    usePolicy();

  const [rows, setRows] = useState<PolicyRow[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  // dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [current, setCurrent] = useState<PolicyRow | null>(null);
  const [formDetail, setFormDetail] = useState("");
  const [dialogLoading, setDialogLoading] = useState(false);

  // delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);

  // snackbar
  const [snack, setSnack] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({
    open: false,
    severity: "success",
    message: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchM_policy();
      setRows(data || []);
    } catch (err) {
      console.error(err);
      setSnack({
        open: true,
        severity: "error",
        message: "データの読み込みに失敗しました。",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!searchText.trim()) return rows;
    const q = searchText.toLowerCase();
    return rows.filter((r) => r.policy_detail.toLowerCase().includes(q));
  }, [rows, searchText]);

  // dialog helpers
  const openCreate = () => {
    setDialogMode("create");
    setCurrent(null);
    setFormDetail("");
    setDialogOpen(true);
  };

  const openEdit = (item: PolicyRow) => {
    setDialogMode("edit");
    setCurrent(item);
    setFormDetail(item.policy_detail ?? "");
    setDialogOpen(true);
  };

  const openView = (item: PolicyRow) => {
    setDialogMode("view");
    setCurrent(item);
    setFormDetail(item.policy_detail ?? "");
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
      setSnack({
        open: true,
        severity: "error",
        message: "保育方針を入力してください。",
      });
      return;
    }
    try {
      setDialogLoading(true);
      if (dialogMode === "create") {
        await createPolicy({ policy_detail: detail });
        setSnack({
          open: true,
          severity: "success",
          message: "作成しました。",
        });
      } else if (dialogMode === "edit" && current) {
        await updatePolicy(current.id, { policy_detail: detail });
        setSnack({
          open: true,
          severity: "success",
          message: "更新しました。",
        });
      }
      await loadData();
      closeDialog();
    } catch (err) {
      console.error(err);
      setSnack({
        open: true,
        severity: "error",
        message: "エラーが発生しました。",
      });
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
      await deletePolicy(toDeleteId);
      setSnack({ open: true, severity: "success", message: "削除しました。" });
      await loadData();
    } catch (err) {
      console.error(err);
      setSnack({
        open: true,
        severity: "error",
        message: "削除に失敗しました。",
      });
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
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ mb: 1, color: "#1976d2" }}
            >
              Policy (保育方針)
            </Typography>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={openCreate}
            >
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
                  placeholder="検索（保育方針）"
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
                  <TableCell sx={{ fontWeight: "bold" }}>保育方針</TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: 150 }}>
                    操作
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 6 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 6 }}>
                      データがありません
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell sx={{ whiteSpace: "pre-line" }}>
                        {r.policy_detail}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => openView(r)}
                            color="info"
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => openEdit(r)}
                            color="primary"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => confirmDelete(r.id)}
                            color="error"
                          >
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
            {dialogMode === "create" && "新しい保育方針の作成"}
            {dialogMode === "edit" && "保育方針の編集"}
            {dialogMode === "view" && "保育方針の閲覧"}
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label="保育方針"
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
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={dialogLoading}
              >
                {dialogLoading ? (
                  <CircularProgress size={20} />
                ) : dialogMode === "create" ? (
                  "作成"
                ) : (
                  "保存"
                )}
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
            <Button
              onClick={() => setDeleteOpen(false)}
              disabled={dialogLoading}
            >
              キャンセル
            </Button>
            <Button
              color="error"
              onClick={handleDelete}
              disabled={dialogLoading}
              variant="contained"
            >
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
          <Alert
            onClose={() => setSnack((s) => ({ ...s, open: false }))}
            severity={snack.severity}
            sx={{ width: "100%" }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      </ContentMain>
    </ThemeProvider>
  );
};

export default OverallplanMain;
