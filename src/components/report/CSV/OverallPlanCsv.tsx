import { M_development_areas } from "contexts/master/development_areasContext";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const templatePath = "/report/OverallPlan.xlsx";

interface AnnualRowType {
  gardenEvent: string;
  seasonalEvent: string;
  foodEducation: string;
  health: string;
  neuvola: string;
  staffTraining: string;
}
// ฟังก์ชันแยกข้อและเรียงลำดับ
function splitAndSort(value: any): string {
  if (!value) return "";

  const str = String(value);

  // แยกส่วน “ข้อความยาวก่อนหัวข้อ ①”
  // สมมติว่าเริ่มหัวข้อ numbered ด้วย ①
  const splitIndex = str.indexOf("①");
  const preText = splitIndex >= 0 ? str.slice(0, splitIndex).trim() : "";
  const numberedText = splitIndex >= 0 ? str.slice(splitIndex).trim() : "";

  // แยกหัวข้อ numbered และ bullet
  const items = numberedText
    .split(/(?=①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩)/)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

  // เรียงหัวข้อ ①②③… (เผื่อไม่เรียง)
  const orderMap: Record<string, number> = {
    "①": 1,
    "②": 2,
    "③": 3,
    "④": 4,
    "⑤": 5,
    "⑥": 6,
    "⑦": 7,
    "⑧": 8,
    "⑨": 9,
    "⑩": 10,
  };
  items.sort((a, b) => (orderMap[a[0]] || 999) - (orderMap[b[0]] || 999));

  // รวมข้อความทั้งหมด
  const result = [preText, ...items].filter((v) => v).join("\n\n");
  return result;
}

function setAnnualRows(ws: any, startRow: number, rows: AnnualRowType[]) {
  rows.forEach((row, i) => {
    const rowIndex = startRow + i * 3; // เพิ่มทีละ 2
    const columns = ["BO", "BY", "CI", "CS", "DC", "DM"];
    const values = [
      row.gardenEvent,
      row.seasonalEvent,
      row.foodEducation,
      row.health,
      row.neuvola,
      row.staffTraining,
    ];

    columns.forEach((col, j) => {
      const cell = ws.getCell(`${col}${rowIndex}`);
      cell.value = values[j];
    });
  });
}

