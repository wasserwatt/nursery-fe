import { Button, Card, Checkbox, FormControl, Box, FormControlLabel, Grid, MenuItem, Select, TextField, Typography, FormGroup } from "@mui/material";
import ContentMain from "../../content/Content";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import HealthCheckForm from "./HealthCheckForm";
import Loading from '../../Loading';
import { useEffect, useState } from 'react';
import Numpad from "../../content/Numpad";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface FamilyMember {
  id: number;
}

export default function StudentHistory() {

  const [loading, setLoading] = useState(true);
  const [numpadOpen, setNumpadOpen] = useState(false);
  const [currentInputId, setCurrentInputId] = useState('');
  const [familyMemberCounter, setFamilyMemberCounter] = useState(1);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([{ id: 1 }]);
  const [birthCondition, setBirthCondition] = useState('normal'); // 'normal' or 'abnormal'
  const [birthDetails, setBirthDetails] = useState<string[]>([]);
  const [birthOther, setBirthOther] = useState('');

  const handleInputClick = (id: string) => {
    setCurrentInputId(id);
    setNumpadOpen(true);
  };

  const handleNumpadInput = (value: string) => {
    const input = document.getElementById(currentInputId) as HTMLInputElement;
    if (input) {
      input.value = value;
    }
    setNumpadOpen(false);
  };

  const addFamilyMember = () => {
    const newId = familyMemberCounter + 1;
    setFamilyMemberCounter(newId);
    setFamilyMembers([...familyMembers, { id: newId }]);
  };

  const removeFamilyMember = (id: number) => {
    if (familyMembers.length <= 1) {
      alert('最低1人の家族メンバーが必要です');
      return;
    }
    if (window.confirm('この家族メンバーを削除してもよろしいですか？')) {
      setFamilyMembers(familyMembers.filter(member => member.id !== id));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const TOTAL_UNITS = 42; 
  const calculatePosition = (month: number): number => {
    if (month <= 24) {
      return (month / TOTAL_UNITS) * 100;
    } else {
      return (
        (24 / TOTAL_UNITS) * 100 +
        ((month - 24) * 0.3 / TOTAL_UNITS) * 100
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <ContentMain className="flex flex-col min-h-screen">
        
        {/* Header with 秘 circle and title */}
        <Grid container spacing={2} className='pt-7 pl-3'>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #000', pb: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  border: '3px solid #000', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  fontWeight: 'bold'
                }}>
                  秘
                </Box>
                <Box>
                  <Typography variant="h4" component='div' fontWeight={700}>
                    児童票
                  </Typography>
                  <Typography variant="caption" component='div'>
                    (様式1-1)
                  </Typography>
                </Box>
              </Box>
              <TextField
                label="施設長"
                size='small'
                sx={{ backgroundColor: "white", width: 200 }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Health Management Table Header - 健康管理台帳 */}
        <Grid container spacing={2} className='pt-3 pl-3'>
          <Grid item xs={12}>
            <Box sx={{ border: '2px solid #000', p: 1, mb: 2, backgroundColor: '#f5f5f5' }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Typography fontWeight={600}>健康管理台帳(　者　)</Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography fontWeight={600}>健康個人入力</Typography>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography>年度:</Typography>
                    <TextField label="0歳児" size='small' sx={{ width: 80, backgroundColor: "white" }} />
                    <TextField label="1歳児" size='small' sx={{ width: 80, backgroundColor: "white" }} />
                    <TextField label="2歳児" size='small' sx={{ width: 80, backgroundColor: "white" }} />
                    <TextField label="3歳児" size='small' sx={{ width: 80, backgroundColor: "white" }} />
                    <TextField label="4歳児" size='small' sx={{ width: 80, backgroundColor: "white" }} />
                    <TextField label="5歳児" size='small' sx={{ width: 80, backgroundColor: "white" }} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* Basic Information Table */}
        <Grid container spacing={2} className='pt-3 pl-3'>
          <Grid item xs={12}>
            <Box sx={{ border: '2px solid #000' }}>
              {/* Furigana and Name Row */}
              <Grid container sx={{ borderBottom: '1px solid #000' }}>
                <Grid item xs={12} sm={2} sx={{ borderRight: '1px solid #000', backgroundColor: '#f5f5f5', p: 1 }}>
                  <Typography align="center">ふりがな</Typography>
                  <Typography align="center" sx={{ mt: 2 }}>氏名</Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ borderRight: '1px solid #000' }}>
                  <Box sx={{ p: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="やまだ　たろう"
                      size='small'
                      sx={{ backgroundColor: "white", mb: 1 }}
                    />
                    <TextField
                      fullWidth
                      placeholder="山田　太郎"
                      size='small'
                      sx={{ backgroundColor: "white" }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={1} sx={{ borderRight: '1px solid #000', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography>男・女</Typography>
                </Grid>
                <Grid item xs={12} sm={2} sx={{ borderRight: '1px solid #000', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography>生年月日</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FormControl size="small" sx={{ minWidth: 70 }}>
                      <Select defaultValue="平成" sx={{ backgroundColor: "white" }}>
                        <MenuItem value="平成">平成</MenuItem>
                        <MenuItem value="令和">令和</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField size='small' placeholder="年" sx={{ width: 50, backgroundColor: "white" }} />
                    <Typography>年</Typography>
                    <TextField size='small' placeholder="月" sx={{ width: 50, backgroundColor: "white" }} />
                    <Typography>月</Typography>
                    <TextField size='small' placeholder="日" sx={{ width: 50, backgroundColor: "white" }} />
                    <Typography>日</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Gender Radio and Admission/Withdrawal Dates */}
              <Grid container sx={{ borderBottom: '1px solid #000' }}>
                <Grid item xs={12} sm={6} sx={{ borderRight: '1px solid #000', p: 1 }}>
                  <RadioGroup row sx={{ justifyContent: 'center' }}>
                    <FormControlLabel value="male" control={<Radio />} label="" />
                  </RadioGroup>
                </Grid>
                <Grid item xs={12} sm={1} sx={{ borderRight: '1px solid #000', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography>入所</Typography>
                </Grid>
                <Grid item xs={12} sm={2} sx={{ borderRight: '1px solid #000' }}>
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                    <Typography fontSize="0.9rem">令和</Typography>
                    <TextField size='small' placeholder="年" sx={{ width: 40, backgroundColor: "white" }} />
                    <Typography fontSize="0.9rem">年</Typography>
                    <TextField size='small' placeholder="月" sx={{ width: 40, backgroundColor: "white" }} />
                    <Typography fontSize="0.9rem">月</Typography>
                    <TextField size='small' placeholder="日" sx={{ width: 40, backgroundColor: "white" }} />
                    <Typography fontSize="0.9rem">日</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={1} sx={{ borderRight: '1px solid #000', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography>退所</Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                    <Typography fontSize="0.9rem">令和</Typography>
                    <TextField size='small' placeholder="年" sx={{ width: 40, backgroundColor: "white" }} />
                    <Typography fontSize="0.9rem">年</Typography>
                    <TextField size='small' placeholder="月" sx={{ width: 40, backgroundColor: "white" }} />
                    <Typography fontSize="0.9rem">月</Typography>
                    <TextField size='small' placeholder="日" sx={{ width: 40, backgroundColor: "white" }} />
                    <Typography fontSize="0.9rem">日</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Address Section - 現住所 (3 rows) */}
              {[1, 2, 3].map((row) => (
                <Grid container key={row} sx={{ borderBottom: row === 3 ? 'none' : '1px solid #000' }}>
                  {row === 1 && (
                    <Grid item xs={12} sm={1} sx={{ borderRight: '1px solid #000', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', gridRow: 'span 3' }}>
                      <Typography sx={{ writingMode: 'vertical-rl' }}>現住所</Typography>
                    </Grid>
                  )}
                  {row > 1 && (
                    <Grid item xs={12} sm={1} sx={{ borderRight: '1px solid #000' }}></Grid>
                  )}
                  <Grid item xs={12} sm={6} sx={{ borderRight: '1px solid #000' }}>
                    <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>〒</Typography>
                      {row === 1 ? (
                        <>
                          <TextField size='small' placeholder="000-0000" sx={{ width: 120, backgroundColor: "white" }} />
                          <Typography>福岡市</Typography>
                          <TextField size='small' placeholder="区" sx={{ width: 100, backgroundColor: "white" }} />
                          <Typography>区</Typography>
                        </>
                      ) : (
                        <>
                          <Typography sx={{ ml: 4 }}>福岡市</Typography>
                          <TextField size='small' placeholder="区" sx={{ width: 100, backgroundColor: "white" }} />
                          <Typography>区</Typography>
                        </>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ borderRight: '1px solid #000' }}>
                    <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>TEL</Typography>
                      <TextField
                        size='small'
                        placeholder="000-0000-0000"
                        sx={{ flex: 1, backgroundColor: "white" }}
                        onClick={() => handleInputClick(`address-tel-${row}`)}
                        InputProps={{ readOnly: true }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>校区</Typography>
                      <TextField size='small' sx={{ flex: 1, backgroundColor: "white" }} />
                    </Box>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Numpad 
          open={numpadOpen && (currentInputId.includes('address-tel') || currentInputId.includes('family-tel') || currentInputId.includes('family-mobile'))} 
          onClose={() => setNumpadOpen(false)} 
          onInput={handleNumpadInput} 
        />

{/* Family Table - 家族の状況 */}
<Grid container spacing={2} className='pt-5 pl-3'>
  <Grid item xs={12}>
    <Box sx={{  display: 'flex' }}>
      {/* Vertical Label - 家族の状況 */}
      <Box sx={{ 
        width: '50px',
        display: 'flex',
        border: '1px solid #000',
        alignItems: 'center',
        justifyContent: 'center',
        writingMode: 'vertical-rl',
        textOrientation: 'upright',
        p: 2
      }}>
        <Typography sx={{ 
          fontSize: '18px',
          letterSpacing: '12px',
          lineHeight: 1
        }}>
          家族の状況
        </Typography>
      </Box>

      {/* Table Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <table style={{ 
          width: '100%', 
          backgroundColor: 'white'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ 
                width: '15%', 
                border: '1px solid #000', 
                padding: '8px',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                氏名
              </th>
              <th style={{ 
                width: '12%', 
                border: '1px solid #000', 
                padding: '8px',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                生年月日
              </th>
              <th style={{ 
                width: '8%', 
                border: '1px solid #000', 
                padding: '8px',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                続柄
              </th>
              <th style={{ 
                width: '18%', 
                border: '1px solid #000', 
                padding: '8px',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                勤務先
              </th>
              <th style={{ 
                width: '20%', 
                border: '1px solid #000', 
                padding: '8px',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                勤務先住所
              </th>
              <th style={{ 
                width: '20%', 
                border: '1px solid #000', 
                padding: '8px',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                TEL
              </th>
              <th style={{ 
                width: '7%', 
                border: '1px solid #000', 
                padding: '8px',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {familyMembers.map((member, index) => (
              <>
                {/* Upper Row - Main Info */}
                <tr key={`${member.id}-main`}>
                  {/* 氏名 */}
                  <td 
                    rowSpan={2}
                    style={{ 
                      border: '1px solid #000', 
                      padding: '8px',
                      verticalAlign: 'top',
                  
                    }}
                  >
                    {index === 0 && (
                      <Typography fontSize="0.85rem" fontWeight={500} sx={{ mb: 0.5 }}>
                        保護者
                      </Typography>
                    )}
                    <TextField 
                      fullWidth 
                      size='small' 
                      sx={{ 
                        backgroundColor: "white",
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: '1px solid #ccc' }
                        }
                      }} 
                    />
                  </td>

                  {/* 生年月日 */}
                  <td 
                    rowSpan={2}
                    style={{ 
                      border: '1px solid #000', 
                      padding: '8px',
                      verticalAlign: 'top',
                  
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.75rem">S・H</Typography>
                        <TextField 
                          size='small' 
                          placeholder="年" 
                          sx={{ 
                            width: 70, 
                            backgroundColor: "white",
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { border: '1px solid #ccc' }
                            }
                          }} 
                        />
                        <Typography fontSize="0.75rem">年</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TextField 
                          size='small' 
                          placeholder="月" 
                          sx={{ 
                            width: 60, 
                            backgroundColor: "white",
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { border: '1px solid #ccc' }
                            }
                          }} 
                        />
                        <Typography fontSize="0.75rem">月</Typography>
                        <TextField 
                          size='small' 
                          placeholder="日" 
                          sx={{ 
                            width: 60, 
                            backgroundColor: "white",
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { border: '1px solid #ccc' }
                            }
                          }} 
                        />
                        <Typography fontSize="0.75rem">日</Typography>
                      </Box>
                    </Box>
                  </td>

                  {/* 続柄 */}
                  <td 
                    rowSpan={2}
                    style={{ 
                      border: '1px solid #000', 
                      padding: '8px',
                      verticalAlign: 'top',
                  
                    }}
                  >
                    <TextField 
                      fullWidth 
                      size='small' 
                      sx={{ 
                        backgroundColor: "white",
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: '1px solid #ccc' }
                        }
                      }} 
                    />
                  </td>

                  {/* 勤務先 */}
                  <td style={{ 
                    border: '1px solid #000', 
                    padding: '8px',
                    verticalAlign: 'top',
                
                  }}>
                    <TextField 
                      fullWidth 
                      multiline
                      rows={2}
                      sx={{ 
                        backgroundColor: "white",
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: '1px solid #ccc' }
                        }
                      }} 
                    />
                  </td>

                  {/* 勤務先住所 */}
                  <td style={{ 
                    border: '1px solid #000', 
                    padding: '8px',
                    verticalAlign: 'top',
                
                  }}>
                    <TextField 
                      fullWidth 
                      multiline
                      rows={2}
                      sx={{ 
                        backgroundColor: "white",
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: '1px solid #ccc' }
                        }
                      }} 
                    />
                  </td>

                  {/* TEL */}
                  <td style={{ 
                    border: '1px solid #000', 
                    padding: '8px',
                    verticalAlign: 'top',
                
                  }}>
                    <TextField 
                      fullWidth 
                      size='small' 
                      placeholder="TEL"
                      sx={{ 
                        backgroundColor: "white",
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: '1px solid #ccc' }
                        }
                      }} 
                    />
                  </td>

                  {/* Delete Button */}
                  <td 
                    rowSpan={2}
                    style={{ 
                      border: '1px solid #000', 
                      padding: '8px',
                      textAlign: 'center',
                      verticalAlign: 'middle'
                    }}
                  >
                    {familyMembers.length > 1 && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => removeFamilyMember(member.id)}
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        削除
                      </Button>
                    )}
                  </td>
                </tr>

                {/* Lower Row - 携帯番号 */}
                <tr key={`${member.id}-mobile`}>
                  <td 
                    colSpan={3} 
                    style={{ 
                      border: '1px solid #000', 
                      padding: '8px',
                      borderTop: '1px dotted #999',
                  
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography fontSize="0.85rem" sx={{ whiteSpace: 'nowrap' }}>
                        携帯番号：
                      </Typography>
                      <TextField
                        fullWidth
                        size='small'
                        placeholder=""
                        sx={{ 
                          backgroundColor: "white",
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { border: '1px solid #ccc' }
                          }
                        }}
                      />
                    </Box>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  </Grid>

  {/* Add Family Member Button */}
  <Grid item xs={12}>
    <Button
      variant="contained"
      color="success"
      onClick={addFamilyMember}
      sx={{ mt: 2 }}
    >
      ➕ 家族を追加
    </Button>
  </Grid>
</Grid>
        {/* 通所（園）方法 and かかりつけの病院 Section */}
        <Grid container spacing={2} className='pt-5 pl-3'> 
          <Grid item xs={12}> 
            <Box sx={{ border: '2px solid #000' }}> 
              <Grid container> 
                {/* Left side - 通所（園）方法 */} 
                <Grid item xs={12} sm={6} sx={{ borderRight: '1px solid #000' }}> 
                  <Box sx={{ display: 'flex', height: '100%' }}> 
                    {/* Vertical Label */}
                    <Box sx={{ 
                      borderRight: '1px solid #000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 1,
                      minWidth: '40px',
                      writingMode: 'vertical-rl',
                      textOrientation: 'upright'
                    }}>
                      <Typography sx={{ 
                        fontSize: '16px',
                        letterSpacing: '8px',
                        lineHeight: 1
                      }}>
                        通所（園）方法
                      </Typography>
                    </Box>

                    {/* Content Area */}
                    <Box sx={{ flex: 1, p: 2 }}>
                      {/* Transportation Methods */}
                      <RadioGroup>
                        <FormControlLabel 
                          value="walk" 
                          control={<Radio />} 
                          label="徒歩" 
                        />
                        <FormControlLabel 
                          value="bicycle" 
                          control={<Radio />} 
                          label="自転車" 
                        />
                      </RadioGroup>

                      {/* Details Input */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>詳細：</Typography>
                        <TextField 
                          fullWidth 
                          multiline 
                          rows={5} 
                          placeholder="詳細を入力してください"
                          sx={{ backgroundColor: "white" }} 
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid> 

                {/* Right side - かかりつけの病院 */} 
                <Grid item xs={12} sm={6}> 
                  <Box>
                    {/* Header */}
                    <Box sx={{ 
                      borderBottom: '1px solid #000',
                      p: 1.5,
                      textAlign: 'center',
                      backgroundColor: '#f5f5f5'
                    }}>
                      <Typography fontWeight={600}>かかりつけの病院</Typography>
                    </Box>

                    {/* Hospital entries */}
                    {[ 
                      { label: '小児科', id: 'pediatrics' }, 
                      { label: '内　科', id: 'internal' }, 
                      { label: '外　科', id: 'surgery' }, 
                      { label: '歯　科', id: 'dental' }, 
                      { label: '　　科', id: 'other1' }, 
                      { label: '　　科', id: 'other2' } 
                    ].map((dept) => ( 
                      <Box 
                        key={dept.id} 
                        sx={{ 
                          display: 'flex',
                          borderBottom: '1px solid #000',
                          minHeight: '50px'
                        }}
                      > 
                        {/* Department Name */}
                        <Box sx={{ 
                          width: '30%',
                          borderRight: '1px solid #000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1
                        }}>
                          <Typography>{dept.label}</Typography>
                        </Box>

                        {/* Tel Input */}
                        <Box sx={{ 
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          p: 1,
                          gap: 1
                        }}>
                          <Typography>TEL (</Typography> 
                          <TextField 
                            size='small' 
                            placeholder="" 
                            sx={{ 
                              flex: 1, 
                              backgroundColor: "white",
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  border: 'none'
                                }
                              }
                            }} 
                          /> 
                          <Typography>)</Typography> 
                        </Box>
                      </Box> 
                    ))} 

                    {/* Blood Type */} 
                    <Box sx={{ 
                      display: 'flex',
                      minHeight: '60px'
                    }}> 
                      {/* Label */}
                      <Box sx={{ 
                        width: '30%',
                        borderRight: '1px solid #000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 1
                      }}>
                        <Typography fontWeight={600}>血液型</Typography>
                      </Box>

                      {/* Input */}
                      <Box sx={{ 
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        p: 2,
                        gap: 1
                      }}>
                        <TextField 
                          size='small' 
                          placeholder="" 
                          sx={{ 
                            width: 100, 
                            backgroundColor: "white",
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                border: 'none'
                              }
                            }
                          }} 
                        /> 
                        <Typography>型</Typography> 
                      </Box>
                    </Box> 
                  </Box> 
                </Grid> 
              </Grid> 
            </Box> 
          </Grid> 
        </Grid>

        {/* 予防接種状況 Section */}
        <Grid container spacing={2} className='pt-5 pl-3'>
          <Grid item xs={12}>
            <Box sx={{ border: '2px solid #000' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {/* 妊娠中の状況 Row */}
                  <tr>
                    <td style={{ width: '10%', borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '8px', verticalAlign: 'middle' }}>
                      <Typography fontWeight={600}>妊娠中の状況</Typography>
                    </td>
                    <td style={{ borderBottom: '1px solid #000', padding: '8px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <RadioGroup row>
                          <FormControlLabel value="normal" control={<Radio size="small" />} label="異常なし" />
                          <FormControlLabel value="abnormal" control={<Radio size="small" />} label="あり" />
                        </RadioGroup>
                        <Typography>（</Typography>
                        <TextField size='small' sx={{ width: 150, backgroundColor: "white" }} />
                        <Typography>）</Typography>
                        <Typography fontWeight={600} sx={{ ml: 2 }}>妊娠期間</Typography>
                        <TextField size='small' sx={{ width: 80, backgroundColor: "white" }} />
                        <Typography>週</Typography>
                        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                          <Typography fontWeight={600} fontSize="1.2rem">第</Typography>
                          <TextField size='small' sx={{ width: 60, backgroundColor: "white", mx: 1 }} />
                          <Typography fontWeight={600} fontSize="1.2rem">子</Typography>
                        </Box>
                      </Box>
                    </td>
                  </tr>

                  {/* 分娩時の状況 Row */}
                  <tr>
                    <td style={{ width: '10%', borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '8px', verticalAlign: 'middle' }}>
                      <Typography fontWeight={600}>分娩時の状況</Typography>
                    </td>
                    <td style={{ borderBottom: '1px solid #000', padding: '8px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <RadioGroup row>
                          <FormControlLabel value="normal" control={<Radio size="small" />} label="異常なし" />
                          <FormControlLabel value="abnormal" control={<Radio size="small" />} label="あり" />
                        </RadioGroup>
                        <Typography>（</Typography>
                        <TextField size='small' sx={{ width: 150, backgroundColor: "white" }} />
                        <Typography>）</Typography>
                        <Typography fontWeight={600} sx={{ ml: 2 }}>出生時体重</Typography>
                        <Typography>（</Typography>
                        <TextField size='small' sx={{ width: 100, backgroundColor: "white" }} />
                        <Typography>g）</Typography>
                      </Box>
                    </td>
                  </tr>

                 {/* 出生時の状況 Row */}
                  <tr>
                    <td style={{ width: '10%', borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '8px', verticalAlign: 'top' }}>
                      <Typography fontWeight={600}>出生時の状況</Typography>
                    </td>
                    <td style={{ borderBottom: '1px solid #000', padding: '8px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        {/* Main selection: 異常なし or あり */}
                        <RadioGroup 
                          row 
                          value={birthCondition}
                          onChange={(e) => {
                            setBirthCondition(e.target.value);
                            if (e.target.value === 'normal') {
                              setBirthDetails([]);
                              setBirthOther('');
                            }
                          }}
                        >
                          <FormControlLabel value="normal" control={<Radio size="small" />} label="異常なし" />
                          <FormControlLabel value="abnormal" control={<Radio size="small" />} label="あり" />
                        </RadioGroup>

                        {/* Detail checkboxes - always visible but disabled when 'normal' */}
                        <FormControlLabel 
                          control={
                            <Checkbox 
                              size="small" 
                              checked={birthDetails.includes('仮死')}
                              disabled={birthCondition === 'normal'}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBirthDetails([...birthDetails, '仮死']);
                                } else {
                                  setBirthDetails(birthDetails.filter(d => d !== '仮死'));
                                }
                              }}
                            />
                          } 
                          label="仮死" 
                        />
                        <FormControlLabel 
                          control={
                            <Checkbox 
                              size="small"
                              checked={birthDetails.includes('けいれん')}
                              disabled={birthCondition === 'normal'}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBirthDetails([...birthDetails, 'けいれん']);
                                } else {
                                  setBirthDetails(birthDetails.filter(d => d !== 'けいれん'));
                                }
                              }}
                            />
                          } 
                          label="けいれん" 
                        />
                        <FormControlLabel 
                          control={
                            <Checkbox 
                              size="small"
                              checked={birthDetails.includes('強い黄疸')}
                              disabled={birthCondition === 'normal'}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBirthDetails([...birthDetails, '強い黄疸']);
                                } else {
                                  setBirthDetails(birthDetails.filter(d => d !== '強い黄疸'));
                                }
                              }}
                            />
                          } 
                          label="強い黄疸" 
                        />
                        <FormControlLabel 
                          control={
                            <Checkbox 
                              size="small"
                              checked={birthDetails.includes('呼吸異常')}
                              disabled={birthCondition === 'normal'}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBirthDetails([...birthDetails, '呼吸異常']);
                                } else {
                                  setBirthDetails(birthDetails.filter(d => d !== '呼吸異常'));
                                }
                              }}
                            />
                          } 
                          label="呼吸異常" 
                        />
                        <FormControlLabel 
                          control={
                            <Checkbox 
                              size="small"
                              checked={birthDetails.includes('先天性代謝異常')}
                              disabled={birthCondition === 'normal'}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBirthDetails([...birthDetails, '先天性代謝異常']);
                                } else {
                                  setBirthDetails(birthDetails.filter(d => d !== '先天性代謝異常'));
                                }
                              }}
                            />
                          } 
                          label="先天性代謝異常" 
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <FormControlLabel 
                            control={
                              <Checkbox 
                                size="small"
                                checked={birthDetails.includes('その他')}
                                disabled={birthCondition === 'normal'}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setBirthDetails([...birthDetails, 'その他']);
                                  } else {
                                    setBirthDetails(birthDetails.filter(d => d !== 'その他'));
                                    setBirthOther('');
                                  }
                                }}
                              />
                            } 
                            label="その他" 
                          />
                          <Typography>（</Typography>
                          <TextField 
                            size='small' 
                            sx={{ width: 200, backgroundColor: "white" }}
                            value={birthOther}
                            onChange={(e) => setBirthOther(e.target.value)}
                            disabled={birthCondition === 'normal' || !birthDetails.includes('その他')}
                          />
                          <Typography>）</Typography>
                        </Box>
                      </Box>
                    </td>
                  </tr>

                  {/* 乳児期の様子 Row */}
                  <tr>
                    <td style={{ width: '10%', borderRight: '1px solid #000', padding: '8px', verticalAlign: 'top' }}>
                      <Typography fontWeight={600}>乳児期の様子</Typography>
                    </td>
                    <td style={{ padding: '8px' }}>
                      {/* First Row - 栄養方法 and 離乳 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        <Typography>栄養方法</Typography>
                        <RadioGroup row>
                          <FormControlLabel value="母乳" control={<Radio size="small" />} label="母乳" />
                          <FormControlLabel value="混合" control={<Radio size="small" />} label="混合" />
                          <FormControlLabel value="人工乳" control={<Radio size="small" />} label="人工乳" />
                        </RadioGroup>
                        
                        <Typography sx={{ ml: 2 }}>離乳</Typography>
                        <RadioGroup row sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
                          <FormControlLabel value="未開始" control={<Radio size="small" />} label="未開始" />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FormControlLabel value="開始" control={<Radio size="small" />} label="開始" />
                            <TextField size='small' sx={{ width: 60, backgroundColor: "white" }} />
                            <Typography>か月</Typography>
                          </Box>
                        </RadioGroup>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography>完了</Typography>
                          <TextField size='small' sx={{ width: 60, backgroundColor: "white" }} />
                          <Typography>か月</Typography>
                        </Box>
                      </Box>

                      {/* Second Row - Development milestones */}
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        <Typography>首のすわり（</Typography>
                        <TextField size='small' sx={{ width: 60, backgroundColor: "white" }} />
                        <Typography>か月）</Typography>
                        <Typography>はいはい（</Typography>
                        <TextField size='small' sx={{ width: 60, backgroundColor: "white" }} />
                        <Typography>か月）</Typography>
                        <Typography>ひとり歩き（</Typography>
                        <TextField size='small' sx={{ width: 60, backgroundColor: "white" }} />
                        <Typography>か月）</Typography>
                        <Typography>"ママ"などの言葉（</Typography>
                        <TextField size='small' sx={{ width: 60, backgroundColor: "white" }} />
                        <Typography>か月）</Typography>
                      </Box>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </Grid>
        </Grid>
        
        {/* Vaccination Status Table */}
        <Grid container spacing={2} className="pt-5 pl-3">
          <Grid item xs={12}>
            {/* Vaccination Table */}
            <Box sx={{ border: '2px solid #000' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    {/* 予防接種状況 column header */}
                    <td
                      rowSpan={10}
                      style={{
                        width: '3%',
                        borderRight: '1px solid #000',
                        padding: '8px',
                        backgroundColor: '#f5f5f5',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                        }}
                      >
                        {['予', '防', '接', '種', '状', '況'].map((char, i) => (
                          <Typography key={i} fontWeight={600} fontSize="0.95rem">
                            {char}
                          </Typography>
                        ))}
                      </Box>
                    </td>

                    {/* Vaccine name column header */}
                    <td
                      rowSpan={1}
                      style={{
                        width: '8%',
                        borderRight: '1px solid #000',
                        borderBottom: '1px solid #000',
                        padding: '8px',
                        backgroundColor: '#f5f5f5',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                      }}
                    >
                      <Typography fontWeight={600}>ワクチン名</Typography>
                    </td>

                    {/* Age timeline header */}
                    <td
                      colSpan={84} // 72 → 84
                      style={{
                        borderBottom: '1px solid #000',
                        padding: '8px',
                        backgroundColor: '#f5f5f5',
                      }}
                    >
                      <Box sx={{ display: 'flex', position: 'relative', height: '24px' }}>
                        {/* 0–24ヶ月 = 24 unit, 24–72ヶ月 = 48×0.3, 余白含め TOTAL_UNITS = 42 */}
                        <Typography
                          fontWeight={600}
                          fontSize="0.75rem"
                          sx={{
                            position: 'absolute',
                            left: `${(3 / TOTAL_UNITS) * 100}%`,
                            transform: 'translateX(-50%)',
                            color: '#000',
                          }}
                        >
                          3か月
                        </Typography>
                        <Typography
                          fontWeight={600}
                          fontSize="0.75rem"
                          sx={{
                            position: 'absolute',
                            left: `${(6 / TOTAL_UNITS) * 100}%`,
                            transform: 'translateX(-50%)',
                            color: '#000',
                          }}
                        >
                          6か月
                        </Typography>
                        <Typography
                          fontWeight={600}
                          fontSize="0.75rem"
                          sx={{
                            position: 'absolute',
                            left: `${(9 / TOTAL_UNITS) * 100}%`,
                            transform: 'translateX(-50%)',
                            color: '#000',
                          }}
                        >
                          9か月
                        </Typography>
                        <Typography
                          fontWeight={600}
                          fontSize="0.75rem"
                          sx={{
                            position: 'absolute',
                            left: `${(12 / TOTAL_UNITS) * 100}%`,
                            transform: 'translateX(-50%)',
                            color: '#000',
                          }}
                        >
                          1歳
                        </Typography>
                        <Typography
                          fontWeight={600}
                          fontSize="0.75rem"
                          sx={{
                            position: 'absolute',
                            left: `${(18 / TOTAL_UNITS) * 100}%`,
                            transform: 'translateX(-50%)',
                            color: '#000',
                          }}
                        >
                          1歳6か月
                        </Typography>
                        <Typography
                          fontWeight={600}
                          fontSize="0.75rem"
                          sx={{
                            position: 'absolute',
                            left: `${(24 / TOTAL_UNITS) * 100}%`,
                            transform: 'translateX(-50%)',
                            color: '#000',
                          }}
                        >
                          2歳
                        </Typography>
                        <Typography
                          fontWeight={600}
                          fontSize="0.75rem"
                          sx={{
                            position: 'absolute',
                            left: `${((24 + (36 - 24) * 0.3) / TOTAL_UNITS) * 100}%`,
                            transform: 'translateX(-50%)',
                            color: '#000',
                          }}
                        >
                          3歳
                        </Typography>
                        <Typography
                          fontWeight={600}
                          fontSize="0.75rem"
                          sx={{
                            position: 'absolute',
                            left: `${((24 + (48 - 24) * 0.3) / TOTAL_UNITS) * 100}%`,
                            transform: 'translateX(-50%)',
                            color: '#000',
                          }}
                        >
                          4歳
                        </Typography>
                        <Typography
                          fontWeight={600}
                          fontSize="0.75rem"
                          sx={{
                            position: 'absolute',
                            left: `${((24 + (60 - 24) * 0.3) / TOTAL_UNITS) * 100}%`,
                            transform: 'translateX(-50%)',
                            color: '#000',
                          }}
                        >
                          5歳
                        </Typography>
                        <Typography
                          fontWeight={600}
                          fontSize="0.75rem"
                          sx={{
                            position: 'absolute',
                            // ここで 72ヶ月 も TOTAL_UNITS=42 で割るので 右端より少し内側になる
                            left: `${((24 + (72 - 24) * 0.3) / TOTAL_UNITS) * 100}%`,
                            transform: 'translateX(-50%)',
                            color: '#000',
                          }}
                        >
                          6歳
                        </Typography>
                      </Box>
                    </td>
                  </tr>

                  {/* Vaccination rows */}
                  {[
                    {
                      name: 'B型肝炎',
                      bars: [{ start: 0, end: 8, type: 'standard' }],
                    },
                    {
                      name: 'BCG',
                      bars: [{ start: 5, end: 12, type: 'standard' }],
                    },
                    {
                      name: '4種混合',
                      bars: [{ start: 2, end: 12, type: 'standard' }],
                    },
                    {
                      name: 'ロタウイルス',
                      bars: [{ start: 2, end: 8, type: 'recommended' }],
                    },
                    {
                      name: '麻しん(はしか)\n風しん',
                      bars: [
                        { start: 12, end: 15, type: 'recommended' },
                        { start: 12, end: 24, type: 'standard' },
                        { start: 60, end: 72, type: 'recommended' },
                      ],
                    },
                    {
                      name: '日本脳炎',
                      bars: [{ start: 36, end: 72, type: 'standard' }],
                    },
                    {
                      name: 'ヒブ',
                      bars: [{ start: 2, end: 60, type: 'combined' }],
                    },
                    {
                      name: '小児肺炎球菌',
                      bars: [{ start: 2, end: 60, type: 'combined' }],
                    },
                    {
                      name: '水痘\n(みずぼうそう)',
                      bars: [
                        { start: 12, end: 15, type: 'recommended' },
                        { start: 12, end: 36, type: 'standard' },
                      ],
                    },
                  ].map((vaccine, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          borderRight: '1px solid #000',
                          borderBottom: index === 8 ? 'none' : '1px solid #000',
                          padding: '8px',
                          verticalAlign: 'middle',
                          width: '8%',
                        }}
                      >
                        <Typography
                          fontSize="0.85rem"
                          fontWeight={600}
                          sx={{ whiteSpace: 'pre-line' }}
                        >
                          {vaccine.name}
                        </Typography>
                      </td>
                      <td
                        colSpan={84}
                        style={{
                          borderBottom: index === 8 ? 'none' : '1px solid #000',
                          padding: 0,
                          position: 'relative',
                          height: '40px',
                        }}
                      >
                        {/* Grid lines */}
                        
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '100%',
                          display: 'flex',
                        }}
                      >
                        {[...Array(84)].map((_, i) => {
                          // i = 0–71 → 0–72ヶ月ぶん
                          // i = 72–83 → 余白用の列
                          const isYearBoundary = [36, 48, 60, 72].includes(i); // ★ เพิ่ม 72
                          const showLine = i < 24 || isYearBoundary;           // ★ ยังใช้เงื่อนไขเดิม

                          let flexValue: number;
                          if (i < 24) {
                            flexValue = 1; // 0–24ヶ月
                          } else if (i < 72) {
                            flexValue = 0.3; // 24–72ヶ月
                          } else {
                            flexValue = 0.3; // padding 部分も同じ幅
                          }

                          return (
                            <Box
                              key={i}
                              sx={{
                                flex: flexValue,
                                borderRight:
                                  i === 83
                                    ? 'none'
                                    : showLine               // ★ ตัดเงื่อนไข i < 72 ออก
                                    ? '1px dashed #ddd'
                                    : 'none',
                              }}
                            />
                          );
                        })}
                      </Box>


                        {/* Vaccination bars */}
                        {vaccine.bars.map((bar, barIndex) => {
                          let bgColor = '#b8cce4'; // recommended (blue)
                          let borderColor = '#7fa3cc';

                          if (bar.type === 'standard') {
                            bgColor = '#d9d9d9';
                            borderColor = '#b0b0b0';
                          } else if (bar.type === 'combined') {
                            bgColor = '#b8cce4';
                            borderColor = '#7fa3cc';
                          }

                          const startPercent = calculatePosition(bar.start);
                          const endPercent = calculatePosition(bar.end);
                          const widthPercent = endPercent - startPercent;

                          return (
                            <Box
                              key={barIndex}
                              sx={{
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                left: `${startPercent}%`,
                                width: `${widthPercent}%`,
                                height: 16,
                                backgroundColor: bgColor,
                                border: `1px solid ${borderColor}`,
                                boxSizing: 'border-box',
                                zIndex: 1,
                              }}
                            />
                          );
                        })}

                        {/* Combined bar for later period (for ヒブ and 小児肺炎球菌) */}
                        {(vaccine.name === 'ヒブ' || vaccine.name === '小児肺炎球菌') && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              left: `${calculatePosition(12)}%`,
                              width: `${
                                calculatePosition(60) - calculatePosition(12)
                              }%`,
                              height: 16,
                              backgroundColor: '#d9d9d9',
                              border: '1px solid #b0b0b0',
                              boxSizing: 'border-box',
                              zIndex: 1,
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            {/* Legend and Notes */}
            <Box
              sx={{
                p: 2,
                backgroundColor: '#fff5f5',
                border: '2px solid #000',
                borderTop: 'none',
                textAlign: 'left',           // ★ บังคับข้อความชิดซ้าย
              }}
            >
              <Box sx={{ display: 'flex', gap: 3, mb: 1, justifyContent: "flex-start" }}>   {/* ★ เพิ่ม */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 16,
                      backgroundColor: '#b8cce4',
                      border: '1px solid #7fa3cc',
                    }}
                  />
                  <Typography fontSize="0.85rem" color="error" fontWeight={600}>
                    標準的な接種年齢
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 16,
                      backgroundColor: '#d9d9d9',
                      border: '1px solid #b0b0b0',
                    }}
                  />
                  <Typography fontSize="0.85rem" color="error" fontWeight={600}>
                    接種が定められている年齢
                  </Typography>
                </Box>
              </Box>

              <Typography fontSize="0.85rem" color="error" sx={{ mb: 0.5 }}>
                ※麻しん・風しん(２期)の対象は年長児。
              </Typography>
              <Typography fontSize="0.85rem" color="error">
                ※麻しん・風しんは、１期・２期とも、接種年齢になったら、なるべく早く受けることが望ましい。
              </Typography>
            </Box>

          </Grid>
        </Grid>
             
      </ContentMain>
    </>
  );
}