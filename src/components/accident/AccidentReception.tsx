import React, { useState, useEffect } from 'react';
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
  Stack,
  Paper,
  Checkbox,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Print as PrintIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ContentMain from "../content/Content";
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
  },
});

interface InjuredPerson {
  name: string;
  age: string;
  gender: string;
  address: string;
}

interface TreatmentDetails {
  description: string;
  hospitalizationDays: string;
  outpatientDays: string;
  medicalFacility: string;
}

interface ClaimRecipient {
  type: string; // '1' = 加入施設, '2' = お怪我をされた方, '3' = その他
  address: string;
  name: string;
}

interface FacilityInfo {
  name: string;
  address: string;
  branch: string;
  representative: string;
  phone: string;
  fax: string;
}

interface AccidentReception {
  incidentReportId?: string; // Link to incident report
  contactInfo: string;
  businessType: string;
  accidentType: string;
  sportsCenterEnrollment: string;
  accidentDate: string;
  accidentTime: string;
  accidentLocation: string;
  injuredPerson: InjuredPerson;
  memberCode: string;
  insuranceContractor: string;
  accidentSituation: string;
  injuryDetails: TreatmentDetails;
  otherInfo: string;
  claimRecipient: ClaimRecipient;
  facilityInfo: FacilityInfo;
}

const AccidentReceptionForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Try to get data from multiple sources
  const getIncidentData = () => {
    // 1. Try from location state (React Router)
    if (location.state?.incidentData) {
      return location.state.incidentData;
    }
    
    // 2. Try from URL parameter
    const params = new URLSearchParams(location.search);
    const reportId = params.get('reportId');
    if (reportId) {
      const savedData = localStorage.getItem('incidentReport');
      if (savedData) {
        return JSON.parse(savedData);
      }
    }
    
    // 3. Try from last saved report
    const lastReportId = localStorage.getItem('lastIncidentReportId');
    if (lastReportId) {
      const savedData = localStorage.getItem('incidentReport');
      if (savedData) {
        return JSON.parse(savedData);
      }
    }
    
    return null;
  };

  const incidentData = getIncidentData();

  const [formData, setFormData] = useState<AccidentReception>({
    incidentReportId: incidentData?.id || '',
    contactInfo: '事故通知先/保険:事故受付FAX  03-3515-7511',
    businessType: '1',
    accidentType: '1',
    sportsCenterEnrollment: '',
    accidentDate: incidentData?.incidentDate || '',
    accidentTime: incidentData?.incidentTime || '',
    accidentLocation: incidentData?.location || '',
    injuredPerson: {
      name: incidentData?.organizationName || '',
      age: incidentData?.childAge ? `${incidentData.childAge.years}歳${incidentData.childAge.months}ヶ月` : '',
      gender: '',
      address: '',
    },
    memberCode: '',
    insuranceContractor: '公益社団法人全国私立保育園連盟',
    accidentSituation: incidentData?.situation || '',
    injuryDetails: {
      description: incidentData?.situation || '',
      hospitalizationDays: '',
      outpatientDays: '',
      medicalFacility: incidentData?.hospitalName || '',
    },
    otherInfo: '',
    claimRecipient: {
      type: '1',
      address: '',
      name: '',
    },
    facilityInfo: {
      name: 'いちごさみんなの家',
      address: '福岡県福岡市南区市崎1-15-11',
      branch: '',
      representative: 'AIGベートナース アクトフォー 渡辺様',
      phone: '092-406-8215',
      fax: '092-406-8216',
    },
  });

  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const keys = field.split('.');
      setFormData(prev => {
        const updated = { ...prev };
        let current: any = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    console.log('Saving accident reception form:', formData);
    
    // Save reception form
    if (formData.incidentReportId) {
      localStorage.setItem(
        `accidentReception_${formData.incidentReportId}`, 
        JSON.stringify(formData)
      );
      
      // Update incident report status
      const reportsStr = localStorage.getItem('incidentReports');
      if (reportsStr) {
        const reports = JSON.parse(reportsStr);
        const updatedReports = reports.map((r: any) => 
          r.id === formData.incidentReportId 
            ? { ...r, hasReceptionForm: true, updatedAt: new Date().toISOString() }
            : r
        );
        localStorage.setItem('incidentReports', JSON.stringify(updatedReports));
      }
    }
    
    alert('✅ 事故受付票が保存されました');
  };

  const handleSubmit = () => {
    // Save first
    handleSave();
    
    console.log('Submitting to insurance:', formData);
    
    // Navigate back to list
    setTimeout(() => {
      navigate('/incident-report-list');
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
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
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ mb: 2 }}
            >
              事故報告書に戻る
            </Button>
            
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1, textAlign: 'center' }}>
              事故受付票
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center' }}>
              Accident Reception Form
            </Typography>
            
            {incidentData && (
              <Alert severity="info" sx={{ mt: 2 }}>
                事故報告書からのデータが自動的に入力されました
              </Alert>
            )}
          </Box>

          {/* Contact Info Header */}
          <Card sx={{ mb: 3, boxShadow: 2, bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formData.contactInfo}
              </Typography>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card sx={{ mb: 3, boxShadow: 2, bgcolor: '#fff3e0' }}>
            <CardContent>
              <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                <strong>個人情報の利用目的</strong><br />
                事故受付票記載の個人情報につきましては、保険の受付の判断、保険事故への対応(関係先への照会等の事実
                関係の調査、保険金等の支払等)及び国土交通省への情報提供(グループ内での認証を含みます)、保険金の
                お支払いおよび各種商品・サービスの提供・ご案内を行うために利用させていただきます。また、安全啓発・制
                度普及を目的に、全私保連、関への情報提供を行うために利用させていただきます。
              </Typography>
            </CardContent>
          </Card>

          {/* Main Form Fields */}
          <Card sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent>
              <Grid container spacing={3}>
                {/* Insurer Name */}
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="東京海上日動火災保険株式会社 御中"
                    value="20"
                    InputProps={{ readOnly: true }}
                    helperText="年　月　日"
                  />
                </Grid>

                {/* 1. Business Type */}
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                      1. 事業内容
                    </FormLabel>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      (どの業務中の事故かチェックをおつけください)
                    </Typography>
                    <RadioGroup
                      value={formData.businessType}
                      onChange={(e) => handleChange('businessType', e.target.value)}
                    >
                      <FormControlLabel value="1" control={<Radio />} label="□ 1 通常保育" />
                      <FormControlLabel value="2" control={<Radio />} label="□ 2 一時預かり・休日保育" />
                      <FormControlLabel value="3" control={<Radio />} label="□ 3 一号認定こどもに関する事業" />
                      <FormControlLabel value="4" control={<Radio />} label="□ 4 その他（　　　　　　　　）" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* 2. Accident Type */}
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                      2. 事故内容
                    </FormLabel>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      (チェックをおつけください) ※複数該当可
                    </Typography>
                    <RadioGroup
                      value={formData.accidentType}
                      onChange={(e) => handleChange('accidentType', e.target.value)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FormControlLabel 
                          value="1" 
                          control={<Radio />} 
                          label="□ 1 賠償事故（スポーツ振興センターの加入" 
                        />
                        <FormControl>
                          <RadioGroup
                            row
                            value={formData.sportsCenterEnrollment}
                            onChange={(e) => handleChange('sportsCenterEnrollment', e.target.value)}
                          >
                            <FormControlLabel value="有" control={<Radio />} label="□ 有" />
                            <FormControlLabel value="無" control={<Radio />} label="□ 無" />
                          </RadioGroup>
                        </FormControl>
                        <Typography>）</Typography>
                      </Box>
                      <FormControlLabel value="2" control={<Radio />} label="□ 2 傷害事故" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* 3. Accident Date */}
                <Grid item xs={12}>
                  <FormLabel sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                    3. 事故発生日
                  </FormLabel>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="発生日"
                        type="date"
                        value={formData.accidentDate}
                        onChange={(e) => handleChange('accidentDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="時頃"
                        value={formData.accidentTime}
                        onChange={(e) => handleChange('accidentTime', e.target.value)}
                        placeholder="例: 10:30"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* 4. Accident Location */}
                <Grid item xs={12}>
                  <FormLabel sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                    4. 事故発生場所
                  </FormLabel>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.accidentLocation}
                    onChange={(e) => handleChange('accidentLocation', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* 5. Injured Person */}
                <Grid item xs={12}>
                  <FormLabel sx={{ fontWeight: 600, mb: 2, display: 'block' }}>
                    5. お怪我をされた方<br />
                    <Typography variant="caption" color="text.secondary">
                      (新宿事故で対物事故の場合は被害者)
                    </Typography>
                  </FormLabel>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="氏名 (ふりがな)"
                        value={formData.injuredPerson.name}
                        onChange={(e) => handleChange('injuredPerson.name', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="年令"
                        value={formData.injuredPerson.age}
                        onChange={(e) => handleChange('injuredPerson.age', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="性別"
                        value={formData.injuredPerson.gender}
                        onChange={(e) => handleChange('injuredPerson.gender', e.target.value)}
                        placeholder="例: 男性"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="住所"
                        value={formData.injuredPerson.address}
                        onChange={(e) => handleChange('injuredPerson.address', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* 6. Member Code */}
                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                    6. 会員園コード
                  </FormLabel>
                  <TextField
                    fullWidth
                    value={formData.memberCode}
                    onChange={(e) => handleChange('memberCode', e.target.value)}
                    placeholder="40B - 134288"
                  />
                </Grid>

                {/* 7. Insurance Contractor */}
                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                    7. 保険契約者名
                  </FormLabel>
                  <TextField
                    fullWidth
                    value={formData.insuranceContractor}
                    onChange={(e) => handleChange('insuranceContractor', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* 8. Accident Situation */}
                <Grid item xs={12}>
                  <FormLabel sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                    8. 事故状況
                  </FormLabel>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={formData.accidentSituation}
                    onChange={(e) => handleChange('accidentSituation', e.target.value)}
                    placeholder="事故の詳細な状況を記入してください"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* 9. Injury Details */}
                <Grid item xs={12}>
                  <FormLabel sx={{ fontWeight: 600, mb: 2, display: 'block' }}>
                    9. ケガの内容<br />
                    <Typography variant="caption" color="text.secondary">
                      (わかる範囲でご記入ください)
                    </Typography>
                  </FormLabel>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="ケガの詳細"
                        value={formData.injuryDetails.description}
                        onChange={(e) => handleChange('injuryDetails.description', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="治療期間 (入院)"
                        value={formData.injuryDetails.hospitalizationDays}
                        onChange={(e) => handleChange('injuryDetails.hospitalizationDays', e.target.value)}
                        InputProps={{
                          endAdornment: <Typography>日間</Typography>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="治療期間 (通院)"
                        value={formData.injuryDetails.outpatientDays}
                        onChange={(e) => handleChange('injuryDetails.outpatientDays', e.target.value)}
                        InputProps={{
                          endAdornment: <Typography>日間</Typography>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="医療機関名"
                        value={formData.injuryDetails.medicalFacility}
                        onChange={(e) => handleChange('injuryDetails.medicalFacility', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* 10. Other Information */}
                <Grid item xs={12}>
                  <FormLabel sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                    10. その他
                  </FormLabel>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    (賠償事故で対物事故の場合は損害の程度)
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.otherInfo}
                    onChange={(e) => handleChange('otherInfo', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* 11. Claim Recipient */}
                <Grid item xs={12}>
                  <FormLabel sx={{ fontWeight: 600, mb: 2, display: 'block' }}>
                    11. 保険金請求送付先<br />
                    <Typography variant="caption" color="text.secondary">
                      (チェックをおつけください)
                    </Typography>
                  </FormLabel>
                  <RadioGroup
                    value={formData.claimRecipient.type}
                    onChange={(e) => handleChange('claimRecipient.type', e.target.value)}
                  >
                    <FormControlLabel value="1" control={<Radio />} label="① 加入施設" />
                    <FormControlLabel value="2" control={<Radio />} label="② お怪我をされた方" />
                    <FormControlLabel value="3" control={<Radio />} label="③ その他" />
                  </RadioGroup>

                  {formData.claimRecipient.type === '3' && (
                    <Box sx={{ mt: 2, pl: 4 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        ③その他の場合の送付先
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="住所"
                            value={formData.claimRecipient.address}
                            onChange={(e) => handleChange('claimRecipient.address', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="氏名"
                            value={formData.claimRecipient.name}
                            onChange={(e) => handleChange('claimRecipient.name', e.target.value)}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Facility Information */}
          <Card sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
                上記事故の発生したことを証明致します。
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="園名"
                    value={formData.facilityInfo.name}
                    onChange={(e) => handleChange('facilityInfo.name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="担当者名"
                    value={formData.facilityInfo.representative}
                    onChange={(e) => handleChange('facilityInfo.representative', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="住所"
                    value={formData.facilityInfo.address}
                    onChange={(e) => handleChange('facilityInfo.address', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="電話番号"
                    value={formData.facilityInfo.phone}
                    onChange={(e) => handleChange('facilityInfo.phone', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="FAX番号"
                    value={formData.facilityInfo.fax}
                    onChange={(e) => handleChange('facilityInfo.fax', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="営業店"
                    value={formData.facilityInfo.branch}
                    onChange={(e) => handleChange('facilityInfo.branch', e.target.value)}
                    placeholder="代理店名"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Notice */}
          <Alert severity="warning" sx={{ mb: 3 }}>
            ※事故受付票をご提出いただく際は、あわせて加入通知書のコピーをご提出ください。
          </Alert>

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
              onClick={handleSubmit}
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

export default AccidentReceptionForm;