export const handleExcel = async (formData: any, _rows: any[]) => {
  const workbook = new ExcelJS.Workbook();

  const file = await fetch(templatePath);
  if (!file.ok)
    throw new Error(
      `Cannot load template: ${file.status} (${file.statusText})`
    );

  const arrayBuffer = await file.arrayBuffer();
  if (arrayBuffer.byteLength === 0)
    throw new Error("Template file is empty or invalid");

  await workbook.xlsx.load(arrayBuffer);

  const ws = workbook.getWorksheet("2022");
  if (!ws) throw new Error("Worksheet not found");
  ws.getCell("E1").value = formData.philosophy_detail;
  // map method index → cell
  const methodCellMap: Record<number, string> = {
    0: "AJ1", // ข้อ 1
    1: "AJ2", // ข้อ 2
    2: "AJ3", // ข้อ 3
    3: "CB1", // ข้อ 4
    4: "CB2", // ข้อ 5
    5: "CB3", // ข้อ 6
  };

  formData.methods.forEach((method: any, index: number) => {
    const cell = methodCellMap[index];
    if (cell) {
      ws.getCell(cell).value = `${index + 1}. ${method.policy_detail}`;
    }
  });

  ws.getCell("K4").value = formData.child_vision;
  ws.getCell("BV4").value = formData.educator_vision;

  formData.developmentAreas
    .filter((area: { code: string }) => area.code === "CARE")
    .forEach((area: M_development_areas) => {
      const seenTitles = new Set<string>();
      let rowIndex = 7;

      area.yougo.forEach((y) => {
        if (seenTitles.has(y.title)) return;
        seenTitles.add(y.title);

        const key = `${y.title_id}`;
        const selectedYougos = (formData[key] ?? [])
          .filter((obj: { checked: boolean }) => obj.checked)
          .map((obj: { text: string }) => obj.text);

        const yougoText = selectedYougos.join("\n");

        ws.getCell(`I${rowIndex}`).value = yougoText;
        const ageTableKey = `ageTable_${y.title_id}`;
        const ageData = formData[ageTableKey] ?? {};
        const categories = [
          { startCol: "AH", endCol: "AU" },
          { startCol: "AV", endCol: "BI" },
          { startCol: "BJ", endCol: "BW" },
          { startCol: "BX", endCol: "CK" },
          { startCol: "CL", endCol: "CY" },
          { startCol: "CZ", endCol: "DM" },
        ];
        const ageKeys = Object.keys(ageData);
        categories.forEach((cat, i) => {
          const ageKey = ageKeys[i];
          const text = ageKey ? ageData[ageKey] : "";
          const cell = ws.getCell(`${cat.startCol}${rowIndex}`);
          cell.value = text;
        });
        const abilityConfigMap: Record<
          number,
          {
            title: string;
            fieldName: "abilitiesGoals" | "abilitiesGoals2";
            openKey: "abilitiesGoals" | "abilitiesGoals2";
            cell: string; // <--- เพิ่มตำแหน่งเซลล์ที่ต้องการ
          }
        > = {
          1: {
            title: "育みたい 資質・能力",
            fieldName: "abilitiesGoals",
            openKey: "abilitiesGoals",
            cell: "DN7",
          },
        };

        const config = abilityConfigMap[area.id];
        if (!config) return;
        const abilityValues = formData[config.fieldName] || [];
        const uniqueValues = Array.from(
          new Set(abilityValues.map((v: any) => v.title_snapshot || v))
        );

        // 2) เซ็ตค่าไปเซลล์ที่กำหนดใน config.cell
        const cell = ws.getCell(config.cell);
        cell.value = uniqueValues.join("\n");
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        rowIndex += 4;
      });
    });

  formData.developmentAreas
    .filter((area: { code: string }) => area.code === "EDU")
    .forEach((area: M_development_areas) => {
      const seenTitles = new Set<string>();
      let rowIndex = 16;

      // ---------- 1) เขียนส่วน yougo ----------
      area.yougo.forEach((y) => {
        if (seenTitles.has(y.title)) return;
        seenTitles.add(y.title);

        const key = `${y.title_id}`;
        const selectedYougos = (formData[key] ?? [])
          .filter((obj: { checked: boolean }) => obj.checked)
          .map((obj: { text: string }) => obj.text);

        const yougoText = selectedYougos.join("\n");
        ws.getCell(`I${rowIndex}`).value = yougoText;

        const ageTableKey = `ageTable_${y.title_id}`;
        const ageData = formData[ageTableKey] ?? {};

        const categories = [
          { startCol: "AH", endCol: "AU" },
          { startCol: "AV", endCol: "BI" },
          { startCol: "BJ", endCol: "BW" },
          { startCol: "BX", endCol: "CK" },
          { startCol: "CL", endCol: "CY" },
          { startCol: "CZ", endCol: "DM" },
        ];

        const ageKeys = Object.keys(ageData);
        categories.forEach((cat, i) => {
          const ageKey = ageKeys[i];
          const text = ageKey ? ageData[ageKey] : "";
          const cell = ws.getCell(`${cat.startCol}${rowIndex}`);
          cell.value = text;
        });
        rowIndex += 5; // <--- เลื่อนแถวของ yougo ตามปกติ
      });

      // ---------- 2) เขียนส่วน abilities (10の姿) ----------
      if (area.id === 2) {
        const abilityValues = formData["abilitiesGoals2"] || [];
        const uniqueValues = Array.from(
          new Set(abilityValues.map((v: any) => v.title_snapshot || v))
        );

        const cell = ws.getCell("DN16");
        cell.value = uniqueValues.join("\n");
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
      }
    });

  const mapping = {
    C43: formData.physical_mental_health,
    S43: formData.relationships_people,
    AI43: formData.relationships_environment,
    AY43: formData.respect_human_rights,
    BO43: formData.respect_expression,
    CE43: formData.guardian_support_collaboration,
    CU43: formData.community_collaboration,
    DK43: formData.school_connection,
  };

  Object.entries(mapping).forEach(([cell, value]) => {
    ws.getCell(cell).value = value ?? "";
  });

  const excelMap = [
    ["C47", splitAndSort(formData.health_support)],
    ["C59", splitAndSort(formData.environment_sanitation_safety)],
    ["C68", formData.food_education],
    ["C75", splitAndSort(formData.neuvola_support)],
    ["C84", splitAndSort(formData.guardian_support)],
    ["BN47", splitAndSort(formData.support_childcare)],
  ];

  excelMap.forEach(([cell, value]) => {
    ws.getCell(cell).value = value;
  });

  setAnnualRows(ws, 55, _rows);

  const buf = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buf]), "OverallPlan.xlsx");
};
