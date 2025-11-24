import ExcelJS from "exceljs"; 
import { saveAs } from "file-saver";

export const handleExcel = async (formData: any, rows: any[]) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Sheet1");

  const startCol = "A";
  const endCol = "DV";

  function colToNumber(col: string) {
    let num = 0;
    for (let i = 0; i < col.length; i++) {
      num = num * 26 + (col.charCodeAt(i) - 64);
    }
    return num;
  }

  // ตั้ง width column
  for (let i = colToNumber(startCol); i <= colToNumber(endCol); i++) {
    ws.getColumn(i).width = 1.6;
  }

  // ตั้ง height row 1–3
  for (let i = 1; i <= 3; i++) {
    ws.getRow(i).height = 37.5;
  }

  // header “保育理念”
  const text = "保育理念";
  const verticalText = text.split("").join("\n");

 

  let startRow = 1;

  // คำนวณ row ของข้อสุดท้าย
  const lastIndex = formData.methods.length - 1;
  const lastPairIndex = Math.floor(lastIndex / 2);
  const lastRow = startRow + lastPairIndex;

  // merge header “保育理念” จาก A1 → D ของข้อสุดท้าย
  ws.mergeCells(`A1:D${lastRow}`);
  ws.getCell("A1").value = verticalText;
  ws.getCell("A1").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  ws.getCell("A1").fill  = { type: "pattern", pattern: "solid",fgColor: { argb: "FFD9D9D9" }, };
  ws.getCell("A1").border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

  // header “philosophy_detail”
  ws.mergeCells(`E1:AE${lastRow}`);
  ws.getCell("E1").value = `${formData.philosophy_detail}`;
  ws.getCell("E1").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  ws.getCell("E1").font = { color: { argb: "FFFF0000" } };
  ws.getCell("E1").border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

  // header “保育方針”
  const text2 = "保育方針";
  const verticalText2 = text2.split("").join("\n");
  ws.mergeCells(`AF1:AI${lastRow}`);
  ws.getCell("AF1").value = verticalText2;
  ws.getCell("AF1").alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  ws.getCell("AF1").fill  = { type: "pattern", pattern: "solid",fgColor: { argb: "FFD9D9D9" }, };
  ws.getCell("AF1").border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

  // จำนวน row สำหรับวาดกรอบครบ ถึงข้อสูงสุด
  const totalRows = lastRow;

  // วาง Methods + ช่องว่างกรอบ
const maxIndex = Math.max(formData.methods.length, totalRows * 2);
for (let index = 0; index < maxIndex; index++) {
  const pairIndex = Math.floor(index / 2);
  const row = startRow + pairIndex;
  const isOdd = (index + 1) % 2 === 1; // คี่/คู่
  const startColMethod = isOdd ? "AJ" : "CB";
  const endColMethod = isOdd ? "CA" : "DV";

  // merge cell
  ws.mergeCells(`${startColMethod}${row}:${endColMethod}${row}`);

  const cell = ws.getCell(`${startColMethod}${row}`);
  if (index < formData.methods.length) {
    // ใส่ข้อความข้อจริง
    const method = formData.methods[index];
    cell.value = `${index + 1}. ${method.policy_detail}`;
    cell.font = { color: { argb: "FFFF0000" } };
  } else {
    // ช่องว่างตีกรอบ
    cell.value = "";
  }

  cell.alignment = {vertical: "middle"};
  cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
  ws.getRow(row).height = 37.5;
}

// --- นำแถว "目指す子ども像" ออกมาข้างนอก loop ---
const targetRow = lastRow + 1;
ws.mergeCells(`A${targetRow}:J${targetRow}`);
ws.getCell(`A${targetRow}`).value = "目指す子ども像";
ws.getCell(`A${targetRow}`).alignment = { vertical: "middle", horizontal: "center" ,wrapText: true };
ws.getCell(`A${targetRow}`).fill  = { type: "pattern", pattern: "solid",fgColor: { argb: "FFD9D9D9" }, };
ws.getCell(`A${targetRow}`).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

