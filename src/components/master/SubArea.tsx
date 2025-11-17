import React, { useEffect, useState } from 'react';
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
  Tooltip,
  Collapse,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit, Delete, Search, Visibility, FilterList, ExpandMore, ExpandLess, Close } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ContentMain from '../content/Content';
import { useNavigate } from 'react-router-dom';
import { useSubarea } from "../../contexts/master/SubareaContext";
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
    secondary: { main: '#9c27b0', light: '#ba68c8', dark: '#7b1fa2' },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 20, textTransform: 'none', fontWeight: 600 } } },
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
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical' as const,
  WebkitLineClamp: 3,
  whiteSpace: 'pre-line',
  lineHeight: 1.6,
};

const ROWS_PER_PAGE = 10;

const SubArea: React.FC = () => {
  const navigate = useNavigate();
  const { fetchSubareas, updateSubarea } = useSubarea();
  const [rows, setRows] = useState<SubAreaRow[]>([]);
  const [searchText, setSearchText] = useState('');
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  // State สำหรับ Edit Dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<SubAreaRow | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    yougo_desc: '',
  });

  // โหลดข้อมูลตอน component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchSubareas();
        setRows(data);
      } catch (error) {
        console.error('Error loading yougo data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchSubareas]);

  // กรองข้อมูลตามการค้นหา
  const filteredRows = searchText.trim()
    ? rows.filter(r =>
        [r.id, r.title, r.yougo_desc, r.no_desc]
          .map(String)
          .some(v => v.toLowerCase().includes(searchText.toLowerCase()))
      )
    : rows;

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(filteredRows.length / ROWS_PER_PAGE);

  // ข้อมูลที่จะแสดงในหน้าปัจจุบัน
  const displayedRows = filteredRows.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  // Reset หน้าเป็น 1 เมื่อค้นหา
  useEffect(() => {
    setPage(1);
  }, [searchText]);

  
  
  const handleEdit = (id: number) => {
    const row = rows.find(r => r.id === id);
    if (row) {
      setEditingRow(row);
      setEditForm({
        title: row.title,
        yougo_desc: row.yougo_desc,
      });
      setEditOpen(true);
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditingRow(null);
    setEditForm({ title: '', yougo_desc: '' });
  };

const handleEditSave = async () => {
  if (!editingRow) return;

  try {
    await updateSubarea(editingRow.id, {
      yougo_desc: editForm.yougo_desc,
    });

    // อัพเดท state ในหน้า
    setRows(prev =>
      prev.map(r =>
        r.id === editingRow.id
          ? { ...r, yougo_desc: editForm.yougo_desc }
          : r
      )
    );

    handleEditClose();
    alert('データを更新しました');
    
  } catch (error) {
    console.error('Error updating data:', error);
    alert('データの更新に失敗しました');
  }
};

  const handleDelete = (id: number) => {
    if (window.confirm('削除しますか？')) {
      setRows(prev => prev.filter(r => r.id !== id));
    }
  };

  const toggle = (id: number) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <ContentMain>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Typography>データを読み込んでいます...</Typography>
          </Box>
        </ContentMain>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <ContentMain>
        <Box sx={{ p: 3, minHeight: '100vh' }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: 'primary.main' }}>
                Yougo (養護)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              全 {filteredRows.length} 件
            </Typography>
          </Box>

          {/* Filter */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterList sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
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

          {/* Single Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto', mb: 1 }}>
            <Table sx={{ '& td': { verticalAlign: 'top' } }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                  <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>sub_info</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>管理</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {displayedRows.length > 0 ? (
                  displayedRows.map(r => {
                    const isOpen = !!expanded[r.id];
                    return (
                      <TableRow key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.title}</TableCell>

                        {/* 長文セル：3行クランプ + 展開 */}
                        <TableCell sx={{ minWidth: 420 }}>
                          <Box>
                            {!isOpen ? (
                              <Box sx={clampStyles}>{r.yougo_desc}</Box>
                            ) : (
                              <Collapse in={isOpen} timeout="auto" unmountOnExit={false}>
                                <Typography sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                  {r.yougo_desc}
                                </Typography>
                              </Collapse>
                            )}
                          </Box>
                        </TableCell>

                        {/* 管理ボタン 横並び */}
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton size="small" onClick={() => handleEdit(r.id)} color="primary">
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDelete(r.id)} color="error">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        データが見つかりません
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: 'primary.main',
            color: 'white'
          }}>
            <Typography variant="h6" fontWeight="bold">
              データ編集 (ID: {editingRow?.id})
            </Typography>
            <IconButton onClick={handleEditClose} sx={{ color: 'white' }} size="small">
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={3}>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="説明 (yougo_desc)"
                  value={editForm.yougo_desc}
                  onChange={(e) => setEditForm(prev => ({ ...prev, yougo_desc: e.target.value }))}
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
      </ContentMain>
    </ThemeProvider>
  );
};

export default SubArea;