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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Search, FilterList, Add } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ContentMain from "../content/Content";
import { useDevelopment_areas } from "../../contexts/master/development_areasContext";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: "16px" } } },
  },
});

type DevelopmentRow = {
  id: number;
  code: string;
  name_ja: string;
  name_en: string;
};

const DevelopmentArea: React.FC = () => {
  const {
    fetchM_development_areas,
    createDevelopment_areas,
    updateDevelopment_areas,
    deleteDevelopment_areas,
  } = useDevelopment_areas();

  const [rows, setRows] = useState<DevelopmentRow[]>([]);
  const [searchText, setSearchText] = useState("");

  // Popup สำหรับเพิ่ม/แก้ไข
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Popup ลบ
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);
  const [dialogLoading, setDialogLoading] = useState(false);

  // Snackbar
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [form, setForm] = useState({
    code: "",
    name_ja: "",
    name_en: "",
  });

  // โหลดข้อมูล
  const loadData = async () => {
    const data = await fetchM_development_areas();
    setRows(data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Search filter
  const filtered = useMemo(() => {
    if (!searchText.trim()) return rows;
    const q = searchText.toLowerCase();
    return rows.filter(
      (r) =>
        r.code.toLowerCase().includes(q) ||
        r.name_ja.toLowerCase().includes(q) ||
        r.name_en.toLowerCase().includes(q)
    );
  }, [rows, searchText]);

  // Add
  const handleAdd = () => {
    setEditId(null);
    setForm({ code: "", name_ja: "", name_en: "" });
    setOpen(true);
  };

  // Edit
  const handleEdit = (row: DevelopmentRow) => {
    setEditId(row.id);
    setForm({
      code: row.code,
      name_ja: row.name_ja,
      name_en: row.name_en,
    });
    setOpen(true);
  };

  // 🔥 เปิด dialog ลบแบบสวย ๆ
  const openDeleteDialog = (id: number) => {
    setToDeleteId(id);
    setDeleteOpen(true);
  };

  // 🔥 ลบแบบมีโหลด + snackbar
  const handleDelete = async () => {
    if (toDeleteId == null) return;

    try {
      setDialogLoading(true);
      await deleteDevelopment_areas(toDeleteId);

      setSnack({
        open: true,
        severity: "success",
        message: "削除しました。",
      });

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

  // Save
  const handleSave = async () => {
    if (!form.code || !form.name_ja) {
      alert("必須項目を入力してください");
      return;
    }

    if (editId === null) {
      const newItem = await createDevelopment_areas(form);
      setRows((prev) => [...prev, newItem]);
    } else {
      const updated = await updateDevelopment_areas(editId, form);
      setRows((prev) => prev.map((r) => (r.id === editId ? updated : r)));
    }

    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <ContentMain>
        <Box sx={{ p: 3, minHeight: "100vh" }}>
          {/* Header */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: "#1976d2" }}
            >
              Development Area（保育）
            </Typography>

            <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
              新規追加
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
                  placeholder="検索キーワード"
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
                  <TableCell sx={{ fontWeight: "bold" }}>コード</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>日本語名</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>英語名</TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: 150 }}>
                    操作
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.code}</TableCell>
                    <TableCell>{r.name_ja}</TableCell>
                    <TableCell>{r.name_en}</TableCell>

                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(r)}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => openDeleteDialog(r.id)}
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Popup เพิ่ม/แก้ไข */}
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>{editId === null ? "新規作成" : "編集"}</DialogTitle>
            <DialogContent dividers>
              <TextField
                margin="normal"
                fullWidth
                label="コード"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />

              <TextField
                margin="normal"
                fullWidth
                label="日本語名"
                value={form.name_ja}
                onChange={(e) => setForm({ ...form, name_ja: e.target.value })}
              />

              <TextField
                margin="normal"
                fullWidth
                label="英語名"
                value={form.name_en}
                onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpen(false)}>キャンセル</Button>
              <Button variant="contained" onClick={handleSave}>
                保存
              </Button>
            </DialogActions>
          </Dialog>

          {/* 🔥 Popup ลบแบบสวย ๆ */}
          <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
            <DialogTitle>削除確認</DialogTitle>
            <DialogContent dividers>本当に削除しますか？</DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteOpen(false)}>キャンセル</Button>

              <Button
                color="error"
                variant="contained"
                onClick={handleDelete}
                disabled={dialogLoading}
                startIcon={
                  dialogLoading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
              >
                削除
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={snack.open}
            autoHideDuration={3000}
            onClose={() => setSnack({ ...snack, open: false })}
          >
            <Alert
              severity={snack.severity}
              onClose={() => setSnack({ ...snack, open: false })}
              variant="filled"
            >
              {snack.message}
            </Alert>
          </Snackbar>
        </Box>
      </ContentMain>
    </ThemeProvider>
  );
};

export default DevelopmentArea;
