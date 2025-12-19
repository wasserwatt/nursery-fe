import { useEffect, useState, ChangeEvent } from 'react';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import ContentMain from '../content/Content';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate } from 'react-router-dom';
import { useChildren } from "../../contexts/childrenContext";

interface Column {
  id: 'name' | 'classroom' | 'date' | 'timestart' | 'timeend' | 'detail';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'name', label: '氏名', minWidth: 150 },
  { id: 'classroom', label: '歳児', minWidth: 100 }, // อายุตอนเข้า
  {
    id: 'date',
    label: 'クラス名',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'timestart',
    label: '歳児保育経過記録',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'timeend',
    label: '保育所児童保育要録',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'detail',
    label: '',
    minWidth: 100,
    align: 'right',
  },
];

export default function Student() {
  const [classroom, setClassroom] = useState('');
  const [classroom1, setClassroom1] = useState('');
  const [searchText, setSearchText] = useState('');
  
  // State สำหรับเก็บข้อมูลที่ดึงมาจาก API
  const [rows, setRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  
  const { fetchChild } = useChildren();
  const navigate = useNavigate();

  // ฟังก์ชันคำนวณปีงบประมาณ (Fiscal Year)
  // ญี่ปุ่นเริ่มปีการศึกษาเดือน 4 (เมษา)
  // ถ้าเดือนเกิด < 3 (ม.ค, ก.พ, มี.ค) ให้นับเป็นปีงบประมาณก่อนหน้า
  const getFiscalYear = (dateStr: string) => {
    if (!dateStr) return 0;
    const d = new Date(dateStr);
    // เดือนใน JS เริ่ม 0-11 (0=Jan, 2=Mar, 3=Apr)
    // ถ้าเกิดก่อน 1 เมษา (เดือน 0, 1, 2) ถือว่าเป็นรุ่นปีก่อนหน้า
    if (d.getMonth() < 3) {
      return d.getFullYear() - 1;
    }
    return d.getFullYear();
  };

  // ดึงข้อมูลเมื่อโหลดหน้าเว็บ
  useEffect(() => {
    const loadData = async () => {
      const children = await fetchChild();
      if (children) {
        const formattedRows = children.map((child: any) => {
          // คำนวณอายุตอนเข้า (Entrance Age Class)
          // สูตร: ปีงบประมาณที่เข้า - ปีงบประมาณเกิด
          // เช่น เกิด 2020 เข้า 2021 = 1 ขวบ (ตอนเข้า)
          const birthFY = getFiscalYear(child.birthDate);
          const adminFY = getFiscalYear(child.admissionDate);
          const ageClass = adminFY - birthFY;

          return {
            ...child, // เก็บข้อมูลดิบไว้ใช้ส่งต่อ
            name: child.name_child,
            classroom: `${ageClass >= 0 ? ageClass : 0} 歳児`, // แสดงอายุตอนเข้า
            date: 'ぱんだ', // ตัวอย่าง Class (ยังไม่มีใน DB ให้ใส่ Mock หรือดึงจาก field อื่น)
            
            // Icon ตามที่ขอให้แสดงเฉยๆ
            timestart: (
              <IconButton aria-label="progress" size="small" component={Link} to="/student/progressdthree">
                <StackedBarChartIcon fontSize="small" className='text-red-600' />
              </IconButton>
            ),
            timeend: (
              <IconButton aria-label="daycare" size="small" component={Link} to="/student/daycare">
                <AssignmentIcon fontSize="medium" className='text-cyan-500' />
              </IconButton>
            ),
            // ปุ่มจัดการ
            detail: (
              <>
                {/* ปุ่มแก้ไข (ส่ง state ไปหน้า History) */}
                <IconButton 
                  aria-label="edit" 
                  size="small" 
                  component={Link} 
                  to={`/student/History/edit/?id=${child.childId}`}
                >
                  <EditIcon fontSize="small" className='text-sky-600' />
                </IconButton>
                
                {/* ปุ่มดู (ส่ง state ไปหน้า History เหมือนกัน) */}
                <IconButton 
                  aria-label="view" 
                  size="small"
                  component={Link} 
                  to={`/student/History/view/?id=${child.childId}`}
                >
                  <RemoveRedEyeIcon fontSize="small" className='text-amber-500' />
                </IconButton>
                
                <IconButton aria-label="delete" size="small" >
                  <DeleteIcon fontSize="small" className='text-red-600' />
                </IconButton>
              </>
            )
          };
        });
        setRows(formattedRows);
        setFilteredRows(formattedRows);
      }
    };
    loadData();
  }, [fetchChild, navigate]);

  const handleClassroomChange = (event: SelectChangeEvent) => {
    setClassroom(event.target.value as string);
  };

  const handleClassroom1Change = (event: SelectChangeEvent) => {
    setClassroom1(event.target.value as string);
  };

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  // Filter Logic
  useEffect(() => {
    let updatedRows = rows;

    if (searchText) {
      updatedRows = updatedRows.filter(row =>
        row.name.includes(searchText)
      );
    }
    if (classroom) {
      updatedRows = updatedRows.filter(row =>
        row.classroom === classroom
      );
    }
    if (classroom1) {
      updatedRows = updatedRows.filter(row =>
        row.date === classroom1
      );
    }

    setFilteredRows(updatedRows);
  }, [searchText, classroom, classroom1, rows]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <ContentMain>
      <Grid container spacing={2} className='pt-7' justifyContent="center">
        <Typography component="div" style={{ color: 'black' }} className='pt-6'>
          氏名
        </Typography>
        <Grid item xs={8} sm={12} md={2} lg={2}>
          <TextField
            id="outlined-search"
            label=""
            type="search"
            size="small"
            value={searchText}
            onChange={handleSearchTextChange}
            sx={{bgcolor: 'white'}}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={2} style={{ textAlign: 'center' }}>
          <FormControl sx={{ minWidth: 100 }} size="small" fullWidth>
            <InputLabel id="classroom-select-label">歳児</InputLabel>
            <Select
              labelId="classroom-select-label"
              id="classroom-select"
              value={classroom}
              label="歳児"
              onChange={handleClassroomChange}
              sx={{bgcolor: 'white'}}
            >
              <MenuItem value="0 歳児">0</MenuItem>
              <MenuItem value="1 歳児">1</MenuItem>
              <MenuItem value="2 歳児">2</MenuItem>
              <MenuItem value="3 歳児">3</MenuItem>
              <MenuItem value="4 歳児">4</MenuItem>
              <MenuItem value="5 歳児">5</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4} sm={4} md={2} style={{ textAlign: 'center' }}>
          <FormControl sx={{ minWidth: 100 }} size="small" fullWidth>
            <InputLabel id="classroom1-select-label">クラス名</InputLabel>
            <Select
              labelId="classroom1-select-label"
              id="classroom1-select"
              value={classroom1}
              label="クラス名"
              onChange={handleClassroom1Change}
              sx={{bgcolor: 'white'}}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="うさぎ">うさぎ</MenuItem>
              <MenuItem value="くま">くま</MenuItem>
              <MenuItem value="ぱんだ">ぱんだ</MenuItem>
              <MenuItem value="かめ">かめ</MenuItem>
              <MenuItem value="りす">りす</MenuItem>
              <MenuItem value="とり">とり</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Button variant="contained" className='scale-90'>
            <Typography component="div" style={{ color: 'white', paddingLeft: '10px' }}>
              検索する
            </Typography>
          </Button>
        </Grid>
      </Grid>
      <Grid container direction="row" justifyContent="end" alignItems="end" style={{ paddingTop: '20px' }} className='mt-3'>
        <Button variant="contained" component={Link} to="/student/History" className='scale-90' size="small">
          <Typography component="div" style={{ color: 'white', paddingLeft: '10px' }}>
            Add
          </Typography>
        </Button>
      </Grid>
      <Grid container spacing={2} className='pt-10' justifyContent="center">
        <Paper sx={{ width: '95%', overflow: 'hidden' }} className='ms-4'>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.childId || index}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </ContentMain>
  );
}