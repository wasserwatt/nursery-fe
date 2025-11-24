import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  LocalHospital as HospitalIcon,
  Description as DocumentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ContentMain from "../content/Content";
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';

// Theme Configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#8e9ff5',
      dark: '#5568d3',
    },
    secondary: {
      main: '#764ba2',
      light: '#9c68c8',
      dark: '#5a3780',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#FFC107',
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Sarabun", "Roboto", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
  },
});

interface IncidentReport {
  id: string;
  organizationName: string;
  childAge: { years: string; months: string };
  incidentType: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  hospitalVisit: string;
  hospitalName?: string;
  hasReceptionForm: boolean; // ตรวจว่ามี AccidentReceptionForm แล้วหรือยัง
  createdAt: string;
  updatedAt: string;
}

const IncidentList: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; reportId: string | null }>({
    open: false,
    reportId: null,
  });

  // Load reports from localStorage
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    try {
      // ในการใช้งานจริง จะดึงจาก API
      // const response = await axios.get('/api/incident-reports');
      
      // สำหรับ demo ดึงจาก localStorage
      const savedReports = localStorage.getItem('incidentReports');
      if (savedReports) {
        const parsed = JSON.parse(savedReports);
        setReports(parsed);
      } else {
        // ถ้าไม่มีข้อมูล ใช้ข้อมูล demo
        setReports(getDemoData());
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      setReports([]);
    }
  };

  const getDemoData = (): IncidentReport[] => {
    return [
      {
        id: '1',
        organizationName: '山田太郎',
        childAge: { years: '3', months: '6' },
        incidentType: '転倒・転落',
        incidentDate: '2024-01-15',
        incidentTime: '10:30',
        location: '園庭',
        hospitalVisit: '有',
        hospitalName: '市立総合病院',
        hasReceptionForm: true,
        createdAt: '2024-01-15T10:45:00',
        updatedAt: '2024-01-15T10:45:00',
      },
      {
        id: '2',
        organizationName: '佐藤花子',
        childAge: { years: '4', months: '2' },
        incidentType: '切傷',
        incidentDate: '2024-01-14',
        incidentTime: '14:20',
        location: '教室',
        hospitalVisit: '有',
        hospitalName: 'ABC小児科',
        hasReceptionForm: false, // ยังไม่ได้สร้าง Reception Form
        createdAt: '2024-01-14T14:35:00',
        updatedAt: '2024-01-14T14:35:00',
      },
      {
        id: '3',
        organizationName: '田中次郎',
        childAge: { years: '5', months: '1' },
        incidentType: '打撲',
        incidentDate: '2024-01-13',
        incidentTime: '11:15',
        location: '遊戯室',
        hospitalVisit: '無',
        hasReceptionForm: false,
        createdAt: '2024-01-13T11:30:00',
        updatedAt: '2024-01-13T11:30:00',
      },
    ];
  };

  const handleCreateNew = () => {
    navigate('/incident-report');
  };

  const handleView = (reportId: string) => {
    navigate(`/incident-report?id=${reportId}&mode=view`);
  };

  const handleEdit = (reportId: string) => {
    navigate(`/incident-report?id=${reportId}&mode=edit`);
  };

  const handleDelete = (reportId: string) => {
    setDeleteDialog({ open: true, reportId });
  };

  const confirmDelete = () => {
    if (deleteDialog.reportId) {
      // ลบออกจาก state
      const updatedReports = reports.filter(r => r.id !== deleteDialog.reportId);
      setReports(updatedReports);
      
      // ลบออกจาก localStorage
      localStorage.setItem('incidentReports', JSON.stringify(updatedReports));
      
      // ลบ AccidentReceptionForm ที่เกี่ยวข้องด้วย
      localStorage.removeItem(`accidentReception_${deleteDialog.reportId}`);
      
      alert('✅ 削除されました');
    }
    setDeleteDialog({ open: false, reportId: null });
  };

  const handleCreateReceptionForm = (report: IncidentReport) => {
    // บันทึกข้อมูลที่จะส่งไปหน้าถัดไป
    localStorage.setItem('currentIncidentReport', JSON.stringify(report));
    
    // Navigate to AccidentReceptionForm (create mode)
    navigate(`/accident-reception?reportId=${report.id}&mode=create`);
  };

  const handleViewReceptionForm = (reportId: string) => {
    // ไปดู AccidentReceptionForm ที่สร้างไว้แล้ว (view mode)
    navigate(`/accident-reception?reportId=${reportId}&mode=view`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getIncidentTypeColor = (type: string) => {
    const colors: { [key: string]: 'error' | 'warning' | 'info' | 'default' } = {
      '転倒・転落': 'error',
      '衝突': 'warning',
      '切傷': 'error',
      '打撲': 'info',
      '火傷': 'error',
      '誤飲・誤食': 'error',
    };
    return colors[type] || 'default';
  };

  return (
    <ThemeProvider theme={theme}>
      <ContentMain>
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                事故報告書一覧
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Incident Reports List
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
              sx={{ 
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
              }}
            >
              新規作成
            </Button>
          </Box>

          {/* Info Alert */}
          <Alert severity="info" sx={{ mb: 3 }}>
            💡 <strong>通院の有無が「有」</strong>の事故報告には、<strong>事故受付票</strong>を作成できます。
          </Alert>

          {/* Reports Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>No.</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>報告日</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>児童名</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>年齢</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>事故種類</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>場所</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>通院</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>事故受付票</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        データがありません
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report, index) => (
                    <TableRow 
                      key={report.id}
                      hover
                      sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{formatDate(report.incidentDate)}</TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500 }}>
                          {report.organizationName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {report.childAge.years}歳{report.childAge.months}ヶ月
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={report.incidentType} 
                          color={getIncidentTypeColor(report.incidentType)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{report.location}</TableCell>
                      <TableCell>
                        <Chip
                          label={report.hospitalVisit}
                          color={report.hospitalVisit === '有' ? 'error' : 'default'}
                          size="small"
                          icon={report.hospitalVisit === '有' ? <HospitalIcon /> : undefined}
                        />
                      </TableCell>
                      <TableCell>
                        {report.hospitalVisit === '有' ? (
                          report.hasReceptionForm ? (
                            <Tooltip title="詳細表示">
                              <Chip
                                label="作成済"
                                color="success"
                                size="small"
                                icon={<CheckCircleIcon />}
                                onClick={() => handleViewReceptionForm(report.id)}
                                sx={{ cursor: 'pointer' }}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title="事故受付票を作成">
                              <Button
                                variant="contained"
                                color="warning"
                                size="small"
                                startIcon={<DocumentIcon />}
                                onClick={() => handleCreateReceptionForm(report)}
                                sx={{ 
                                  fontSize: '0.75rem',
                                  py: 0.5,
                                  px: 1.5,
                                }}
                              >
                                作成
                              </Button>
                            </Tooltip>
                          )
                        ) : (
                          <Chip
                            label="対象外"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="詳細表示">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleView(report.id)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="編集">
                            <IconButton 
                              size="small" 
                              color="info"
                              onClick={() => handleEdit(report.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="削除">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDelete(report.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary Statistics */}
          <Box sx={{ mt: 3 }}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                        {reports.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        総件数
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="error" sx={{ fontWeight: 700 }}>
                        {reports.filter(r => r.hospitalVisit === '有').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        通院あり
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success" sx={{ fontWeight: 700 }}>
                        {reports.filter(r => r.hasReceptionForm).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        受付票作成済
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                        {reports.filter(r => r.hospitalVisit === '有' && !r.hasReceptionForm).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        受付票未作成
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialog.open}
            onClose={() => setDeleteDialog({ open: false, reportId: null })}
          >
            <DialogTitle>削除確認</DialogTitle>
            <DialogContent>
              <Typography>
                この事故報告書を削除してもよろしいですか？
              </Typography>
              <Alert severity="warning" sx={{ mt: 2 }}>
                関連する事故受付票も削除されます。
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog({ open: false, reportId: null })}>
                キャンセル
              </Button>
              <Button onClick={confirmDelete} color="error" variant="contained">
                削除
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </ContentMain>
    </ThemeProvider>
  );
};

export default IncidentList;