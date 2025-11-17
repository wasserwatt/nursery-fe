import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Button,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  FormControl,
  MenuItem,
  OutlinedInput,
  Chip,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  Save,
  Description,
  ExpandMore,
  Info,
  ArrowBack,
  Favorite,
  EmojiEmotions,
  School,
  Close,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ContentMain from "../content/Content";
import { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import {
  useOverallPlan,
  ObjectiveAgeForm,
} from "../../contexts/OverallplanContext";
import { usePhilosophy } from "../../contexts/master/PhilosophyContext";
import { usePolicy, M_policy } from "../../contexts/master/PolicyContext";
import {
  useDevelopment_areas,
  M_development_areas,
} from "../../contexts/master/development_areasContext";
import { useSubarea, Subarea } from "../../contexts/master/SubareaContext";
import {
  useCompetencies,
  M_competencies,
} from "../../contexts/master/CompetenciesContext";
import {
  useFigures,
  M_ten_figures,
} from "../../contexts/master/FiguresContext";
import { useLocation, useParams } from "react-router-dom";

// THEME
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2", light: "#42a5f5", dark: "#1565c0" },
    secondary: { main: "#9c27b0", light: "#ba68c8", dark: "#7b1fa2" },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: "16px" } } },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: "20px", textTransform: "none", fontWeight: 600 },
      },
    },
  },
});

// TYPES
interface FormData {
  [key: string]: any;
  year: string;
  philosophy_detail: string;
  methods: M_policy[];
  child_vision: string;
  educator_vision: string;
  developmentAreas: M_development_areas[];
  developmentYougo: Subarea[];
  competencies: M_competencies[];
  goalSupport: string;
  providedSupport: string;
  abilitiesGoals: string[];
  abilitiesGoals2: string[];
  physical_mental_health: string;
  relationships_people: string;
  relationships_environment: string;
  respect_human_rights: string;
  respect_expression: string;
  guardian_support_collaboration: string;
  community_collaboration: string;
  school_connection: string;
  health_support: string;
  environment_sanitation_safety: string;
  food_education: string;
  neuvola_support: string;
  guardian_support: string;
  support_childcare: string;
}

interface RowData {
  id: number;
  month: string;
  gardenEvent: string;
  seasonalEvent: string;
  foodEducation: string;
  health: string;
  neuvola: string;
  staffTraining: string;
}

const AGE_GROUPS = ["0歳児", "1歳児", "2歳児", "3歳児", "4歳児", "5歳児"];

const INITIAL_ROWS: RowData[] = [
  {
    id: 1,
    month: "4月",
    gardenEvent: "",
    seasonalEvent: "",
    foodEducation: "",
    health: "",
    neuvola: "",
    staffTraining: "",
  },
  {
    id: 2,
    month: "5月",
    gardenEvent: "",
    seasonalEvent: "",
    foodEducation: "",
    health: "",
    neuvola: "",
    staffTraining: "",
  },
  {
    id: 3,
    month: "6月",
    gardenEvent: "",
    seasonalEvent: "",
    foodEducation: "",
    health: "",
    neuvola: "",
    staffTraining: "",
  },
  {
    id: 4,
    month: "7月",
    gardenEvent: "",
    seasonalEvent: "",
    foodEducation: "",
    health: "",
    neuvola: "",
    staffTraining: "",
  },
  {
    id: 5,
    month: "8月",
    gardenEvent: "",
    seasonalEvent: "",
    foodEducation: "",
    health: "",
    neuvola: "",
    staffTraining: "",
  },
  {
    id: 6,
    month: "9月",
    gardenEvent: "",
    seasonalEvent: "",
    foodEducation: "",
    health: "",
    neuvola: "",
    staffTraining: "",
  },
  {
    id: 7,
    month: "10月",
    gardenEvent: "",
    seasonalEvent: "",
    foodEducation: "",
    health: "",
    neuvola: "",
    staffTraining: "",
  },
  {
    id: 8,
    month: "11月",
    gardenEvent: "",
    seasonalEvent: "",
    foodEducation: "",
    health: "",
    neuvola: "",
    staffTraining: "",
  },
  {
    id: 9,
    month: "12月",
    gardenEvent: "",
    seasonalEvent: "",
    foodEducation: "",
    health: "",
    neuvola: "",
    staffTraining: "",
  },
  {
    id: 10,
    month: "1月",
    gardenEvent: "",
    seasonalEvent: "",
    foodEducation: "",
    health: "",
    neuvola: "",
    staffTraining: "",
  },
  {
    id: 11,
    month: "2月",
    gardenEvent: "",
    seasonalEvent: "",
    foodEducation: "",
    health: "",
    neuvola: "",
    staffTraining: "",
  },
  {
    id: 12,
    month: "3月",
    gardenEvent: "",
    seasonalEvent: "",
    foodEducation: "",
    health: "",
    neuvola: "",
    staffTraining: "",
  },
  {
    id: 13,
    month: "その他",
    gardenEvent: "",
    seasonalEvent: "",
    foodEducation: "",
    health: "",
    neuvola: "",
    staffTraining: "",
  },
];

