import { Button, Checkbox, FormControl, Box, FormControlLabel, Grid, MenuItem, Select, TextField, Typography, TableContainer, Table, TableBody, TableRow, TableCell,  InputLabel, TableHead } from "@mui/material";
import ContentMain from "../../content/Content";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Loading from '../../Loading';
import { useEffect, useState } from 'react';
import { ArrowBack, Save } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
interface FamilyMember {
  id: number;
}

export default function StudentHistory() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [familyMemberCounter, setFamilyMemberCounter] = useState(1);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([{ id: 1 }]);
  const [birthCondition, setBirthCondition] = useState('normal'); // 'normal' or 'abnormal'
  const [birthDetails, setBirthDetails] = useState<string[]>([]);
  const [birthOther, setBirthOther] = useState('');

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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>健康管理台帳（</Typography>
                <FormControlLabel 
                  control={<Checkbox />} 
                  label="有" 
                  sx={{ m: 0 }}
                />
                <Typography>）・ 健康個人カード（</Typography>
                <FormControlLabel 
                  control={<Checkbox />} 
                  label="有" 
                  sx={{ m: 0 }}
                />
                <Typography>）</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Health Management Table Header - 健康管理台帳 */}
        <Grid container spacing={2} className='pt-3 pl-3'>
          <Grid item xs={12}>
            <Box sx={{ border: '2px solid #000', p: 1, mb: 2, backgroundColor: '#f5f5f5' }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={7}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography>年度:</Typography>
                    <TextField 
                      label="年度" 
                      size='small' 
                      placeholder="2024"
                      sx={{ width: 100, backgroundColor: "white" }} 
                    />
                    <FormControl size='small' sx={{ width: 120, backgroundColor: "white" }}>
                      <InputLabel>年齢</InputLabel>
                      <Select label="年齢" defaultValue="">
                        <MenuItem value="0">0歳児</MenuItem>
                        <MenuItem value="1">1歳児</MenuItem>
                        <MenuItem value="2">2歳児</MenuItem>
                        <MenuItem value="3">3歳児</MenuItem>
                        <MenuItem value="4">4歳児</MenuItem>
                        <MenuItem value="5">5歳児</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* Basic Information Table */}
        <Grid container spacing={2} className='pt-3 pl-3'>
          <Grid item xs={12}>
            <TableContainer sx={{ border: '1px solid #000' }}>
              <Table sx={{ '& td, & th': { border: '1px solid #000', padding: '8px' } }}>
                <TableBody>
                  {/* Row 1: Furigana */}
                  <TableRow>
                    <TableCell 
                      sx={{ 
                        backgroundColor: '#f5f5f5', 
                        width: '100px', 
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}
                    >
                      <Typography>ふりがな</Typography>
                    </TableCell>
                    <TableCell sx={{ width: '35%' }}>
                      <TextField
                        fullWidth
                        placeholder="やまだ　たろう"
                        size='small'
                        sx={{ backgroundColor: "white" }}
                      />
                    </TableCell>
                    <TableCell 
                      rowSpan={2}
                      sx={{ 
                        backgroundColor: '#f5f5f5', 
                        width: '80px', 
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}
                    >
                      <RadioGroup row sx={{ justifyContent: 'center', gap: 1 }}>
                        <FormControlLabel 
                          value="male" 
                          control={<Radio />} 
                          label="男" 
                          sx={{ margin: 0 }}
                        />
                        <FormControlLabel 
                          value="female" 
                          control={<Radio />} 
                          label="女" 
                          sx={{ margin: 0 }}
                        />
                      </RadioGroup>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        backgroundColor: '#f5f5f5', 
                        width: '25%',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}
                    >
                      <Typography>生年月日</Typography>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        backgroundColor: '#f5f5f5', 
                        width: '80px', 
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}
                    >
                      <Typography sx={{ writingMode: 'vertical-rl', textOrientation: 'upright', margin: 'auto' }}>
                        入所
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: '18%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                        <Typography fontSize="0.9rem">令和</Typography>
                        <TextField size='small' placeholder="年" sx={{ width: 40, backgroundColor: "white" }} />
                        <Typography fontSize="0.9rem">年</Typography>
                        <TextField size='small' placeholder="月" sx={{ width: 40, backgroundColor: "white" }} />
                        <Typography fontSize="0.9rem">月</Typography>
                        <TextField size='small' placeholder="日" sx={{ width: 40, backgroundColor: "white" }} />
                        <Typography fontSize="0.9rem">日</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Row 2: Name */}
                  <TableRow>
                    <TableCell 
                      sx={{ 
                        backgroundColor: '#f5f5f5', 
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}
                    >
                      <Typography>氏名</Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        placeholder="山田　太郎"
                        size='small'
                        sx={{ backgroundColor: "white" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                        <RadioGroup row>
                          <FormControlLabel 
                            value="heisei" 
                            control={<Radio size="small" />} 
                            label="平成" 
                            sx={{ mr: 0.5, '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }} 
                          />
                          <FormControlLabel 
                            value="reiwa" 
                            control={<Radio size="small" />} 
                            label="令和" 
                            sx={{ ml: 0.5, '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }} 
                          />
                        </RadioGroup>
                        <TextField size='small' placeholder="年" sx={{ width: 50, backgroundColor: "white" }} />
                        <Typography fontSize="0.9rem">年</Typography>
                        <TextField size='small' placeholder="月" sx={{ width: 50, backgroundColor: "white" }} />
                        <Typography fontSize="0.9rem">月</Typography>
                        <TextField size='small' placeholder="日" sx={{ width: 50, backgroundColor: "white" }} />
                        <Typography fontSize="0.9rem">日</Typography>
                      </Box>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        backgroundColor: '#f5f5f5', 
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}
                    >
                      <Typography sx={{ writingMode: 'vertical-rl', textOrientation: 'upright', margin: 'auto' }}>
                        退所
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                        <Typography fontSize="0.9rem">令和</Typography>
                        <TextField size='small' placeholder="年" sx={{ width: 40, backgroundColor: "white" }} />
                        <Typography fontSize="0.9rem">年</Typography>
                        <TextField size='small' placeholder="月" sx={{ width: 40, backgroundColor: "white" }} />
                        <Typography fontSize="0.9rem">月</Typography>
                        <TextField size='small' placeholder="日" sx={{ width: 40, backgroundColor: "white" }} />
                        <Typography fontSize="0.9rem">日</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>


                  {/* Address Rows */}
                  {[1, 2, 3].map((row) => (
                    <TableRow key={row}>
                      {row === 1 && (
                        <TableCell 
                          rowSpan={3} 
                          sx={{ 
                            backgroundColor: '#f5f5f5', 
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            width: '100px'
                          }}
                        >
                          <Typography sx={{ writingMode: 'vertical-rl', textOrientation: 'upright', margin: 'auto' }}>
                            現住所
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell colSpan={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography>〒</Typography>
                          <TextField size='small' placeholder="000-0000" sx={{ width: 100, backgroundColor: "white" }} />
                          <Typography>福岡市</Typography>
                          <TextField size='small' placeholder="区" sx={{ flex: 1, backgroundColor: "white" }} />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography>TEL</Typography>
                          <Typography>(</Typography>
                          <TextField
                            size='small'
                            placeholder=""
                            sx={{  flex: 1, backgroundColor: "white" }}
                          />
                          <Typography>)</Typography>
                        </Box>
                      </TableCell>
                      <TableCell colSpan={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography>校区</Typography>
                          <TextField size='small' sx={{ flex: 1, backgroundColor: "white" }} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {/* Family Table - 家族の状況 */}
        <Grid container spacing={2} className='pt-5 pl-3'>
          <Grid item xs={12}>
            <TableContainer
              component={Box}
              sx={{
                border: '1px solid #000',
                overflow: 'auto',
              }}
            >
              <Table
                sx={{
                  minWidth: 650,
                  '& .MuiTableCell-root': {
                    border: '1px solid #000',
                    borderCollapse: 'collapse',
                  },
                }}
                size="small"
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    {/* 家族の状況 用の空ヘッダー列 */}
                    <TableCell
                      sx={{
                        width: '50px',
                        p: 0,
                      }}
                    />
                    <TableCell
                      align="center"
                      sx={{
                        width: '15%',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        p: 1,
                      }}
                    >
                      氏名
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: '12%',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        p: 1,
                      }}
                    >
                      生年月日
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: '7%',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        p: 1,
                      }}
                    >
                      続柄
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: '18%',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        p: 1,
                      }}
                    >
                      勤務先
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: '20%',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        p: 1,
                      }}
                    >
                      勤務先住所
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: '20%',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        p: 1,
                      }}
                    >
                      TEL
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: '7%',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        p: 1,
                      }}
                    >
                      操作
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {familyMembers.map((member, index) => [
                    // ⭐ 1) Main Row
                    <TableRow key={`${member.id}-main`}>
                      {/* 家族の状況 (rowSpan ทั้งหมด) */}
                      {index === 0 && (
                        <TableCell
                          rowSpan={familyMembers.length * 2}
                          sx={{
                            width: '50px',
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            backgroundColor: '#f5f5f5',
                            textAlign: 'center',
                            p: 2,
                          }}
                        >
                          家族の状況
                        </TableCell>
                      )}

                      {/* 氏名 */}
                      <TableCell rowSpan={2}>
                        <TextField fullWidth size="small" />
                      </TableCell>

                      {/* 生年月日 */}
                      <TableCell rowSpan={2} sx={{ p: 1, verticalAlign: 'top', backgroundColor: 'white'  }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

                          {/* 🔴 Radio S / H */}
                          <RadioGroup row defaultValue="S" sx={{ mt: -0.5 }}>
                            <FormControlLabel
                              value="S"
                              control={<Radio size="small" />}
                              label={<Typography fontSize="0.75rem">S</Typography>}
                            />
                            <FormControlLabel
                              value="H"
                              control={<Radio size="small" />}
                              label={<Typography fontSize="0.75rem">H</Typography>}
                            />
                          </RadioGroup>

                          {/* 🔵 年 */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TextField
                              size="small"
                              placeholder="年"
                              sx={{
                                width: 70,
                                '& .MuiOutlinedInput-root fieldset': { border: '1px solid #ccc' },
                              }}
                            />
                            <Typography fontSize="0.75rem">年</Typography>
                            <TextField
                              size="small"
                              placeholder="月"
                              sx={{
                                width: 60,
                                '& .MuiOutlinedInput-root fieldset': { border: '1px solid #ccc' },
                              }}
                            />
                            <Typography fontSize="0.75rem">月</Typography>

                            <TextField
                              size="small"
                              placeholder="日"
                              sx={{
                                width: 60,
                                '& .MuiOutlinedInput-root fieldset': { border: '1px solid #ccc' },
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>


                      {/* 続柄 */}
                      <TableCell rowSpan={2} >
                        <TextField rows={4} multiline fullWidth size="small" />
                      </TableCell>

                      {/* 勤務先 */}
                      <TableCell>
                        <TextField fullWidth multiline rows={2} />
                      </TableCell>

                      {/* 勤務先住所 */}
                      <TableCell>
                        <TextField fullWidth multiline rows={2} />
                      </TableCell>

                      {/* TEL */}
                      <TableCell>
                        <TextField fullWidth size="small" />
                      </TableCell>

                      {/* 削除 */}
                      <TableCell rowSpan={2} align="center">
                        {familyMembers.length > 1 && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => removeFamilyMember(member.id)}
                          >
                            削除
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>,

                    // ⭐ 2) Mobile Row
                    <TableRow key={`${member.id}-mobile`}>
                      <TableCell colSpan={3} sx={{ borderTop: '1px dashed #888' }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography fontSize="0.85rem">携帯番号：</Typography>
                          <TextField fullWidth size="small" />
                        </Box>
                      </TableCell>
                    </TableRow>,
                  ])}
                </TableBody>

              </Table>
            </TableContainer>
          </Grid>

          {/* 追加ボタン */}
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
        <Grid container spacing={2} className='pt-5 pl-3'>
          <Grid item xs={12}>
            <Box sx={{ border: '2px solid #000' }}>
              <Box sx={{ p: 1.5, backgroundColor: '#f5f5f5', borderBottom: '1px solid #000' }}>
                <Typography fontWeight={600}>予防接種記録入力</Typography>
              </Box>

              <Table size="small">
                <TableBody>
                  {[
                    { name: 'B型肝炎', count: 2 },
                    { name: 'BCG', count: 1 },
                    { name: '4種混合', count: 2 },
                    { name: 'ロタウイルス', count: 1 },
                    { name: '麻しん風しん', count: 2 },
                    { name: '日本脳炎', count: 2 },
                    { name: 'ヒブ', count: 2 },
                    { name: '小児肺炎球菌', count: 2 },
                    { name: '水痘', count: 2 },
                  ].map((vaccine, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ width: '15%', fontWeight: 600, fontSize: '0.9rem' }}>
                        {vaccine.name}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', py: 0.5 }}>
                          {[...Array(vaccine.count)].map((_, i) => (
                            <Box key={i} sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                              <Typography fontSize="0.85rem" color="text.secondary">
                                {i + 1}回:
                              </Typography>
                              <TextField
                                type="date"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                sx={{ width: 150 }}
                              />
                            </Box>
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>

        {/* 乳幼児健診・既往症 Section */}
        <Grid container spacing={2} className='pt-5 pl-3'>
          <Grid item xs={12}>
            <TableContainer sx={{ border: '1px solid #000' }}>
              <Table sx={{ '& td, & th': { border: '1px solid #000' }, borderCollapse: 'collapse' }}>
                <TableHead>
                  {/* Header Row 1 */}
                  <TableRow>
                    <TableCell
                      rowSpan={2}
                      colSpan={2}
                      sx={{
                        width: '10%',
                        backgroundColor: '#f5f5f5',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '16px 8px',
                      }}
                    >
                      <Typography sx={{ letterSpacing: '8px' }}>乳幼児健診</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', padding: '8px', width: '10%' }}>
                      <Typography fontWeight={600}>4か月</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', padding: '8px', width: '10%' }}>
                      <Typography fontWeight={600}>10か月</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', padding: '8px', width: '10%' }}>
                      <Typography fontWeight={600}>1歳6か月</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', padding: '8px', width: '10%' }}>
                      <Typography fontWeight={600}>3歳</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', padding: '8px', width: '12%' }}>
                      <Typography fontWeight={600}>特記事項</Typography>
                    </TableCell>
                  </TableRow>

                  {/* Header Row 2 - Era selection */}

                  <TableRow>
                    {/* 4か月 column */}
                    <TableCell sx={{ textAlign: 'center', padding: '4px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <RadioGroup row>
                          <FormControlLabel
                            value="heisei"
                            control={<Radio size="small" />}
                            label="H"
                            sx={{ mr: 0.5, '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                          />
                          <FormControlLabel
                            value="reiwa"
                            control={<Radio size="small" />}
                            label="R"
                            sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                          />
                        </RadioGroup>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">年</Typography>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">月</Typography>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">日</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* 10か月 column */}
                    <TableCell sx={{ textAlign: 'center', padding: '4px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <RadioGroup row>
                          <FormControlLabel
                            value="heisei"
                            control={<Radio size="small" />}
                            label="H"
                            sx={{ mr: 0.5, '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                          />
                          <FormControlLabel
                            value="reiwa"
                            control={<Radio size="small" />}
                            label="R"
                            sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                          />
                        </RadioGroup>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">年</Typography>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">月</Typography>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">日</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* 1歳6か月 column */}
                    <TableCell sx={{ textAlign: 'center', padding: '4px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <RadioGroup row>
                          <FormControlLabel
                            value="heisei"
                            control={<Radio size="small" />}
                            label="H"
                            sx={{ mr: 0.5, '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                          />
                          <FormControlLabel
                            value="reiwa"
                            control={<Radio size="small" />}
                            label="R"
                            sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                          />
                        </RadioGroup>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">年</Typography>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">月</Typography>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">日</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* 3歳 column */}
                    <TableCell sx={{ textAlign: 'center', padding: '4px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <RadioGroup row>
                          <FormControlLabel
                            value="heisei"
                            control={<Radio size="small" />}
                            label="H"
                            sx={{ mr: 0.5, '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                          />
                          <FormControlLabel
                            value="reiwa"
                            control={<Radio size="small" />}
                            label="R"
                            sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                          />
                        </RadioGroup>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">年</Typography>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">月</Typography>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">日</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* 特記事項 column */}
                    <TableCell sx={{ padding: '4px' }}>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        sx={{
                          backgroundColor: 'white',
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#999' },
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* Row 1: 川崎病, 心臓病 */}
                  <TableRow>
                    <TableCell
                      rowSpan={9}
                      sx={{
                        backgroundColor: '#f5f5f5',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        writingMode: 'vertical-rl',
                        textOrientation: 'upright',
                        padding: '16px 8px',
                      }}
                    >
                      <Typography sx={{ letterSpacing: '12px' }}>既往症</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '8px', width: '8%' }}>
                      <Typography fontSize="0.9rem">川崎病</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.85rem">(</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">歳</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">か月)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell  sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">先天性股関節脱臼</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.85rem">(</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">歳</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">か月)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell rowSpan={2} sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">大きな外傷や手術</Typography>
                    </TableCell>
                    <TableCell rowSpan={2} sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography fontSize="0.85rem">(</Typography>
                          <TextField
                            fullWidth
                            size="small"
                            sx={{
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">)</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography fontSize="0.85rem">(</Typography>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">歳</Typography>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">か月)</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Row 2: 心臓病, ヘルニア */}
                  <TableRow>
                    <TableCell sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">心臓病</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.85rem">(</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">歳</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">か月)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell  sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">ヘルニア</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.85rem">(</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">歳</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">か月)</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Row 3: 腎臓病, 肺炎 */}
                  <TableRow>
                    <TableCell sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">腎臓病</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.85rem">(</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">歳</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">か月)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell  sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">肺炎</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.85rem">(</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">歳</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">か月)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell rowSpan={2}  sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">その他の重い病気</Typography>
                    </TableCell>
                    <TableCell rowSpan={2} sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography fontSize="0.85rem">(</Typography>
                          <TextField
                            fullWidth
                            size="small"
                            sx={{
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">)</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography fontSize="0.85rem">(</Typography>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">歳</Typography>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">か月)</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Row 4: 肝臓病, 自家中毒 */}
                  <TableRow>
                    <TableCell sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">肝臓病</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.85rem">(</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">歳</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">か月)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell  sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">自家中毒</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.85rem">(</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">歳</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">か月)</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Row 5: 麻しん, その他の重い病気 */}
                  <TableRow>
                    <TableCell sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">麻しん</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.85rem">(</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">歳</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">か月)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell  sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">脱臼の経験</Typography>
                    </TableCell>
                    <TableCell colSpan={3} sx={{ padding: '4px' }}>
                      <RadioGroup row>
                        <FormControlLabel
                          value="yes"
                          control={<Radio size="small" />}
                          label="有"
                          sx={{ mr: 1 }}
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio size="small" />}
                          label="無"
                        />
                      </RadioGroup>
                    </TableCell>
                  </TableRow>

                  {/* Row 6: 風しん, けいれん */}
                  <TableRow>
                    <TableCell sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">風しん</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.85rem">(</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">歳</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">か月)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell  sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">けいれん(ひきつけ)</Typography>
                    </TableCell>
                    <TableCell colSpan={3} sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <RadioGroup row>
                          <FormControlLabel
                            value="yes"
                            control={<Radio size="small" />}
                            label="有"
                            sx={{ mr: 1 }}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio size="small" />}
                            label="無"
                          />
                        </RadioGroup>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography fontSize="0.85rem">(有熱</Typography>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">回・無熱</Typography>
                          <TextField
                            size="small"
                            sx={{
                              width: '40px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">回)</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Row 7: 水痘, 初めてけいれんを起こした月齢 */}
                  <TableRow>
                    <TableCell sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">水痘</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.85rem">(</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">歳</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">か月)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell  sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">初めてけいれんを起こした月齢</Typography>
                    </TableCell>
                    <TableCell colSpan={3} sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.85rem">(</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">歳</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">か月)</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Row 8: 百日咳, 喘息の診断 */}
                  <TableRow>
                    <TableCell sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">百日咳</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.85rem">(</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">歳</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">か月)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell  sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">喘息の診断</Typography>
                    </TableCell>
                    <TableCell colSpan={3} sx={{ padding: '4px' }}>
                      <RadioGroup row>
                        <FormControlLabel
                          value="yes"
                          control={<Radio size="small" />}
                          label="有"
                          sx={{ mr: 1 }}
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio size="small" />}
                          label="無"
                        />
                      </RadioGroup>
                    </TableCell>
                  </TableRow>

                  {/* Row 9: 流行性耳下腺炎, アレルギーの診断 */}
                  <TableRow>
                    <TableCell sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">流行性耳下腺炎</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography fontSize="0.85rem">(</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">歳</Typography>
                        <TextField
                          size="small"
                          sx={{
                            width: '40px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: '#999' },
                            },
                          }}
                        />
                        <Typography fontSize="0.85rem">か月)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell  sx={{ padding: '8px' }}>
                      <Typography fontSize="0.9rem">アレルギーの診断</Typography>
                    </TableCell>
                    <TableCell colSpan={3} sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <RadioGroup row>
                          <FormControlLabel
                            value="yes"
                            control={<Radio size="small" />}
                            label="有"
                            sx={{ mr: 1 }}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio size="small" />}
                            label="無"
                          />
                        </RadioGroup>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
                          <Typography fontSize="0.85rem">(有の場合:</Typography>
                          <TextField
                            size="small"
                            sx={{
                              flex: 1,
                              minWidth: '100px',
                              backgroundColor: 'white',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#999' },
                              },
                            }}
                          />
                          <Typography fontSize="0.85rem">)</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <Grid container spacing={2} className='pt-5 pl-3'>
          <Grid item xs={12}>
            <TableContainer 
              component={Box} 
              sx={{ 
                border: '1px solid #000',
                overflow: 'auto'
              }}
            >
              <Table 
                sx={{ 
                  minWidth: 650,
                  '& .MuiTableCell-root': {
                    border: '1px solid #000',
                    borderCollapse: 'collapse'
                  }
                }} 
                size="small"
              >
                <TableHead>
                  <TableRow>
                    {/* Empty Cell - Top Left */}
                    <TableCell 
                      sx={{ 
                        width: '50px',
                        p: 0,
                        backgroundColor: '#f5f5f5'
                      }}
                    />

                    {/* Vertical Label - 現在の体質 */}
                    <TableCell 
                      align="center"
                      sx={{ 
                        p: 2,
                        backgroundColor: '#f5f5f5',
                      }}
                    >
                      <Typography sx={{ 
                        fontSize: '16px',
                        letterSpacing: '8px',
                        lineHeight: 1
                      }}>
                    
                      </Typography>
                    </TableCell>

                    {/* Column Headers */}
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        p: 1,
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      入所時
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        p: 1,
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      年度
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        p: 1,
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      年度
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        p: 1,
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      年度
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        p: 1,
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      年度
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        p: 1,
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      年度
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        p: 1,
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      年度
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* 現　在　の　体　質 */}
                  <TableRow>
                    <TableCell sx={{ p: 1, backgroundColor: 'white', fontSize: '0.9rem' }} rowSpan={9} align="center" >
                      現　在　の　体　質
                    </TableCell>
                    
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ p: 1, backgroundColor: 'white', fontSize: '0.9rem' }}>
                      かぜをひきやすい
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                  </TableRow>

                  {/* Row 2 - 発熱しやすい */}
                  <TableRow>
                    <TableCell sx={{ p: 1, backgroundColor: 'white', fontSize: '0.9rem' }}>
                      発熱しやすい
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                  </TableRow>

                  {/* Row 3 - 時々腹痛を訴える */}
                  <TableRow>
                    <TableCell sx={{ p: 1, backgroundColor: 'white', fontSize: '0.9rem' }}>
                      時々腹痛を訴える
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                  </TableRow>

                  {/* Row 4 - ゼイゼイがある */}
                  <TableRow>
                    <TableCell sx={{ p: 1, backgroundColor: 'white', fontSize: '0.9rem' }}>
                      ゼイゼイがある
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                  </TableRow>

                  {/* Row 5 - 湿疹ができやすい */}
                  <TableRow>
                    <TableCell sx={{ p: 1, backgroundColor: 'white', fontSize: '0.9rem' }}>
                      湿疹ができやすい
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                  </TableRow>

                  {/* Row 6 - 鼻血ができやすい */}
                  <TableRow>
                    <TableCell sx={{ p: 1, backgroundColor: 'white', fontSize: '0.9rem' }}>
                      鼻血ができやすい
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                  </TableRow>

                  {/* Row 7 - 中耳炎になりやすい */}
                  <TableRow>
                    <TableCell sx={{ p: 1, backgroundColor: 'white', fontSize: '0.9rem' }}>
                      中耳炎になりやすい
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                  </TableRow>

                  {/* Row 8 - 平熱 */}
                  <TableRow>
                    <TableCell sx={{ p: 1, backgroundColor: 'white', fontSize: '0.9rem' }}>
                      平　熱
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                        <Typography sx={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>℃</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                        <Typography sx={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>℃</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                        <Typography sx={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>℃</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                        <Typography sx={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>℃</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                        <Typography sx={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>℃</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                        <Typography sx={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>℃</Typography>
                      </Box>
                    </TableCell>   
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                        <Typography sx={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>℃</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Row 9 - 保育園で気をつけてほしいこと */}
                  <TableRow>
                    <TableCell colSpan={2}>
                      保育園で気をつけてほしいこと その他特記事項
                    </TableCell>
                    <TableCell colSpan={7} sx={{ p: 1, backgroundColor: 'white' }}>
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
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <Grid container spacing={2} className='pt-5 pl-3'>
          <Grid item xs={12}>
            <TableContainer 
              component={Box} 
              sx={{ 
                border: '1px solid #000',
                overflow: 'auto'
              }}
            >
              <Table 
                sx={{ 
                  minWidth: 650,
                  '& .MuiTableCell-root': {
                    border: '1px solid #000',
                    borderCollapse: 'collapse'
                  }
                }} 
                size="small"
              >
                <TableHead>
                  <TableRow>
                    {/* Empty Cell - Top Left */}
                    <TableCell 
                      sx={{ 
                        width: '80px',
                        p: 0,
                        backgroundColor: '#f5f5f5'
                      }}
                    />

                    {/* Column Headers with age groups */}
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        p: 1,
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>年度</Typography>
                        <Typography sx={{ fontSize: '0.85rem' }}>(0歳児)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        p: 1,
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>年度</Typography>
                        <Typography sx={{ fontSize: '0.85rem' }}>(0歳児)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        p: 1,
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>年度</Typography>
                        <Typography sx={{ fontSize: '0.85rem' }}>(1歳児)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        p: 1,
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>年度</Typography>
                        <Typography sx={{ fontSize: '0.85rem' }}>(2歳児)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        p: 1,
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>年度</Typography>
                        <Typography sx={{ fontSize: '0.85rem' }}>(3歳児)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        p: 1,
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>年度</Typography>
                        <Typography sx={{ fontSize: '0.85rem' }}>(4歳児)</Typography>
                      </Box>
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        p: 1,
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>年度</Typography>
                        <Typography sx={{ fontSize: '0.85rem' }}>(5歳児)</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* Row 1 - 主任 */}
                  <TableRow>
                    <TableCell 
                      align="center"
                      sx={{ 
                        p: 1, 
                        backgroundColor: 'white', 
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}
                    >
                      主任
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                  </TableRow>

                  {/* Row 2 - 担任 */}
                  <TableRow>
                    <TableCell 
                      align="center"
                      sx={{ 
                        p: 1, 
                        backgroundColor: 'white', 
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}
                    >
                      担任
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                    <TableCell sx={{ p: 1, backgroundColor: 'white' }}>
                      <TextField fullWidth size='small' sx={{ backgroundColor: "white", '& .MuiOutlinedInput-root': { '& fieldset': { border: '1px solid #ccc' } } }} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mt: 3,
            mb: 3,
          }}
        >
          <Button
            variant="outlined"
            color="warning"
            startIcon={<ArrowBack />}
            sx={{ px: 4, py: 1.5 }}
          >
            {t("overallplanadd.cancel")}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<Save />}
            sx={{
              px: 4,
              py: 1.5,
              background: "linear-gradient(45deg, #4caf50, #8bc34a)",
              "&:hover": {
                background: "linear-gradient(45deg, #388e3c, #689f38)",
              },
            }}
          >
            {t("overallplanadd.save")}
          </Button>
        </Box>            
      </ContentMain>
    </>
  );
}