ws.mergeCells(`K${targetRow}:BK${targetRow}`);
ws.getCell(`K${targetRow}`).value = `${formData.child_vision}`;
ws.getCell(`K${targetRow}`).alignment = { vertical: "middle", horizontal: "center",wrapText: true };
ws.getCell(`K${targetRow}`).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

ws.mergeCells(`BL${targetRow}:BU${targetRow}`);
ws.getCell(`BL${targetRow}`).value = "望まれる保育者像";
ws.getCell(`BL${targetRow}`).alignment = { vertical: "middle", horizontal: "center" ,wrapText: true };
ws.getCell(`BL${targetRow}`).fill  = { type: "pattern", pattern: "solid",fgColor: { argb: "FFD9D9D9" }, };
ws.getCell(`BL${targetRow}`).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

ws.mergeCells(`BV${targetRow}:DV${targetRow}`);
ws.getCell(`BV${targetRow}`).value = `${formData.educator_vision}`;
ws.getCell(`BV${targetRow}`).alignment = { vertical: "middle", horizontal: "center",wrapText: true };
ws.getCell(`BV${targetRow}`).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

ws.getRow(targetRow).height = 18;

const targetRow2 = targetRow + 1;
let a = 42;
let b = 11;
const totalOddMethods = Math.ceil(formData.methods.length / 2); 
a += totalOddMethods;
b += totalOddMethods;

ws.mergeCells(`A${targetRow2}:B${a}`);

const text3 = "保育";
const verticalText3 = text3.split("").join("\n");

const cell3 = ws.getCell(`A${targetRow2}`);
cell3.value = verticalText3;
cell3.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
cell3.fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD9D9D9" }, // สี #D9D9D9
};
cell3.border = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};
ws.mergeCells(`C${targetRow2}:DM${targetRow2}`);
const cell4 = ws.getCell(`C${targetRow2}`);
cell4.value = "ね ら い 及 び 内 容";
cell4.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
cell4.fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD9D9D9" }, // สี #D9D9D9
};
cell4.border = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};
ws.getRow(targetRow2).height = 23.5;


const targetRow3 = targetRow2 + 1;
ws.mergeCells(`DN${targetRow2}:DV${targetRow3}`);
const cell5 = ws.getCell(`DN${targetRow2}`);
cell5.value = "育みたい\n資質・能力";
cell5.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
cell5.fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD9D9D9" }, // สี #D9D9D9
};
cell5.border = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

const text4 = "保育";
const verticalText4 = text4.split("").join("\n");
ws.mergeCells(`C${targetRow3}:D${b}`);
const cell6 = ws.getCell(`C${targetRow3}`);
cell6.value = verticalText4;
cell6.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
cell6.fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD9D9D9" }, // สี #D9D9D9
};
cell6.border = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

ws.mergeCells(`E${targetRow3}:AG${targetRow3}`);
const cell7 = ws.getCell(`E${targetRow3}`);
cell7.value = "保育所保育指針に定めるねらい";
cell7.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
cell7.fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD9D9D9" }, // สี #D9D9D9
};
cell7.border = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

const categories = [
  { label: "0歳児", startCol: "AH", endCol: "AU" },
  { label: "1歳児", startCol: "AV", endCol: "BI" },
  { label: "2歳児", startCol: "BJ", endCol: "BW" },
  { label: "3歳児", startCol: "BX", endCol: "CK" },
  { label: "4歳児", startCol: "CL", endCol: "CY" },
  { label: "5歳児", startCol: "CZ", endCol: "DM" },
];

categories.forEach(cat => {
  ws.mergeCells(`${cat.startCol}${targetRow3}:${cat.endCol}${targetRow3}`);
  const cell = ws.getCell(`${cat.startCol}${targetRow3}`);
  cell.value = cat.label;
  cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9D9D9" }, // สี #D9D9D9
  };
  cell.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
});

ws.getRow(targetRow3).height = 23.5;

const targetRow4 = targetRow3 + 1;


  // สร้างไฟล์ Excel
  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), "OverallPlan.xlsx");
};