const INITIAL_FORM_DATA: FormData = {
  year: "",
  philosophy_detail: "",
  child_vision: "",
  educator_vision: "",
  methods: [],
  competencies: [],
  developmentAreas: [],
  developmentYougo: [],
  goalSupport: "",
  providedSupport: "",
  abilitiesGoals: [],
  abilitiesGoals2: [],
  physical_mental_health: "",
  relationships_people: "",
  relationships_environment: "",
  respect_human_rights: "",
  respect_expression: "",
  guardian_support_collaboration: "",
  community_collaboration: "",
  school_connection: "",
  health_support: "",
  environment_sanitation_safety: "",
  food_education: "",
  neuvola_support: "",
  guardian_support: "",
  support_childcare: "",
};

// ---------- Reusable components (memoized) ----------

interface GoalSectionProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  goals: { checked: boolean; text: string }[];
  onGoalCheck: (index: number) => void;
}

const GoalSection: React.FC<GoalSectionProps> = ({
  title,
  icon,
  color,
  goals,
  onGoalCheck,
}) => (
  <Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      {icon}
      <Typography variant="h6" fontWeight="600">
        {title}
      </Typography>
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {goals.map((goal, index) => (
        <Paper
          key={index}
          elevation={1}
          sx={{
            p: 2,
            border: "2px solid",
            borderColor: goal.checked ? color : "grey.300",
            bgcolor: goal.checked ? `${color}20` : "white",
            transition: "all 0.2s",
            textAlign: "left",
            "&:hover": { borderColor: color, bgcolor: `${color}20` },
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={goal.checked}
                onChange={() => onGoalCheck(index)}
                sx={{ color, "&.Mui-checked": { color } }}
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <Box
                  sx={{
                    minWidth: 28,
                    height: 28,
                    borderRadius: "50%",
                    bgcolor: color,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                  }}
                >
                  {index + 1}
                </Box>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {goal.text}
                </Typography>
              </Box>
            }
          />
        </Paper>
      ))}
    </Box>
  </Box>
);
const MemoGoalSection = React.memo(GoalSection);

interface AgeTableProps {
  ageGroups: string[];
  tableData: Record<string, string>;
  color: string;
  onTableChange: (age: string, value: string) => void;
}

const AgeTable: React.FC<AgeTableProps> = ({
  ageGroups,
  tableData,
  color,
  onTableChange,
}) => {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto", mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: `${color}` }}>
            {ageGroups.map((age) => (
              <TableCell
                key={age}
                align="center"
                sx={{
                  fontWeight: "bold",
                  minWidth: 150,
                  border: `2px solid ${color}`,
                }}
              >
                {age}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {ageGroups.map((age) => (
              <TableCell
                key={age}
                sx={{ p: 1, border: "1px solid #e0e0e0", verticalAlign: "top" }}
              >
                <textarea
                  defaultValue={tableData ? tableData[age] : ""}
                  onBlur={(e) => onTableChange(age, e.target.value)}
                  placeholder="記入"
                  style={{
                    width: "100%",
                    height: "150px",
                    resize: "none",
                    overflowY: "auto",
                    padding: "8px",
                    fontSize: "0.875rem",
                    fontFamily: "Roboto, sans-serif",
                    borderRadius: "4px",
                    border: "1px solid #c4c4c4",
                  }}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
const MemoAgeTable = React.memo(AgeTable);

interface AbilitiesSelectProps {
  fieldName: "abilitiesGoals" | "abilitiesGoals2";
  value: string[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (event: SelectChangeEvent<string[]>) => void;
  onDelete: (value: string) => void;
  onClearAll: () => void;
  onSelectAll: () => void;
  abilityMaster: string[];
}

const AbilitiesSelect: React.FC<AbilitiesSelectProps> = ({
  fieldName,
  value,
  isOpen,
  onOpen,
  onClose,
  onChange,
  onDelete,
  onClearAll,
  onSelectAll,
  abilityMaster,
}) => (
  <FormControl fullWidth sx={{ mt: 2 }}>
    <Select
      multiple
      name={fieldName}
      value={value}
      onChange={onChange}
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      input={<OutlinedInput placeholder="เลือกทักษะที่ต้องการพัฒนา" />}
      renderValue={(selected) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {selected.map((val) => (
            <Chip
              key={val}
              label={val}
              onDelete={() => onDelete(val)}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
            />
          ))}
        </Box>
      )}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 1,
          p: 1,
          pb: 1.5,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                onSelectAll();
              }}
              disabled={value.length === abilityMaster.length}
            >
              เลือกทั้งหมด
            </Button>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onClearAll();
              }}
              disabled={value.length === 0}
            >
              ล้างทั้งหมด
            </Button>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            sx={{ bgcolor: "grey.200", "&:hover": { bgcolor: "grey.300" } }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      {abilityMaster.map((name) => (
        <MenuItem key={name} value={name}>
          <Checkbox checked={value.indexOf(name) > -1} />
          <ListItemText primary={name} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
const MemoAbilitiesSelect = React.memo(AbilitiesSelect);

// ---------- Annual row subcomponent (memoized) ----------
interface AnnualRowProps {
  row: RowData;
  onChange: (id: number, field: keyof RowData, value: string) => void;
  t: any;
}
const AnnualRow: React.FC<AnnualRowProps> = ({ row, onChange, t }) => {
  // onChange บน blur ให้เป็น sync update
  return (
    <TableRow key={row.id} hover>
      <TableCell>
        <TextField
          fullWidth
          size="small"
          defaultValue={row.month}
          onBlur={(e) => onChange(row.id, "month", e.target.value)}
          placeholder={t("overallplanadd.annual_month_placeholder")}
          variant="outlined"
        />
      </TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          multiline
          defaultValue={row.gardenEvent}
          onBlur={(e) => onChange(row.id, "gardenEvent", e.target.value)}
          placeholder={t("overallplanadd.annual_input_placeholder")}
          variant="outlined"
        />
      </TableCell>

      {/* ทำเหมือนกันกับคอลัมน์อื่น ๆ */}
      <TableCell>
        <TextField
          fullWidth
          size="small"
          multiline
          defaultValue={row.seasonalEvent}
          onBlur={(e) => onChange(row.id, "seasonalEvent", e.target.value)}
          placeholder={t("overallplanadd.annual_input_placeholder")}
          variant="outlined"
        />
      </TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          multiline
          defaultValue={row.foodEducation}
          onBlur={(e) => onChange(row.id, "foodEducation", e.target.value)}
          placeholder={t("overallplanadd.annual_input_placeholder")}
          variant="outlined"
        />
      </TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          multiline
          defaultValue={row.health}
          onBlur={(e) => onChange(row.id, "health", e.target.value)}
          placeholder={t("overallplanadd.annual_input_placeholder")}
          variant="outlined"
        />
      </TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          multiline
          defaultValue={row.neuvola}
          onBlur={(e) => onChange(row.id, "neuvola", e.target.value)}
          placeholder={t("overallplanadd.annual_input_placeholder")}
          variant="outlined"
        />
      </TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          multiline
          defaultValue={row.staffTraining}
          onBlur={(e) => onChange(row.id, "staffTraining", e.target.value)}
          placeholder={t("overallplanadd.annual_input_placeholder")}
          variant="outlined"
        />
      </TableCell>
    </TableRow>
  );
};
const MemoAnnualRow = React.memo(
  AnnualRow,
  (prevProps, nextProps) => prevProps.row === nextProps.row
);

// ---------- MAIN COMPONENT ----------
const OverallPlanAdd: React.FC = () => {
  const { t } = useTranslation();
  const {
    createOverallPlan,
    editOverallPlanMain,
    fetchOverallPlanById,
    fetchOverallPlanYear,
  } = useOverallPlan();
  const { fetchM_philosophy } = usePhilosophy();
  const { fetchM_policy } = usePolicy();
  const { fetchM_development_areas } = useDevelopment_areas();
  const { fetchSubareas } = useSubarea();
  const { fetchM_competencies } = useCompetencies();
  const { fetchM_ten_figures } = useFigures();

  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [rows, setRows] = useState<RowData[]>(INITIAL_ROWS);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    methods: true,
    goals: true,
    lifeGoals: true,
    socialGoals: true,
    healthGoals: true,
    relationshipGoals: true,
    languageGoals: true,
    developmentGoals: true,
    expressionGoals: true,
  });
  const [selectOpen, setSelectOpen] = useState({
    abilitiesGoals: false,
    abilitiesGoals2: false,
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMethodChange = (id: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      methods: prev.methods.map((m) =>
        m.id === id ? { ...m, policy_detail: value } : m
      ),
    }));
  };

  const handleGoalCheck = (
    key: string,
    index: number,
    text: string,
    NO: number
  ) => {
    setFormData((prev) => {
      const currentGoals: { checked: boolean; text: string; NO: number }[] =
        prev[key] ?? [];
      if (!currentGoals[index]) {
        currentGoals[index] = { text, checked: true, NO };
      } else {
        currentGoals[index].checked = !currentGoals[index].checked;
        currentGoals[index].NO = NO;
      }
      return { ...prev, [key]: currentGoals };
    });
  };

  const handleTableChange = (key: string, age: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? {}), [age]: value },
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMultiSelectChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value, name },
    } = event;
    setFormData((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleDeleteChip = (
    fieldName: "abilitiesGoals" | "abilitiesGoals2",
    valueToDelete: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter(
        (item: string) => item !== valueToDelete
      ),
    }));
  };

  const handleClearAll = (fieldName: "abilitiesGoals" | "abilitiesGoals2") => {
    setFormData((prev) => ({ ...prev, [fieldName]: [] }));
  };

  const handleSelectAll = (fieldName: "abilitiesGoals" | "abilitiesGoals2") => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [
        ...(abilitiesData[fieldName] || []).map((a: any) => a.title_snapshot),
      ],
    }));
  };

  // Improved updateRow: functional update to avoid re-rendering all rows
  const updateRow = useCallback(
    (id: number, field: keyof RowData, value: string) => {
      setRows((prev) => {
        const idx = prev.findIndex((r) => r.id === id);
        if (idx === -1) return prev;
        const newRows = [...prev];
        newRows[idx] = { ...newRows[idx], [field]: value } as RowData;
        return newRows;
      });
    },
    []
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const AGE_KEYS = ["0歳児", "1歳児", "2歳児", "3歳児", "4歳児", "5歳児"];
      const createObjectivesPayload = (
        formData: Record<string, any>
      ): ObjectiveAgeForm[] => {
        return Object.entries(formData)
          .map(([key, goalsOrTable]) => {
            if (isNaN(Number(key))) return null;
            const checkedTexts = (goalsOrTable as any[])
              .filter((goal: any) => goal.checked)
              .map((goal: any) => goal.text.trim())
              .join(" ");
            const ageTableKey = `ageTable_${key}`;
            const ageData = formData[ageTableKey] || {};
            const ageFields: Record<string, string> = {};
            AGE_KEYS.forEach((ageKey, idx) => {
              ageFields[`age${idx}`] = ageData[ageKey] || "";
            });
            return {
              title_id: Number(key),
              yougo_snapshot: checkedTexts,
              ...ageFields,
            };
          })
          .filter((item): item is ObjectiveAgeForm => Boolean(item));
      };

      const figuresPayload = [
        ...(abilitiesData.abilitiesGoals || [])
          .filter((a) => formData.abilitiesGoals?.includes(a.title_snapshot))
          .map((a) => ({
            ref_id: a.ref_id,
            type: "育みたい 資質・能力",
            title_snapshot: a.title_snapshot,
          })),
        ...(abilitiesData.abilitiesGoals2 || [])
          .filter((a) => formData.abilitiesGoals2?.includes(a.title_snapshot))
          .map((a) => ({
            ref_id: a.ref_id,
            type: "10の姿",
            title_snapshot: a.title_snapshot,
          })),
      ];

      const payload = {
        year: formData.year,
        child_vision: formData.child_vision,
        educator_vision: formData.educator_vision,
        philosophy_snapshot: formData.philosophy_detail,
        policies: formData.methods.map((m: any) => ({
          policy_master_id: m.id,
          policy_text_snap: m.policy_detail,
        })),
        objectives: createObjectivesPayload(formData),
        figures: figuresPayload,
        pillars: [
          {
            physical_mental_health: formData.physical_mental_health,
            relationships_people: formData.relationships_people,
            relationships_environment: formData.relationships_environment,
            respect_human_rights: formData.respect_human_rights,
            respect_expression: formData.respect_expression,
            guardian_support_collaboration:
              formData.guardian_support_collaboration,
            community_collaboration: formData.community_collaboration,
            school_connection: formData.school_connection,
          },
        ],
        practices: [
          {
            health_support: formData.health_support,
            environment_sanitation_safety:
              formData.environment_sanitation_safety,
            food_education: formData.food_education,
            neuvola_support: formData.neuvola_support,
            guardian_support: formData.guardian_support,
            support_childcare: formData.support_childcare,
          },
        ],
        schedule: rows.map((row) => ({
          month: row.month,
          event_school: row.gardenEvent,
          event_seasonal: row.seasonalEvent,
          food_education: row.foodEducation,
          health: row.health,
          neuvola: row.neuvola,
          staff_training: row.staffTraining,
        })),
      };

      delete (payload as any).methods;
      console.log("✅ Final Payload:", payload);

      if (id) await editOverallPlanMain(Number(id), payload);
      else await createOverallPlan(payload);

      alert("保存されました / บันทึกแล้ว");
    } catch (error) {
      console.error(error);
      alert("Error creating Overall Plan");
    }
  };

  // ---------- Load initial master data and (if edit) planData ----------
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          philosophies,
          policies,
          developmentAreas,
          developmentYougo,
          competencies,
          planData,
        ] = await Promise.all([
          fetchM_philosophy(),
          fetchM_policy(),
          fetchM_development_areas(),
          fetchSubareas(),
          fetchM_competencies(),
          isEdit && id
            ? fetchOverallPlanById(Number(id))
            : fetchOverallPlanYear(),
        ]);

        let newFormData: any = {
          ...INITIAL_FORM_DATA,
          philosophy_detail: philosophies?.[0]?.philosophy_detail || "",
          methods: policies.map((p) => ({
            id: p.id,
            policy_detail: p.policy_detail,
          })),
          developmentAreas: developmentAreas.map((area) => ({
            ...area,
            yougo: developmentYougo.filter(
              (y) => y.development_area_id === area.id
            ),
          })),
          competencies: competencies.map((c) => ({
            id: c.id,
            competencies_detail: c.competencies_detail,
          })),
        };

        if (planData) {
          const pillar = planData.pillars?.[0] || {};
          const practice = planData.practices?.[0] || {};
          const objectivesFormData: Record<string, any> = {};

          if (Array.isArray(planData.objectives)) {
            planData.objectives.forEach((o: any) => {
              const key = `${o.title_id}`;
              const yougosForTitle = developmentYougo.filter(
                (y: any) => y.title_id === o.title_id
              );
              objectivesFormData[key] = yougosForTitle.map((u: any) => {
                const backendGoal = Array.isArray(o.goals)
                  ? o.goals.find((g: any) => g.no_desc === u.no_desc)
                  : undefined;
                return {
                  checked: !!backendGoal?.checked,
                  NO: u.no_desc,
                  text: u.yougo_desc,
                };
              });
              const ageTableKey = `ageTable_${o.title_id}`;
              const ageTable: Record<string, string> = {};
              AGE_GROUPS.forEach((age, idx) => {
                ageTable[age] = o[`age${idx}`] ?? "";
              });
              objectivesFormData[ageTableKey] = ageTable;
            });
          }

          newFormData = {
            ...newFormData,
            year: isEdit && id ? planData.year : "",
            philosophy_detail:
              planData.philosophy_snapshot || newFormData.philosophy_detail,
            child_vision: planData.child_vision || "",
            educator_vision: planData.educator_vision || "",
            methods: planData.policies.map((p: any) => ({
              id: p.policy_master_id,
              policy_detail: p.policy_text_snap,
            })),
            abilitiesGoals: planData.figures
              .filter((f: any) => f.type === "育みたい 資質・能力")
              .map((f: any) => f.title_snapshot),
            abilitiesGoals2: planData.figures
              .filter((f: any) => f.type === "10の姿")
              .map((f: any) => f.title_snapshot),
            physical_mental_health: pillar.physical_mental_health || "",
            relationships_people: pillar.relationships_people || "",
            relationships_environment: pillar.relationships_environment || "",
            respect_human_rights: pillar.respect_human_rights || "",
            respect_expression: pillar.respect_expression || "",
            guardian_support_collaboration:
              pillar.guardian_support_collaboration || "",
            community_collaboration: pillar.community_collaboration || "",
            school_connection: pillar.school_connection || "",
            health_support: practice.health_support || "",
            environment_sanitation_safety:
              practice.environment_sanitation_safety || "",
            food_education: practice.food_education || "",
            neuvola_support: practice.neuvola_support || "",
            guardian_support: practice.guardian_support || "",
            support_childcare: practice.support_childcare || "",
            ...objectivesFormData,
          };

          setRows(
            (planData.schedule || []).map((s: any, index: number) => ({
              id: index + 1,
              month: s.month ?? `Month ${index + 1}`,
              gardenEvent: s.event_school || "",
              seasonalEvent: s.event_seasonal || "",
              foodEducation: s.food_education || "",
              health: s.health || "",
              neuvola: s.neuvola || "",
              staffTraining: s.staff_training || "",
            }))
          );
        }

        setFormData(newFormData);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };

    loadData();
  }, [id, isEdit]);

  // ---------- Preload missing goals + ageTable when developmentAreas exists ----------
  useEffect(() => {
    const areas = formData.developmentAreas;
    if (!areas || areas.length === 0) return;
    setFormData((prev) => {
      const updates: Record<string, any> = {};
      areas.forEach((area) => {
        const titleIds = Array.from(
          new Set(area.yougo.map((y: any) => y.title_id))
        );
        titleIds.forEach((tid) => {
          const key = `${tid}`;
          if (!(prev as any)[key] && !updates[key]) {
            const yougosForTitle = area.yougo.filter(
              (u: any) => u.title_id === tid
            );
            updates[key] = yougosForTitle.map((u: any) => ({
              checked: false,
              NO: u.no_desc,
              text: u.yougo_desc,
            }));
          }
          const tableKey = `ageTable_${tid}`;
          if (!(prev as any)[tableKey] && !updates[tableKey]) {
            const defaultTable: Record<string, string> = {};
            AGE_GROUPS.forEach((age) => {
              defaultTable[age] = "";
            });
            updates[tableKey] = defaultTable;
          }
        });
      });
      if (Object.keys(updates).length === 0) return prev;
      return { ...prev, ...updates };
    });
  }, [formData.developmentAreas]);

  // ---------- Abilities data loader (keeps previous behavior but safe) ----------
  const [abilitiesData, setAbilitiesData] = useState<{
    abilitiesGoals?: { ref_id: number; title_snapshot: string }[];
    abilitiesGoals2?: { ref_id: number; title_snapshot: string }[];
  }>({});
  useEffect(() => {
    const loadAbilities = async () => {
      try {
        const abilityConfigMap: Record<
          number,
          {
            api: () => Promise<any[]>;
            fieldName: "abilitiesGoals" | "abilitiesGoals2";
          }
        > = {
          1: { api: fetchM_competencies, fieldName: "abilitiesGoals" },
          2: { api: fetchM_ten_figures, fieldName: "abilitiesGoals2" },
        };

        // collect unique area.ids
        const areaIds = Array.from(
          new Set(formData.developmentAreas.map((a: any) => a.id))
        );
        for (const id of areaIds) {
          const config = abilityConfigMap[id];
          if (!config) continue;
          const data = await config.api();
          const items =
            config.fieldName === "abilitiesGoals"
              ? (data as M_competencies[]).map((d) => ({
                  ref_id: d.id,
                  title_snapshot: d.competencies_detail,
                }))
              : (data as M_ten_figures[]).map((d) => ({
                  ref_id: d.id,
                  title_snapshot: d.ten_detail,
                }));
          setAbilitiesData((prev) => ({ ...prev, [config.fieldName]: items }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (formData.developmentAreas.length > 0) loadAbilities();
  }, [formData.developmentAreas]);

  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const toggleAccordion = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const titleIds = Array.from(
    new Set(
      formData.developmentAreas.flatMap((area: any) =>
        area.yougo.map((y: any) => y.title_id)
      )
    )
  );
  const titleIconMap: Record<number, JSX.Element> = {
    1: <Favorite />,
    2: <EmojiEmotions />,
    3: <EmojiEmotions />,
    4: <Favorite />,
    5: <School />,
    6: <School />,
    7: <EmojiEmotions />,
  };
  const titleColorMap: Record<number, string> = {};
  titleIds.forEach((id, idx) => {
    const hue = Math.floor((idx * 360) / Math.max(1, titleIds.length));
    titleColorMap[id] = `hsl(${hue}, 50%, 60%)`;
  });
  const location = useLocation();
  const isViewMode = location.pathname.includes("/view/");
  // ---------- RENDER ----------
  return (
    <ThemeProvider theme={theme}>
      <ContentMain
        className={`flex flex-col min-h-screen ${
          isViewMode ? "view-mode" : ""
        }`}
      >
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <School sx={{ fontSize: 40, color: "primary.main" }} />
              <Typography variant="h4" fontWeight="700" color="primary">
                {t("overallplanadd.childcareplan")}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save />}
              onClick={handleSubmit}
              sx={{ px: 4, py: 1.5 }}
            >
              {t("overallplanadd.save")}
            </Button>
          </Box>

          <TextField
            key={formData.year} // 🔑 เพิ่ม key ให้ component remount
            fullWidth
            size="small"
            label={t("overallplanadd.year_period")}
            defaultValue={formData.year}
            onBlur={(e) => handleInputChange("year", e.target.value)}
            placeholder={t("overallplanadd.year_placeholder")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Basic */}
        <Accordion
          expanded={expandedSections.basic}
          onChange={() => toggleSection("basic")}
          sx={{ mb: 2, border: "2px solid #ff9800" }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Info color="warning" />
              <Typography variant="h6" fontWeight="600">
                {t("overallplanadd.basic")}
              </Typography>
              <Tooltip title={t("overallplanadd.situation_placeholder")}>
                <Info color="info" fontSize="small" />
              </Tooltip>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              multiline
              rows={5}
              defaultValue={formData.philosophy_detail}
              onBlur={(e) =>
                handleInputChange("philosophy_detail", e.target.value)
              }
              placeholder={t("overallplanadd.situation_placeholder2")}
            />
          </AccordionDetails>
        </Accordion>

        {/* Methods */}
        <Accordion
          expanded={expandedSections.methods}
          onChange={() => toggleSection("methods")}
          sx={{ mb: 2, border: "2px solid #2196f3" }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Info color="primary" />
              <Typography variant="h6" fontWeight="600">
                {t("overallplanadd.methods")}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {formData.methods.map((method, index) => (
                <Grid item xs={12} md={6} key={method.id}>
                  <TextField
                    fullWidth
                    label={`Method ${index + 1}`}
                    defaultValue={method.policy_detail}
                    onBlur={(e) =>
                      handleMethodChange(method.id, e.target.value)
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.target_child")}
                </Typography>
                <TextField
                  key={formData.child_vision}
                  defaultValue={formData.child_vision}
                  onBlur={(e) =>
                    handleInputChange("child_vision", e.target.value)
                  }
                  fullWidth
                  placeholder={t("overallplanadd.target_child_placeholder")}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.target_teacher")}
                </Typography>
                <TextField
                  key={formData.educator_vision}
                  fullWidth
                  defaultValue={formData.educator_vision}
                  onBlur={(e) =>
                    handleInputChange("educator_vision", e.target.value)
                  }
                  placeholder={t("overallplanadd.target_teacher_placeholder")}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Development Areas (Goals + AgeTable + AbilitiesSelect) */}
        {formData.developmentAreas.map((area: M_development_areas) => {
          const abilityConfigMap: Record<
            number,
            {
              title: string;
              fieldName: "abilitiesGoals" | "abilitiesGoals2";
              openKey: "abilitiesGoals" | "abilitiesGoals2";
            }
          > = {
            1: {
              title: "育みたい 資質・能力",
              fieldName: "abilitiesGoals",
              openKey: "abilitiesGoals",
            },
            2: {
              title: "10の姿",
              fieldName: "abilitiesGoals2",
              openKey: "abilitiesGoals2",
            },
          };
          const abilityConfig = abilityConfigMap[area.id];

          return (
            <Accordion
              key={area.id}
              expanded={expanded[area.code] ?? true}
              onChange={() => toggleAccordion(area.code)}
              sx={{
                mb: 2,
                border: `2px solid ${
                  area.code === "CARE" ? "#e91e63" : "#ec407a"
                }`,
                borderRadius: 2,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Favorite sx={{ color: "#e91e63" }} />
                  <Typography variant="h6">
                    {area.name_ja} {area.name_en}
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                {Array.from(
                  new Map(area.yougo.map((y) => [y.title_id, y])).values()
                ).map((y) => {
                  const yougosForTitle = area.yougo.filter(
                    (u) => u.title_id === y.title_id
                  );
                  const sharedColor = titleColorMap[y.title_id];
                  const iconElement = titleIconMap[y.title_id]
                    ? React.cloneElement(titleIconMap[y.title_id], {
                        sx: { color: sharedColor },
                      })
                    : null;
                  const key = `${y.title_id}`;
                  const ageTableKey = `ageTable_${y.title_id}`;

                  return (
                    <React.Fragment key={y.title_id}>
                      <MemoGoalSection
                        title={y.title}
                        goals={formData[key] ?? []}
                        icon={iconElement}
                        color={sharedColor}
                        onGoalCheck={(index) =>
                          handleGoalCheck(
                            key,
                            index,
                            yougosForTitle[index].yougo_desc,
                            yougosForTitle[index].no_desc
                          )
                        }
                      />

                      <MemoAgeTable
                        ageGroups={AGE_GROUPS}
                        tableData={formData[ageTableKey] ?? {}}
                        color={sharedColor}
                        onTableChange={(age, value) =>
                          handleTableChange(ageTableKey, age, value)
                        }
                      />
                    </React.Fragment>
                  );
                })}

                {abilityConfig && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                      {abilityConfig.title}
                    </Typography>

                    <MemoAbilitiesSelect
                      fieldName={abilityConfig.fieldName}
                      value={formData[abilityConfig.fieldName]}
                      isOpen={selectOpen[abilityConfig.openKey]}
                      onOpen={() =>
                        setSelectOpen((prev) => ({
                          ...prev,
                          [abilityConfig.openKey]: true,
                        }))
                      }
                      onClose={() =>
                        setSelectOpen((prev) => ({
                          ...prev,
                          [abilityConfig.openKey]: false,
                        }))
                      }
                      onChange={handleMultiSelectChange}
                      onDelete={(value) =>
                        handleDeleteChip(abilityConfig.fieldName, value)
                      }
                      onClearAll={() => handleClearAll(abilityConfig.fieldName)}
                      onSelectAll={() =>
                        handleSelectAll(abilityConfig.fieldName)
                      }
                      abilityMaster={(
                        abilitiesData[abilityConfig.fieldName] || []
                      ).map((a) => a.title_snapshot)}
                    />
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}

        {/* Focus section */}
        <Accordion
          expanded={expandedSections.goals}
          onChange={() => toggleSection("goals")}
          sx={{ mb: 2, border: "2px solid #4caf50" }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <EmojiEmotions color="success" />
              <Typography variant="h6" fontWeight="600">
                {t("overallplanadd.focus_section")}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {/* many TextField controls converted to uncontrolled (defaultValue + onBlur) */}
              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.health_mind_body")}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  defaultValue={formData.physical_mental_health}
                  onBlur={(e) =>
                    handleInputChange("physical_mental_health", e.target.value)
                  }
                  rows={2}
                  placeholder={t("overallplanadd.health_mind_body_placeholder")}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.relations_close_people")}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  defaultValue={formData.relationships_people}
                  onBlur={(e) =>
                    handleInputChange("relationships_people", e.target.value)
                  }
                  rows={2}
                  placeholder={t(
                    "overallplanadd.relations_close_people_placeholder"
                  )}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.relations_environment_nearby")}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  defaultValue={formData.relationships_environment}
                  onBlur={(e) =>
                    handleInputChange(
                      "relationships_environment",
                      e.target.value
                    )
                  }
                  placeholder={t(
                    "overallplanadd.relations_environment_nearby_placeholder"
                  )}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.human_rights_respect")}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  defaultValue={formData.respect_human_rights}
                  onBlur={(e) =>
                    handleInputChange("respect_human_rights", e.target.value)
                  }
                  placeholder={t(
                    "overallplanadd.human_rights_respect_placeholder"
                  )}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.expression_respect")}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  defaultValue={formData.respect_expression}
                  onBlur={(e) =>
                    handleInputChange("respect_expression", e.target.value)
                  }
                  placeholder={t(
                    "overallplanadd.expression_respect_placeholder"
                  )}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.parent_support_cooperation")}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  defaultValue={formData.guardian_support_collaboration}
                  onBlur={(e) =>
                    handleInputChange(
                      "guardian_support_collaboration",
                      e.target.value
                    )
                  }
                  placeholder={t("overallplanadd.parent_support_placeholder")}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.community_cooperation")}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  defaultValue={formData.community_collaboration}
                  onBlur={(e) =>
                    handleInputChange("community_collaboration", e.target.value)
                  }
                  rows={2}
                  placeholder={t(
                    "overallplanadd.community_cooperation_placeholder"
                  )}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.primary_connection")}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  defaultValue={formData.school_connection}
                  onBlur={(e) =>
                    handleInputChange("school_connection", e.target.value)
                  }
                  rows={2}
                  placeholder={t(
                    "overallplanadd.primary_connection_placeholder"
                  )}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Concrete actions (kept similar) */}
        <Accordion
          expanded={expandedSections.goals}
          onChange={() => toggleSection("goals")}
          sx={{ mb: 2, border: "2px solid #4caf50" }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <EmojiEmotions color="success" />
              <Typography variant="h6" fontWeight="600">
                {t("overallplanadd.concrete_actions")}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.health_support")}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  defaultValue={formData.health_support}
                  onBlur={(e) =>
                    handleInputChange("health_support", e.target.value)
                  }
                  rows={6}
                  placeholder={t("overallplanadd.health_mind_body_placeholder")}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.env_hygiene_safety_mgmt")}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  defaultValue={formData.environment_sanitation_safety}
                  onBlur={(e) =>
                    handleInputChange(
                      "environment_sanitation_safety",
                      e.target.value
                    )
                  }
                  rows={6}
                  placeholder={t(
                    "overallplanadd.relations_close_people_placeholder"
                  )}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.food_education_promotion")}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  defaultValue={formData.food_education}
                  onBlur={(e) =>
                    handleInputChange("food_education", e.target.value)
                  }
                  rows={6}
                  placeholder={t(
                    "overallplanadd.relations_environment_nearby_placeholder"
                  )}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.neuvola_integrated_support")}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  defaultValue={formData.neuvola_support}
                  onBlur={(e) =>
                    handleInputChange("neuvola_support", e.target.value)
                  }
                  rows={6}
                  placeholder={t(
                    "overallplanadd.human_rights_respect_placeholder"
                  )}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.parent_support_cooperation_alt")}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  defaultValue={formData.guardian_support}
                  onBlur={(e) =>
                    handleInputChange("guardian_support", e.target.value)
                  }
                  rows={6}
                  placeholder={t(
                    "overallplanadd.expression_respect_placeholder"
                  )}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography fontWeight="bold" sx={{ mb: 2, textAlign: "left" }}>
                  {t("overallplanadd.supportive_childcare")}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  defaultValue={formData.support_childcare}
                  onBlur={(e) =>
                    handleInputChange("support_childcare", e.target.value)
                  }
                  rows={6}
                  placeholder={t("overallplanadd.parent_support_placeholder")}
                  sx={{ "& .MuiInputBase-input": { fontSize: 14 } }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Annual schedule */}
        <Accordion
          expanded={expandedSections.goals}
          onChange={() => toggleSection("goals")}
          sx={{ mb: 2, border: "2px solid #4caf50" }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <EmojiEmotions color="success" />
              <Typography variant="h6" fontWeight="600">
                {t("overallplanadd.annual_plan")}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        bgcolor: "#e8f5e9",
                        minWidth: 100,
                      }}
                    >
                      {t("overallplanadd.annual_col_month")}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        bgcolor: "#e8f5e9",
                        minWidth: 200,
                      }}
                    >
                      {t("overallplanadd.annual_col_school_events")}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        bgcolor: "#e8f5e9",
                        minWidth: 190,
                      }}
                    >
                      {t("overallplanadd.annual_col_seasonal_events")}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        bgcolor: "#e8f5e9",
                        minWidth: 190,
                      }}
                    >
                      {t("overallplanadd.annual_col_food_education")}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        bgcolor: "#e8f5e9",
                        minWidth: 170,
                      }}
                    >
                      {t("overallplanadd.annual_col_health")}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        bgcolor: "#e8f5e9",
                        minWidth: 170,
                      }}
                    >
                      {t("overallplanadd.annual_col_neuvola")}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        bgcolor: "#e8f5e9",
                        minWidth: 200,
                      }}
                    >
                      {t("overallplanadd.annual_col_staff_training")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <MemoAnnualRow
                      key={row.id}
                      row={row}
                      onChange={updateRow}
                      t={t}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>

        {/* Footer */}
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
            onClick={handleSubmit}
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
    </ThemeProvider>
  );
};

export default OverallPlanAdd;
