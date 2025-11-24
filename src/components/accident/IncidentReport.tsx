import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import {
  Save as SaveIcon,
  Print as PrintIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocalHospital as HospitalIcon,
  Warning as WarningIcon,
  WbSunny as WeatherIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import ContentMain from "../content/Content";
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

// Enhanced Theme Configuration
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
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
            }
          }
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '16px !important',
          marginBottom: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '0 0 16px 0',
          }
        }
      }
    }
  },
});

interface IncidentReport {
  organizationName: string;
  childAge: { years: string; months: string };
  incidentType: string;
  incidentDate: string;
  incidentTime: string;
  amPm: string;
  duration: string;
  weather: string;
  location: string;
  situation: string;
  parentContact: {
    who: string;
    when: string;
    issue: string;
  };
  hospitalVisit: string;
  hospitalName: string;
  department: string;
  cause: string;
  response: string;
  treatment: string;
  treatmentEndDate: string;
  recorder: string;
  directorDate: string;
  chiefDate: string;
}

const IncidentReportForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<IncidentReport>({
    organizationName: '',
    childAge: { years: '', months: '' },
    incidentType: '',
    incidentDate: '',
    incidentTime: '',
    amPm: 'AM',
    duration: '',
    weather: '',
    location: '',
    situation: '',
    parentContact: { who: '', when: '', issue: '' },
    hospitalVisit: '',
    hospitalName: '',
    department: '',
    cause: '',
    response: '',
    treatment: '',
    treatmentEndDate: '',
    recorder: '',
    directorDate: '',
    chiefDate: '',
  });

  const incidentTypes = [
    '転倒・転落',
    '衝突',
    '挟まれ',
    '切傷',
    '打撲',
    '火傷',
    '誤飲・誤食',
    'その他',
  ];

  const weatherOptions = [
    '晴れ',
    '曇り',
    '雨',
    '雪',
    'その他',
  ];

  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...(prev[parent as keyof IncidentReport] as any), [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Required fields validation
    if (!formData.organizationName.trim()) {
      errors.push('• 組織・児童名を入力してください');
    }

    if (!formData.childAge.years.trim()) {
      errors.push('• 児童の年齢（歳）を入力してください');
    }

    if (!formData.incidentType) {
      errors.push('• 事故の種類を選択してください');
    }

    if (!formData.incidentDate) {
      errors.push('• 発生日を入力してください');
    }

    if (!formData.incidentTime) {
      errors.push('• 時刻を入力してください');
    }

    if (!formData.weather) {
      errors.push('• 天候を選択してください');
    }

    if (!formData.location.trim()) {
      errors.push('• 場所を入力してください');
    }

    if (!formData.situation.trim()) {
      errors.push('• 症状・事故の状況を入力してください');
    }

    // Parent contact validation
    if (!formData.parentContact.who.trim()) {
      errors.push('• 保護者への対応状況（誰が）を入力してください');
    }

    if (!formData.parentContact.when.trim()) {
      errors.push('• 保護者への対応状況（どう説明し）を入力してください');
    }

    if (!formData.parentContact.issue.trim()) {
      errors.push('• 保護者への対応状況（了解が得られたか否か）を入力してください');
    }

    // Hospital visit validation
    if (!formData.hospitalVisit) {
      errors.push('• 通院の有無を選択してください');
    }

    if (formData.hospitalVisit === '有') {
      if (!formData.hospitalName.trim()) {
        errors.push('• 通院先を入力してください');
      }
      if (!formData.department.trim()) {
        errors.push('• 科を入力してください');
      }
    }

    if (!formData.cause.trim()) {
      errors.push('• 原因を入力してください');
    }

    if (!formData.response.trim()) {
      errors.push('• 反省及び防止策を入力してください');
    }

    if (!formData.recorder.trim()) {
      errors.push('• 記録責任者を入力してください');
    }

    if (!formData.directorDate) {
      errors.push('• 施設長 確認日を入力してください');
    }

    if (!formData.chiefDate) {
      errors.push('• 主任 確認日を入力してください');
    }

    // Show errors if any
    if (errors.length > 0) {
      alert('⚠️ 以下の項目を入力してください:\n\n' + errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleSave = () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }

    console.log('Saving form data:', formData);
    
    // Save to localStorage
    const reportId = Date.now().toString(); // Generate temporary ID
    const savedData = { ...formData, id: reportId };
    localStorage.setItem('incidentReport', JSON.stringify(savedData));
    localStorage.setItem('lastIncidentReportId', reportId);
    
    alert('✅ フォームが保存されました');
  };

  const handleNavigateToReception = () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }

    // Check if hospital visit is selected
    if (formData.hospitalVisit !== '有') {
      alert('⚠️ 通院の有無で「有」を選択してください');
      return;
    }

    // Save form before navigating
    const reportId = Date.now().toString();
    const savedData = { ...formData, id: reportId };
    localStorage.setItem('incidentReport', JSON.stringify(savedData));
    localStorage.setItem('lastIncidentReportId', reportId);

    // Navigate to Accident Reception Form
    alert('✅ 事故報告書を保存しました。事故受付票の作成に移ります。');
    
    // Using window.location for simplicity (can use react-router navigate instead)
    window.location.href = `/accident-reception?reportId=${reportId}`;
  };

    const handleBack = () => {
    if (window.confirm('編集中のデータは保存されません。戻りますか?')) {
      navigate('/incident-report-list');
    }
  };

  return (
  <ThemeProvider theme={theme}>
    <ContentMain>      
    
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
            事故報告書
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Incident Report Form
          </Typography>
        </Box>

        {/* Basic Information */}
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
              基本情報
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="組織・児童名"
                  value={formData.organizationName}
                  onChange={(e) => handleChange('organizationName', e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="歳"
                  type="number"
                  value={formData.childAge.years}
                  onChange={(e) => handleChange('childAge.years', e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">歳</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="ヶ月"
                  type="number"
                  value={formData.childAge.months}
                  onChange={(e) => handleChange('childAge.months', e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">ヶ月</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Incident Type */}
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ mr: 1 }} />
              事故の種類
            </Typography>
            <FormControl fullWidth>
              <InputLabel>事故の種類を選択</InputLabel>
              <Select
                value={formData.incidentType}
                onChange={(e) => handleChange('incidentType', e.target.value)}
                label="事故の種類を選択"
              >
                {incidentTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        {/* Incident Details */}
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
              事故の内容
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="発生日"
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => handleChange('incidentDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <RadioGroup
                    row
                    value={formData.amPm}
                    onChange={(e) => handleChange('amPm', e.target.value)}
                  >
                    <FormControlLabel value="AM" control={<Radio />} label="午前" />
                    <FormControlLabel value="PM" control={<Radio />} label="午後" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="時刻"
                  type="time"
                  value={formData.incidentTime}
                  onChange={(e) => handleChange('incidentTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <TimeIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="時間"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  placeholder="分"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>天候</InputLabel>
                  <Select
                    value={formData.weather}
                    onChange={(e) => handleChange('weather', e.target.value)}
                    label="天候"
                    startAdornment={
                      <InputAdornment position="start">
                        <WeatherIcon sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    }
                  >
                    {weatherOptions.map((weather) => (
                      <MenuItem key={weather} value={weather}>{weather}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="場所"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="症状・事故の状況"
                  value={formData.situation}
                  onChange={(e) => handleChange('situation', e.target.value)}
                  multiline
                  rows={4}
                  placeholder="事故発生時の詳細な状況を記入してください"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Response */}
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
              処置状況
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  保護者への対応状況
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="誰が"
                  value={formData.parentContact.who}
                  onChange={(e) => handleChange('parentContact.who', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="どう説明し"
                  value={formData.parentContact.when}
                  onChange={(e) => handleChange('parentContact.when', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="了解が得られたか否か"
                  value={formData.parentContact.issue}
                  onChange={(e) => handleChange('parentContact.issue', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <FormLabel>通院の有無</FormLabel>
                  <RadioGroup
                    row
                    value={formData.hospitalVisit}
                    onChange={(e) => handleChange('hospitalVisit', e.target.value)}
                  >
                    <FormControlLabel value="有" control={<Radio />} label="有" />
                    <FormControlLabel value="無" control={<Radio />} label="無" />
                  </RadioGroup>
                </FormControl>
                
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="通院先"
                  value={formData.hospitalName}
                  onChange={(e) => handleChange('hospitalName', e.target.value)}
                  disabled={formData.hospitalVisit !== '有'}
                  InputProps={{
                    startAdornment: <HospitalIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="科"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  disabled={formData.hospitalVisit !== '有'}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Analysis */}
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
              考察
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="原因"
                  value={formData.cause}
                  onChange={(e) => handleChange('cause', e.target.value)}
                  multiline
                  rows={3}
                  placeholder="事故の原因を分析してください"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="反省及び防止策"
                  value={formData.response}
                  onChange={(e) => handleChange('response', e.target.value)}
                  multiline
                  rows={4}
                  placeholder="再発防止のための対策を記入してください"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Other Information */}
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
              その他
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="治療経過・完治確認など（治療終了日等）"
                  value={formData.treatment}
                  onChange={(e) => handleChange('treatment', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="治療終了日"
                  type="date"
                  value={formData.treatmentEndDate}
                  onChange={(e) => handleChange('treatmentEndDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Signatures */}
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
              記録・承認
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="記録責任者"
                  value={formData.recorder}
                  onChange={(e) => handleChange('recorder', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="施設長 確認日"
                  type="date"
                  value={formData.directorDate}
                  onChange={(e) => handleChange('directorDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="主任 確認日"
                  type="date"
                  value={formData.chiefDate}
                  onChange={(e) => handleChange('chiefDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 4 }}>
          <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ px: 4, py: 1.5 }}
            >
              戻る
            </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ px: 4, py: 1.5 }}
          >
            保存
          </Button>
        </Stack>
      </Paper>
    
          </ContentMain>
    </ThemeProvider>
  );
};

export default IncidentReportForm;