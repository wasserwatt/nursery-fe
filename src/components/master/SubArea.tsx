import React, { useEffect, useState } from "react";
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
  Collapse,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  Delete,
  Search,
  Visibility,
  FilterList,
  Close,
  Add,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ContentMain from "../content/Content";
import { useNavigate } from "react-router-dom";
import { useSubarea } from "../../contexts/master/SubareaContext";
import { useDevelopment_areas } from "../../contexts/master/development_areasContext";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2", light: "#42a5f5", dark: "#1565c0" },
    secondary: { main: "#9c27b0", light: "#ba68c8", dark: "#7b1fa2" },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 20, textTransform: "none", fontWeight: 600 },
      },
    },
  },
});

type SubAreaRow = {
  id: number;
  development_area_id: number;
  title_id: number;
  title: string;
  no_desc: number;
  yougo_desc: string;
};

const clampStyles = {
  overflow: "hidden",
  display: "-webkit-box" as const,
  WebkitBoxOrient: "vertical" as const,
  WebkitLineClamp: 3,
  whiteSpace: "pre-line",
  lineHeight: 1.6,
};

const ROWS_PER_PAGE = 10;

const SubArea: React.FC = () => {
  const navigate = useNavigate();
  const { fetchM_development_areas } = useDevelopment_areas();
  const { fetchSubareas, updateSubarea, createSubarea, deleteSubarea } =
    useSubarea();

  const [rows, setRows] = useState<SubAreaRow[]>([]);
  const [developmentAreas, setDevelopmentAreas] = useState<
    { id: number; title: string }[]
  >([]);
  const [searchText, setSearchText] = useState("");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Edit Dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<SubAreaRow | null>(null);
  const [editForm, setEditForm] = useState({ title: "", yougo_desc: "" });

  // View Dialog
  const [viewOpen, setViewOpen] = useState(false);
  const [viewRow, setViewRow] = useState<SubAreaRow | null>(null);

  // Create Dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    development_area_id: 0,
    title_id: 0,
    title: "",
    yougo_desc: "",
  });
  const [titles, setTitles] = useState<
    {
      development_area_id: any;
      id: number;
      title: string;
      last_no_desc: number;
    }[]
  >([]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const subareas = await fetchSubareas();
        setRows(subareas);

        const devAreas = await fetchM_development_areas();
        setDevelopmentAreas(
          devAreas.map((d) => ({ id: d.id, title: d.name_ja }))
        );
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchSubareas, fetchM_development_areas]);

  // Filtered rows
  const filteredRows = searchText.trim()
    ? rows.filter((r) =>
        [r.id, r.title, r.yougo_desc, r.no_desc]
          .map(String)
          .some((v) => v.toLowerCase().includes(searchText.toLowerCase()))
      )
    : rows;

  const totalPages = Math.ceil(filteredRows.length / ROWS_PER_PAGE);
  const displayedRows = filteredRows.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  useEffect(() => setPage(1), [searchText]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Edit
  const handleEdit = (id: number) => {
    const row = rows.find((r) => r.id === id);
    if (row) {
      setEditingRow(row);
      setEditForm({ title: row.title, yougo_desc: row.yougo_desc });
      setEditOpen(true);
    }
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setEditingRow(null);
    setEditForm({ title: "", yougo_desc: "" });
  };
  const handleEditSave = async () => {
    if (!editingRow) return;
    try {
      await updateSubarea(editingRow.id, { yougo_desc: editForm.yougo_desc });
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingRow.id ? { ...r, yougo_desc: editForm.yougo_desc } : r
        )
      );
      handleEditClose();
      alert("データを更新しました");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("データの更新に失敗しました");
    }
  };

  // Delete
  const handleDelete = (id: number) => {
    if (window.confirm("削除しますか？")) {
      deleteSubarea(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // View
  const handleViewOpen = (row: SubAreaRow) => {
    setViewRow(row);
    setViewOpen(true);
  };
  const handleViewClose = () => {
    setViewOpen(false);
    setViewRow(null);
  };

  // Create
  const handleCreateOpen = async () => {
    setCreateOpen(true);
    // Group titles
    const grouped = rows.reduce((acc: any, curr) => {
      const exists = acc.find((a: any) => a.id === curr.title_id);
      if (exists) {
        exists.last_no_desc = Math.max(exists.last_no_desc, curr.no_desc);
      } else if (curr.title_id) {
        acc.push({
          id: curr.title_id,
          title: curr.title,
          last_no_desc: curr.no_desc,
        });
      }
      return acc;
    }, []);
    setTitles(grouped);
  };

  const handleCreateSave = async () => {
    try {
      if (createForm.title_id === 0) {
        // ====== สร้าง Title ใหม่ ======
        if (!createForm.title || createForm.development_area_id === 0) {
          alert("กรุณากรอก Title และเลือก Development Area");
          return;
        }

        // หา title_id ล่าสุดจาก rows หรือ titles
        const maxTitleId =
          titles.length > 0 ? Math.max(...titles.map((t) => t.id)) : 0;

        const newTitleId = maxTitleId + 1;

        const newYougo = await createSubarea({
          title: createForm.title,
          development_area_id: createForm.development_area_id,
          yougo_desc: createForm.yougo_desc,
          title_id: newTitleId, // 👈 ใช้ตัวถัดไป
          no_desc: 1,
        });

        setRows((prev) => [...prev, newYougo]);
      } else {
        // ====== ใช้ Title เดิม ======
        const existingTitle = titles.find((t) => t.id === createForm.title_id);
        if (!existingTitle) return;

        const developmentAreaId = existingTitle.development_area_id;

        // หา no_desc ล่าสุดของ Title เดียวกัน
        const lastNoDesc = rows
          .filter((r) => r.title_id === createForm.title_id)
          .reduce((max, r) => (r.no_desc > max ? r.no_desc : max), 0);

        const newYougo = await createSubarea({
          title_id: existingTitle.id,
          title: existingTitle.title,
          development_area_id: developmentAreaId,
          yougo_desc: createForm.yougo_desc,
          no_desc: lastNoDesc + 1,
        });

        setRows((prev) => [...prev, newYougo]);
      }

      // Reset form
      setCreateForm({
        title_id: 0,
        title: "",
        development_area_id: 0,
        yougo_desc: "",
      });
      setCreateOpen(false);
    } catch (error) {
      console.error(error);
      alert("สร้างข้อมูลล้มเหลว");
    }
  };
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <ContentMain>
          <Box
            sx={{
              p: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
            }}
          >
            <Typography>データを読み込んでいます...</Typography>
          </Box>
        </ContentMain>
      </ThemeProvider>
    );
  }

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
              Yougo (養護)
            </Typography>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={handleCreateOpen}
            >
              作成
            </Button>
          </Box>

          {/* Filter */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FilterList sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                フィルター
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="検索（全カラム）"
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
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, overflowX: "auto", mb: 1 }}
          >
            <Table sx={{ "& td": { verticalAlign: "top" } }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f3e5f5" }}>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    Title
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>sub_info</TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    管理
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        データが見つかりません
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedRows.map((r) => {
                    const isOpen = !!expanded[r.id];
                    return (
                      <TableRow key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.title}</TableCell>
                        <TableCell sx={{ minWidth: 420 }}>
                          <Box>
                            {!isOpen ? (
                              <Box sx={clampStyles}>{r.yougo_desc}</Box>
                            ) : (
                              <Collapse
                                in={isOpen}
                                timeout="auto"
                                unmountOnExit={false}
                              >
                                <Typography
                                  sx={{
                                    whiteSpace: "pre-line",
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {r.yougo_desc}
                                </Typography>
                              </Collapse>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleViewOpen(r)}
                              color="info"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(r.id)}
                              color="primary"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(r.id)}
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Box>

        {/* Edit Dialog */}
        <Dialog
          open={editOpen}
          onClose={handleEditClose}
          maxWidth="md"
          fullWidth
          scroll="paper"
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "primary.main",
              color: "white",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <Typography variant="h6" component="div" fontWeight="bold">
              データ編集 (ID: {editingRow?.id})
            </Typography>
            <IconButton
              onClick={handleEditClose}
              sx={{ color: "white" }}
              size="small"
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent
            dividers
            sx={{
              mt: 1,
              maxHeight: "60vh",
              overflowY: "auto",
              px: 2,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="説明 (yougo_desc)"
                  value={editForm.yougo_desc}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      yougo_desc: e.target.value,
                    }))
                  }
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={handleEditClose}
              variant="outlined"
              color="inherit"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleEditSave}
              variant="contained"
              color="primary"
            >
              保存
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Dialog */}
        <Dialog
          open={viewOpen}
          onClose={handleViewClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "primary.main",
              color: "white",
            }}
          >
            <Typography variant="h6" component="div" fontWeight="bold">
              データ詳細 (ID: {viewRow?.id})
            </Typography>
            <IconButton
              onClick={handleViewClose}
              sx={{ color: "white" }}
              size="small"
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Title
            </Typography>
            <Typography sx={{ mb: 2 }}>{viewRow?.title}</Typography>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              説明 (yougo_desc)
            </Typography>
            <Typography sx={{ whiteSpace: "pre-line" }}>
              {viewRow?.yougo_desc}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleViewClose}
              variant="contained"
              color="primary"
            >
              閉じる
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Dialog */}
        <Dialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          maxWidth="md"
          fullWidth
          scroll="paper" // ทำให้ scroll เฉพาะ content
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "primary.main",
              color: "white",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <Typography variant="h6" component="div" fontWeight="bold">
              新しいYougoを作成
            </Typography>
            <IconButton
              onClick={() => setCreateOpen(false)}
              sx={{ color: "white" }}
              size="small"
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent
            dividers
            sx={{
              mt: 1,
              maxHeight: "60vh",
              overflowY: "auto",
              px: 2,
            }}
          >
            <Grid container spacing={2}>
              {createForm.title_id === 0 && (
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="開発分野 (Development Area)"
                    value={createForm.development_area_id}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        development_area_id: Number(e.target.value),
                      }))
                    }
                    SelectProps={{ native: true }}
                  >
                    <option value={0}>-- 選択 --</option>
                    {developmentAreas.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="既存のTitleを選択"
                  value={createForm.title_id}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      title_id: Number(e.target.value),
                      title: "",
                    }))
                  }
                  SelectProps={{ native: true }}
                >
                  <option value={0}>-- 新しいTitleを入力 --</option>
                  {titles.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </TextField>
              </Grid>

              {createForm.title_id === 0 && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="新しいTitle"
                    value={createForm.title}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="説明 (Yougo Desc)"
                  value={createForm.yougo_desc}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      yougo_desc: e.target.value,
                    }))
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setCreateOpen(false)} variant="outlined">
              キャンセル
            </Button>
            <Button
              onClick={handleCreateSave}
              variant="contained"
              color="primary"
            >
              作成
            </Button>
          </DialogActions>
        </Dialog>
      </ContentMain>
    </ThemeProvider>
  );
};

export default SubArea;
