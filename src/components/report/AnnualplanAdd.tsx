import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  InputAdornment,
  MenuItem,
  Chip,
  IconButton,
  Stack,
  Paper,
  Tooltip,
  Fade,
  Zoom,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  styled
} from '@mui/material';
import {
  Save,
  CheckCircle,
  Business,
  Person,
  CalendarToday,
  Info,
  Public,
  Add,
  Delete,
  Print,
  Clear,
  Edit,
  Schedule,
  School,
  FamilyRestroom,
  EmojiObjects,
  Favorite,
  ArrowBack,
  ExpandMore,
  AccessTime,
  HealthAndSafety,
  Groups,
  Nature,
  Chat,
  Palette
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ContentMain from "../content/Content";
import { useTranslation } from 'react-i18next';

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

// Types for Age 0
interface PeriodDataAge0 {
  yougo: string;
  kyouiku: string;
  life: string;
  attitude: string;
  support: string;
}

interface PeriodAge0 {
  id: number;
  name: string;
  range: string;
  status: 'empty' | 'partial' | 'completed';
  data: PeriodDataAge0;
}

// Types for Age 1-5
interface PeriodDataAge1to5 {
  yougo: string;
  kyouiku: string;
  health: string;
  humanRelations: string;
  environment: string;
  language: string;
  expression: string;
  support: string;
  familyCooperation: string;
}

interface PeriodAge1to5 {
  id: number;
  name: string;
  range: string;
  status: 'empty' | 'partial' | 'completed';
  data: PeriodDataAge1to5;
}

interface HeaderData {
  year: string;
  classroom: string;
  age: string;
  responsiblePerson: string;
  annualGoal: string;
}

// Options
const classroomOptions = [
  { value: 'ぺんぎん', label: 'ぺんぎん (เพนกวิน)' },
  { value: 'しまうま', label: 'しまうま (ม้าลาย)' },
  { value: 'ぞう', label: 'ぞう (ช้าง)' },
];

const responsiblePersonOptions = [
  { value: '田中先生', label: '田中先生 (ทานากะ เซนเซ)' },
  { value: '佐藤先生', label: '佐藤先生 (ซาโตะ เซนเซ)' },
  { value: '鈴木先生', label: '鈴木先生 (ซูซูกิ เซนเซ)' },
];

const ageOptions = [
  { value: '0', label: '0歳' },
  { value: '1', label: '1歳' },
  { value: '2', label: '2歳' },
  { value: '3', label: '3歳' },
  { value: '4', label: '4歳' },
  { value: '5', label: '5歳' }
];

const romanNumerals = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ'];

const AnnualplanAdd: React.FC = () => {
  const { t } = useTranslation();
  
  // State Management
  const [expandedPeriods, setExpandedPeriods] = useState<number[]>([0]);
  const [headerData, setHeaderData] = useState<HeaderData>({
    year: new Date().getFullYear().toString(),
    classroom: '',
    age: '0',
    responsiblePerson: '',
    annualGoal: ''
  });
  
  // State for Age 0 periods
  const [periodsAge0, setPeriodsAge0] = useState<PeriodAge0[]>([
    {
      id: 1,
      name: 'Ⅰ期',
      range: '3か月～6か月',
      status: 'empty',
      data: {
        yougo: '',
        kyouiku: '',
        life: '',
        attitude: '',
        support: ''
      }
    },
    {
      id: 2,
      name: 'Ⅱ期',
      range: '6か月～9か月',
      status: 'empty',
      data: {
        yougo: '',
        kyouiku: '',
        life: '',
        attitude: '',
        support: ''
      }
    }
  ]);

  // State for Age 1-5 periods
  const [periodsAge1to5, setPeriodsAge1to5] = useState<PeriodAge1to5[]>([
    {
      id: 1,
      name: 'Ⅰ期',
      range: '4月～6月',
      status: 'empty',
      data: {
        yougo: '',
        kyouiku: '',
        health: '',
        humanRelations: '',
        environment: '',
        language: '',
        expression: '',
        support: '',
        familyCooperation: ''
      }
    },
    {
      id: 2,
      name: 'Ⅱ期',
      range: '7月～9月',
      status: 'empty',
      data: {
        yougo: '',
        kyouiku: '',
        health: '',
        humanRelations: '',
        environment: '',
        language: '',
        expression: '',
        support: '',
        familyCooperation: ''
      }
    }
  ]);

  const [nextPeriodId, setNextPeriodId] = useState<number>(3);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Determine which form to show
  const isAge0 = headerData.age === '0';
  const isAge1to5 = ['1', '2', '3', '4', '5'].includes(headerData.age);

  // Get current periods based on age
  const getCurrentPeriods = (): (PeriodAge0 | PeriodAge1to5)[] => {
    if (isAge0) return periodsAge0;
    if (isAge1to5) return periodsAge1to5;
    return [];
  };

  // Reset periods when age changes
  useEffect(() => {
    if (headerData.age) {
      setExpandedPeriods([0]);
      setNextPeriodId(3);
      
      if (isAge0) {
        setPeriodsAge0([
          {
            id: 1,
            name: 'Ⅰ期',
            range: '3か月～6か月',
            status: 'empty',
            data: {
              yougo: '',
              kyouiku: '',
              life: '',
              attitude: '',
              support: ''
            }
          },
          {
            id: 2,
            name: 'Ⅱ期',
            range: '6か月～9か月',
            status: 'empty',
            data: {
              yougo: '',
              kyouiku: '',
              life: '',
              attitude: '',
              support: ''
            }
          }
        ]);
      } else if (isAge1to5) {
        setPeriodsAge1to5([
          {
            id: 1,
            name: 'Ⅰ期',
            range: '4月～6月',
            status: 'empty',
            data: {
              yougo: '',
              kyouiku: '',
              health: '',
              humanRelations: '',
              environment: '',
              language: '',
              expression: '',
              support: '',
              familyCooperation: ''
            }
          },
          {
            id: 2,
            name: 'Ⅱ期',
            range: '7月～9月',
            status: 'empty',
            data: {
              yougo: '',
              kyouiku: '',
              health: '',
              humanRelations: '',
              environment: '',
              language: '',
              expression: '',
              support: '',
              familyCooperation: ''
            }
          }
        ]);
      }
    }
  }, [headerData.age]);

  const togglePeriod = (index: number) => {
    setExpandedPeriods(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const getStatusColor = (status: 'empty' | 'partial' | 'completed') => {
    switch (status) {
      case 'completed': return 'success';
      case 'partial': return 'warning';
      case 'empty': return 'default';
    }
  };

  const getStatusIcon = (status: 'empty' | 'partial' | 'completed') => {
    switch (status) {
      case 'completed': return <CheckCircle fontSize="small" />;
      case 'partial': return <Edit fontSize="small" />;
      case 'empty': return <Schedule fontSize="small" />;
    }
  };

  const getStatusText = (status: 'empty' | 'partial' | 'completed') => {
    switch (status) {
      case 'completed': return '完了';
      case 'partial': return '編集中';
      case 'empty': return '未入力';
    }
  };

  const calculateStatusAge0 = (data: PeriodDataAge0): 'empty' | 'partial' | 'completed' => {
    const fields = Object.values(data);
    const filledFields = fields.filter(field => field.trim() !== '').length;
    
    if (filledFields === 0) return 'empty';
    if (filledFields === fields.length) return 'completed';
    return 'partial';
  };

  const calculateStatusAge1to5 = (data: PeriodDataAge1to5): 'empty' | 'partial' | 'completed' => {
    const fields = Object.values(data);
    const filledFields = fields.filter(field => field.trim() !== '').length;
    
    if (filledFields === 0) return 'empty';
    if (filledFields === fields.length) return 'completed';
    return 'partial';
  };

  const handleHeaderDataChange = (field: keyof HeaderData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setHeaderData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Handle data change for Age 0
  const handlePeriodDataChangeAge0 = (periodId: number, field: keyof PeriodDataAge0) => (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPeriodsAge0(prev => prev.map(period => {
      if (period.id === periodId) {
        const updatedData = { ...period.data, [field]: event.target.value };
        return {
          ...period,
          data: updatedData,
          status: calculateStatusAge0(updatedData)
        };
      }
      return period;
    }));
  };

  // Handle data change for Age 1-5
  const handlePeriodDataChangeAge1to5 = (periodId: number, field: keyof PeriodDataAge1to5) => (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPeriodsAge1to5(prev => prev.map(period => {
      if (period.id === periodId) {
        const updatedData = { ...period.data, [field]: event.target.value };
        return {
          ...period,
          data: updatedData,
          status: calculateStatusAge1to5(updatedData)
        };
      }
      return period;
    }));
  };

  const handlePeriodRangeChange = (periodId: number) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isAge0) {
      setPeriodsAge0(prev => prev.map(period => 
        period.id === periodId
          ? { ...period, range: event.target.value }
          : period
      ));
    } else if (isAge1to5) {
      setPeriodsAge1to5(prev => prev.map(period => 
        period.id === periodId
          ? { ...period, range: event.target.value }
          : period
      ));
    }
  };

  const addPeriod = () => {
    const currentPeriods = getCurrentPeriods();
    
    if (currentPeriods.length >= 10) {
      alert('⚠️ 最大10期までです。\nสูงสุด 10 ช่วงเวลา');
      return;
    }

    if (isAge0) {
      const newPeriod: PeriodAge0 = {
        id: nextPeriodId,
        name: `${romanNumerals[periodsAge0.length] || 'Ⅺ'}期`,
        range: `${periodsAge0.length * 3 + 3}か月～${periodsAge0.length * 3 + 6}か月`,
        status: 'empty',
        data: {
          yougo: '',
          kyouiku: '',
          life: '',
          attitude: '',
          support: ''
        }
      };
      setPeriodsAge0(prev => [...prev, newPeriod]);
    } else if (isAge1to5) {
      const newPeriod: PeriodAge1to5 = {
        id: nextPeriodId,
        name: `${romanNumerals[periodsAge1to5.length] || 'Ⅺ'}期`,
        range: `${periodsAge1to5.length * 3 + 1}月～${periodsAge1to5.length * 3 + 3}月`,
        status: 'empty',
        data: {
          yougo: '',
          kyouiku: '',
          health: '',
          humanRelations: '',
          environment: '',
          language: '',
          expression: '',
          support: '',
          familyCooperation: ''
        }
      };
      setPeriodsAge1to5(prev => [...prev, newPeriod]);
    }
    
    setNextPeriodId(prev => prev + 1);
  };

  const deletePeriod = (periodId: number) => {
    const currentPeriods = getCurrentPeriods();
    
    if (currentPeriods.length <= 1) {
      alert('⚠️ 最低でも1つの期が必要です。\nต้องมีอย่างน้อย 1 ช่วงเวลา');
      return;
    }

    if (window.confirm('この期を削除してもよろしいですか？\nคุณต้องการลบช่วงเวลานี้หรือไม่?')) {
      if (isAge0) {
        setPeriodsAge0(prev => prev.filter(period => period.id !== periodId));
      } else if (isAge1to5) {
        setPeriodsAge1to5(prev => prev.filter(period => period.id !== periodId));
      }
    }
  };

  const saveData = () => {
    console.log('Saving data...', {
      headerData,
      periods: isAge0 ? periodsAge0 : periodsAge1to5
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Render Period Content for Age 0
  const renderPeriodContentAge0 = (period: PeriodAge0) => (
    <Stack spacing={3}>
      {/* Period Range Edit */}
      <TextField
        fullWidth
        size="small"
        label="期間 | ช่วงเวลา"
        value={period.range}
        onChange={handlePeriodRangeChange(period.id)}
      />

      <Divider />

      {/* ねらい Section */}
      <Paper sx={{ p: 3, border: '2px solid #4CAF50', borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <EmojiObjects sx={{ color: '#4CAF50' }} />
          <Typography variant="h6" fontWeight="bold" color="#4CAF50">
            🎯 ねらい | เป้าหมาย
          </Typography>
        </Box>
        <Stack spacing={2}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="養護 | การดูแล"
            value={period.data.yougo}
            onChange={handlePeriodDataChangeAge0(period.id, 'yougo')}
            placeholder="養護のねらいを入力..."
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="教育 | การศึกษา"
            value={period.data.kyouiku}
            onChange={handlePeriodDataChangeAge0(period.id, 'kyouiku')}
            placeholder="教育のねらいを入力..."
          />
        </Stack>
      </Paper>

      {/* 配慮 Section */}
      <Paper sx={{ p: 3, border: '2px solid #2754b0', borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <School sx={{ color: '#2754b0' }} />
          <Typography variant="h6" fontWeight="bold" color="#2754b0">
            📝 配慮 | การพิจารณา
          </Typography>
        </Box>
        <Stack spacing={2}>
          <TextField
            fullWidth
            multiline
            rows={5}
            label="養護 | การดูแล"
            value={period.data.life}
            onChange={handlePeriodDataChangeAge0(period.id, 'life')}
            placeholder="養護..."
          />
          <TextField
            fullWidth
            multiline
            rows={5}
            label="教育 | การศึกษา"
            value={period.data.attitude}
            onChange={handlePeriodDataChangeAge0(period.id, 'attitude')}
            placeholder="教育..."
          />
        </Stack>
      </Paper>

      {/* 内容 Section */}
      <Paper sx={{ p: 3, border: '2px solid #9C27B0', borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <School sx={{ color: '#9C27B0' }} />
          <Typography variant="h6" fontWeight="bold" color="#9C27B0">
            📝 内容 | เนื้อหา
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <HealthAndSafety sx={{ color: '#9C27B0' }} />
          <Typography  color="#9C27B0">
            養護 | การพยายบาล
          </Typography>
        </Box>
        <Stack spacing={2}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="生命の保持　情緒の安定| การรักษาชีวิตและความมั่นคงทางอารมณ์"
            value={period.data.life}
            onChange={handlePeriodDataChangeAge0(period.id, 'life')}
            placeholder="生命の保持　情緒の安定..."
          />
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 , mb: 2 }}>
          <School sx={{ color: '#9C27B0' }} />
          <Typography  color="#9C27B0">
            教育 | การศึกษา
          </Typography>
        </Box>
        <Stack spacing={2}>
          <TextField
            fullWidth
            multiline
            rows={12}
            label="身体的発達に関する視点　社会的発達に関する視点　精神的発達に関する視点 | การพัฒนาด้านร่างกาย ด้านสังคม ด้านจิตใจ"
            value={period.data.life}
            onChange={handlePeriodDataChangeAge0(period.id, 'life')}
            placeholder="身体的発達に関する視点　社会的発達に関する視点　精神的発達に関する視点"
          />
        </Stack>
      </Paper>

      {/* Delete Button */}
      {periodsAge0.length > 1 && (
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => deletePeriod(period.id)}
        >
          この期を削除 | ลบช่วงเวลานี้
        </Button>
      )}
    </Stack>
  );

  // Render Period Content for Age 1-5
  const renderPeriodContentAge1to5 = (period: PeriodAge1to5) => (
    <Stack spacing={3}>
      {/* Period Range Edit */}
      <TextField
        fullWidth
        size="small"
        label="期間 | ช่วงเวลา"
        value={period.range}
        onChange={handlePeriodRangeChange(period.id)}
      />

      <Divider />

      {/* ねらい Section */}
      <Paper sx={{ p: 3, border: '2px solid #4CAF50', borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <EmojiObjects sx={{ color: '#4CAF50' }} />
          <Typography variant="h6" fontWeight="bold" color="#4CAF50">
            🎯 ねらい | เป้าหมาย
          </Typography>
        </Box>
        <Stack spacing={2}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="養護 | การดูแล"
            value={period.data.yougo}
            onChange={handlePeriodDataChangeAge1to5(period.id, 'yougo')}
            placeholder="養護のねらいを入力..."
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="教育 | การศึกษา"
            value={period.data.kyouiku}
            onChange={handlePeriodDataChangeAge1to5(period.id, 'kyouiku')}
            placeholder="教育のねらいを入力..."
          />
        </Stack>
      </Paper>

      {/* 5領域 Section */}
      <Paper sx={{ p: 3, border: '2px solid #2196F3', borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <School sx={{ color: '#2196F3' }} />
          <Typography variant="h6" fontWeight="bold" color="#2196F3">
            📚 5領域 | 5 ด้านการพัฒนา
          </Typography>
        </Box>
        <Stack spacing={2}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <HealthAndSafety sx={{ color: '#03A9F4', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight="bold">
                健康 | สุขภาพ
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={period.data.health}
              onChange={handlePeriodDataChangeAge1to5(period.id, 'health')}
              placeholder="健康を入力..."
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Groups sx={{ color: '#03A9F4', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight="bold">
                人間関係 | มนุษยสัมพันธ์
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={period.data.humanRelations}
              onChange={handlePeriodDataChangeAge1to5(period.id, 'humanRelations')}
              placeholder="人間関係を入力..."
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Nature sx={{ color: '#03A9F4', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight="bold">
                環境 | สิ่งแวดล้อม
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={period.data.environment}
              onChange={handlePeriodDataChangeAge1to5(period.id, 'environment')}
              placeholder="環境を入力..."
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chat sx={{ color: '#03A9F4', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight="bold">
                言葉 | ภาษา
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={period.data.language}
              onChange={handlePeriodDataChangeAge1to5(period.id, 'language')}
              placeholder="言葉を入力..."
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Palette sx={{ color: '#03A9F4', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight="bold">
                表現 | การแสดงออก
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={period.data.expression}
              onChange={handlePeriodDataChangeAge1to5(period.id, 'expression')}
              placeholder="表現を入力..."
            />
          </Box>
        </Stack>
      </Paper>

      {/* 環境構成と援助 Section */}
      <Paper sx={{ p: 3, border: '2px solid #FF9800', borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FamilyRestroom sx={{ color: '#FF9800' }} />
          <Typography variant="h6" fontWeight="bold" color="#FF9800">
            🏡 環境構成と援助 | สภาพแวดล้อมและการช่วยเหลือ
          </Typography>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={period.data.support}
          onChange={handlePeriodDataChangeAge1to5(period.id, 'support')}
          placeholder="環境構成と援助を入力..."
        />
      </Paper>

      {/* 家庭との連携 Section */}
      <Paper sx={{ p: 3, border: '2px solid #E91E63', borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Favorite sx={{ color: '#E91E63' }} />
          <Typography variant="h6" fontWeight="bold" color="#E91E63">
            👨‍👩‍👧 家庭との連携 | ความร่วมมือกับครอบครัว
          </Typography>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={period.data.familyCooperation}
          onChange={handlePeriodDataChangeAge1to5(period.id, 'familyCooperation')}
          placeholder="家庭との連携を入力..."
        />
      </Paper>

      {/* Delete Button */}
      {periodsAge1to5.length > 1 && (
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => deletePeriod(period.id)}
        >
          この期を削除 | ลบช่วงเวลานี้
        </Button>
      )}
    </Stack>
  );

  const currentPeriods = getCurrentPeriods();

  return (
    <ThemeProvider theme={theme}>
      <ContentMain>
        {/* Success Notification */}
        <Zoom in={showSuccess}>
          <Box sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <CheckCircle sx={{ fontSize: 28 }} />
            <Typography variant="body1" fontWeight="bold">
              บันทึกสำเร็จ! | 保存しました
            </Typography>
          </Box>
        </Zoom>

        {/* Top Bar */}
        <Fade in={true}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
              }}>
                <School sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    年間指導計画
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    แผนการสอนประจำปี | Annual Teaching Plan
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday color="primary" />
                  <Typography fontWeight="600">年度:</Typography>
                  <TextField
                    size="small"
                    value={headerData.year}
                    onChange={handleHeaderDataChange('year')}
                    sx={{ 
                      width: 100,
                      '& input': { textAlign: 'center', fontWeight: 'bold' }
                    }}
                    inputProps={{ maxLength: 4 }}
                  />
                  <Typography fontWeight="600">年度</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                  <AccessTime fontSize="small" />
                  <Typography variant="body2">
                    最終保存: 数秒前
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Main Card */}
        <Fade in={true}>
          <Card>
            <CardContent>
              {/* Basic Information */}
              <Paper sx={{ p: 3, mb: 3, background: '#f8f9fa' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Public color="primary" sx={{ fontSize: 28 }} />
                  <Typography variant="h6" fontWeight="700">
                    基本情報 | ข้อมูลพื้นฐาน
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      select
                      label="🏫 教室 | ห้องเรียน"
                      value={headerData.classroom}
                      onChange={handleHeaderDataChange('classroom')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business />
                          </InputAdornment>
                        )
                      }}
                    >
                      {classroomOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      select
                      label="👶 年齢 | อายุ"
                      value={headerData.age}
                      onChange={handleHeaderDataChange('age')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        )
                      }}
                    >
                      {ageOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      select
                      label="👨‍🏫 担当者 | ผู้รับผิดชอบ"
                      value={headerData.responsiblePerson}
                      onChange={handleHeaderDataChange('responsiblePerson')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        )
                      }}
                    >
                      {responsiblePersonOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Paper>

              {/* Annual Goal Section */}
              <Fade in={true}>
                <Paper
                  elevation={0}
                  sx={{
                    background: 'linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%)',
                    p: 3,
                    mb: 4,
                    border: '2px solid #ffe082',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <EmojiObjects sx={{ color: '#F57C00', fontSize: 32 }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#f57c00',
                        fontWeight: 'bold'
                      }}
                    >
                      🎯 年間目標 | เป้าหมายประจำปี
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={headerData.annualGoal}
                    onChange={handleHeaderDataChange('annualGoal')}
                    placeholder="年間目標を入力してください..."
                    sx={{
                      '& .MuiInputBase-root': {
                        background: 'white',
                        fontSize: '14px'
                      }
                    }}
                  />
                </Paper>
              </Fade>

              {/* Form Type Info */}
              {headerData.age && (
                <Zoom in={true}>
                  <Alert 
                    severity={isAge0 ? "info" : "success"} 
                    sx={{ 
                      mb: 3,
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: 600
                    }}
                  >
                    {isAge0 && '📋 0歳児用フォーム（5項目）| ฟอร์มสำหรับอายุ 0 ปี (5 ฟิลด์)'}
                    {isAge1to5 && '📋 1-5歳児用フォーム（9項目 + 5領域）| ฟอร์มสำหรับอายุ 1-5 ปี (9 ฟิลด์ + 5 ด้าน)'}
                  </Alert>
                </Zoom>
              )}

              {/* Action Button */}
              {headerData.age && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  mb: 3
                }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={addPeriod}
                    disabled={currentPeriods.length >= 10}
                    sx={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #5a3780 100%)',
                      }
                    }}
                  >
                    期を追加 | เพิ่มช่วงเวลา ({currentPeriods.length}/10)
                  </Button>
                </Box>
              )}

              {/* Periods - Accordion Style */}
              {headerData.age && (
                <Box>
                  {isAge0 && periodsAge0.map((period, index) => (
                    <Accordion 
                      key={period.id}
                      expanded={expandedPeriods.includes(index)}
                      onChange={() => togglePeriod(index)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #bbdefb 0%, #e1bee7 100%)',
                          }
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2,
                          width: '100%',
                          pr: 2
                        }}>
                          <Box sx={{
                            width: 48,
                            height: 48,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '16px'
                          }}>
                            {period.name}
                          </Box>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight="bold" color="text.primary">
                              {period.range}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ช่วงเวลา (0歳児)
                            </Typography>
                          </Box>

                          <Chip
                            icon={getStatusIcon(period.status)}
                            label={getStatusText(period.status)}
                            size="small"
                            color={getStatusColor(period.status)}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails sx={{ p: 3, background: '#fafafa' }}>
                        {renderPeriodContentAge0(period)}
                      </AccordionDetails>
                    </Accordion>
                  ))}

                  {isAge1to5 && periodsAge1to5.map((period, index) => (
                    <Accordion 
                      key={period.id}
                      expanded={expandedPeriods.includes(index)}
                      onChange={() => togglePeriod(index)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          background: 'linear-gradient(135deg, #e8f5e9 0%, #f3e5f5 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #c8e6c9 0%, #e1bee7 100%)',
                          }
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2,
                          width: '100%',
                          pr: 2
                        }}>
                          <Box sx={{
                            width: 48,
                            height: 48,
                            background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '16px'
                          }}>
                            {period.name}
                          </Box>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight="bold" color="text.primary">
                              {period.range}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ช่วงเวลา (1-5歳児)
                            </Typography>
                          </Box>

                          <Chip
                            icon={getStatusIcon(period.status)}
                            label={getStatusText(period.status)}
                            size="small"
                            color={getStatusColor(period.status)}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails sx={{ p: 3, background: '#fafafa' }}>
                        {renderPeriodContentAge1to5(period)}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Fade>
        
        {/* Action Buttons */}
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            mt: 4,
            pt: 3,
            borderTop: '2px solid #e0e0e0'
          }}
        >
          <Button 
            variant="outlined"
            startIcon={<ArrowBack />}
            size="large"
          >
            กลับ | 戻る
          </Button>

          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={saveData}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #5a3780 100%)',
              }
            }}
          >
            💾 บันทึก | 保存
          </Button>
        </Box>ThemeProvider
      </ContentMain>
    </ThemeProvider>
  );
};

export default AnnualplanAdd;

