import {
  Button,
  Checkbox,
  FormControl,
  Box,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  InputLabel,
  TableHead,
  Autocomplete, // ✅ เพิ่ม Autocomplete
} from "@mui/material";
import ContentMain from "../../content/Content";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Loading from "../../Loading";
import { useEffect, useState, useRef, useMemo } from "react";
import { ArrowBack, Save } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useChildren, ChildData } from "../../../contexts/childrenContext";
import { useM_clinics } from "../../../contexts/master/M_clinicsContext";
import { useM_feeding } from "../../../contexts/master/M_feedingContext";
import { useM_vaccine } from "../../../contexts/master/M_vaccineContext";
import { useM_disease } from "../../../contexts/master/M_diseaseContext";
import { useSearchParams, useLocation,useNavigate } from "react-router-dom";

export default function StudentHistory() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [familyMemberCounter, setFamilyMemberCounter] = useState(1);

  const [birthCondition, setBirthCondition] = useState("normal");
  const [birthDetails, setBirthDetails] = useState<string[]>([]);
  const [birthOther, setBirthOther] = useState("");
  const [searchOptions, setSearchOptions] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const targetId = searchParams.get("id");

  const location = useLocation();
  const isViewMode = location.pathname.includes("/view");

  const { createchild, getChildById, searchChildByName } = useChildren();
  const { fetchclinics } = useM_clinics();
  const { fetchfeeding } = useM_feeding();
  const { fetchvaccine } = useM_vaccine();
  const { fetchdiseases } = useM_disease();

  const formDataRef = useRef<Partial<ChildData>>({});
  const debounceRef = useRef<any>(null);
  const [loadedData, setLoadedData] = useState<ChildData | null>(null);

  const [familyMembers, setFamilyMembers] = useState<any[]>([{ id: 1 }]);

  const [filterYear, setFilterYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [filterAge, setFilterAge] = useState<string>("");

  const handleFuriganaChange = (_event: any, newInputValue: string) => {
    handleChange({ target: { name: "furigana", value: newInputValue } } as any);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!newInputValue.trim()) {
        setSearchOptions([]);
        return;
      }

      try {
        const results = await searchChildByName(newInputValue);
        setSearchOptions(results);
      } catch (error) {
        console.error(error);
      }
    }, 500);
  };

  const handleSelectChild = async (childId: number | string) => {
    try {
      const data = await getChildById(childId.toString());
      if (data) {
        // console.log("Loaded Child Data:", data);
        setLoadedData(data);
        formDataRef.current = data;

        if (data.guardians && data.guardians.length > 0) {
          setFamilyMembers(data.guardians);
        } else {
          setFamilyMembers([{ id: 1 }]);
        }
      }
    } catch (error) {
      console.error("Error loading child details:", error);
    } finally {
    }
  };

  const handleNameSelect = (_event: any, newValue: any) => {
    if (newValue && newValue.childId) {
      handleSelectChild(newValue.childId);
    } else {
      const currentFurigana = formDataRef.current.furigana || "";
      const resetData = { furigana: currentFurigana } as ChildData;
      setLoadedData(resetData);
      formDataRef.current = resetData;
      setFamilyMembers([{ id: 1 }]);
      setBirthCondition("normal");
      setBirthDetails([]);
      setBirthOther("");
    }
  };
  // -----------------------------------------------------

  // ... (Master Data Loading Logic - เหมือนเดิม) ...
  const [clinicMaster, setClinicMaster] = useState<any[]>([]);
  const [feedingMaster, setFeedingMaster] = useState<any[]>([]);
  const [vaccineMaster, setVaccineMaster] = useState<any[]>([]);
  const [diseaseMaster, setDiseaseMaster] = useState<any[]>([]);

  useEffect(() => {
    const loadMasters = async () => {
      // ... (โค้ดโหลด Master Data เดิม ใส่ไว้ที่นี่) ...
      try {
        const clinicData = await fetchclinics();
        if (clinicData) {
          const clinicOrder = ["PED", "INT", "SUR", "DEN"];
          const getClinicScore = (code: string) => {
            if (code === "OTH") return 999;
            const index = clinicOrder.indexOf(code);
            return index !== -1 ? index : 100;
          };
          setClinicMaster(
            clinicData.sort(
              (a: any, b: any) =>
                getClinicScore(a.clinicTypeCode) -
                getClinicScore(b.clinicTypeCode)
            )
          );
        }
        const feedingData = await fetchfeeding();
        if (feedingData) {
          const feedingOrder = ["BM", "MIX", "FM"];
          setFeedingMaster(
            feedingData.sort((a: any, b: any) => {
              const indexA = feedingOrder.indexOf(a.feedingTypeCode);
              const indexB = feedingOrder.indexOf(b.feedingTypeCode);
              return (
                (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB)
              );
            })
          );
        }
        const vaccineData = await fetchvaccine();
        if (vaccineData) {
          const vaccineMeta: Record<string, { count: number; order: number }> =
            {
              HEPB: { count: 3, order: 1 },
              BCG: { count: 1, order: 2 },
              DPTIPV: { count: 4, order: 3 },
              ROTA: { count: 3, order: 4 },
              HIB: { count: 4, order: 5 },
              PCV: { count: 4, order: 6 },
              MR1: { count: 1, order: 7 },
              MR2: { count: 1, order: 8 },
              VAR: { count: 2, order: 9 },
              JEV: { count: 4, order: 10 },
            };
          const mergedVaccines = vaccineData.map((v: any) => {
            const meta = vaccineMeta[v.vaccineCode] || { count: 1, order: 99 };
            return {
              ...v,
              count: meta.count,
              order: meta.order,
              name: v.vaccineNameJp,
              code: v.vaccineCode,
            };
          });
          setVaccineMaster(
            mergedVaccines.sort((a: any, b: any) => a.order - b.order)
          );
        }
        const diseaseData = await fetchdiseases();
        if (diseaseData) setDiseaseMaster(diseaseData);
      } catch (error) {
        console.error("Failed to fetch master data", error);
      }
    };
    loadMasters();
  }, []);

  // Load Child from URL ID
  useEffect(() => {
    const loadChildData = async () => {
      if (targetId) {
        setLoading(true);
        // ... (Logic เดิม) ...
        try {
          const data = await getChildById(targetId);
          if (data) {
            setLoadedData(data);
            formDataRef.current = data;
            if (data.guardians && data.guardians.length > 0) {
              setFamilyMembers(data.guardians);
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    loadChildData();
  }, [targetId]);

  // Sync Birth Info
  useEffect(() => {
    if (loadedData?.birthInfo) {
      const info = loadedData.birthInfo;
      setBirthCondition(info.neonatalAbnormal ? "abnormal" : "normal");
      const newDetails: string[] = [];
      if (info.neonatalAsphyxia) newDetails.push("仮死");
      if (info.neonatalSeizure) newDetails.push("けいれん");
      if (info.neonatalStrongJaundice) newDetails.push("強い黄疸");
      if (info.neonatalRespiratoryAbnormality) newDetails.push("呼吸異常");
      if (info.neonatalMetabolicDisorder) newDetails.push("先天性代謝異常");
      if (info.neonatalIssueOther) {
        newDetails.push("その他");
        setBirthOther(info.neonatalIssueOther);
      } else {
        setBirthOther("");
      }
      setBirthDetails(newDetails);
    }
  }, [loadedData]);

  // ... (Helper Functions & Handlers เดิม) ...
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (isViewMode) return;
    const { name, value } = e.target;
    formDataRef.current = { ...formDataRef.current, [name]: value };
  };
  const handleRadioChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (isViewMode) return;
    formDataRef.current = { ...formDataRef.current, [e.target.name]: value };
  };
  const addFamilyMember = () => {
    if (isViewMode) return;
    const newId = familyMemberCounter + 1;
    setFamilyMemberCounter(newId);
    setFamilyMembers([...familyMembers, { id: newId }]);
  };
  const removeFamilyMember = (id: number) => {
    if (isViewMode) return;
    if (familyMembers.length <= 1) return;
    if (window.confirm("この家族メンバーを削除してもよろしいですか？")) {
      setFamilyMembers(familyMembers.filter((member) => member.id !== id));
    }
  };
  // Helper Functions
  const getJapaneseDateParts = (
    isoDateString: string | null | undefined,
    type: "year" | "month" | "day"
  ) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return "";
    if (type === "year") {
      const year = date.getFullYear();
      if (year >= 2019) return (year - 2018).toString();
      if (year >= 1989) return (year - 1988).toString();
      return (year - 1925).toString();
    }
    if (type === "month") return (date.getMonth() + 1).toString();
    if (type === "day") return date.getDate().toString();
    return "";
  };
  const convertToISO = (
    era: string,
    year: string,
    month: string,
    day: string
  ) => {
    if (!year || !month || !day) return null;
    let y = parseInt(year);
    const m = parseInt(month) - 1;
    const d = parseInt(day);
    if (era === "R" || era === "reiwa" || era === "令和") y += 2018;
    else if (era === "H" || era === "heisei" || era === "平成") y += 1988;
    else if (era === "S" || era === "showa" || era === "昭和") y += 1925;
    const date = new Date(Date.UTC(y, m, d, 0, 0, 0));
    return date.toISOString();
  };
  // Getter Helpers
  const getVaccineDate = (code: string, dose: number) => {
    if (!loadedData?.vaccinations) return "";
    const record = loadedData.vaccinations.find(
      (v) => v.vaccineCode === code && v.doseNo === dose
    );
    return record?.vaccinatedDate ? record.vaccinatedDate.slice(0, 10) : "";
  };
  const getClinicTel = (typeCode: string) => {
    if (!loadedData?.clinics) return "";
    const found = loadedData.clinics.find((c) => c.clinicType === typeCode);
    return found ? found.tel : "";
  };
  const getHealthCheckData = (checkType: string) => {
    if (!loadedData?.healthChecks)
      return { year: "", month: "", day: "", era: "reiwa", note: "" };
    const check = loadedData.healthChecks.find(
      (c) => c.checkType === checkType
    );
    if (!check || !check.checkDate)
      return { year: "", month: "", day: "", era: "reiwa", note: "" };
    const date = new Date(check.checkDate);
    const y = date.getFullYear();
    const era = y >= 2019 ? "reiwa" : "heisei";
    const jpYear = y >= 2019 ? y - 2018 : y - 1988;
    return {
      year: jpYear.toString(),
      month: (date.getMonth() + 1).toString(),
      day: date.getDate().toString(),
      era: era,
      note: check.note || "",
    };
  };
  const getPastDisease = (code: string) => {
    if (!loadedData?.pastDiseases)
      return { ageYear: "", ageMonth: "", freeName: "" };
    const d = loadedData.pastDiseases.find((pd) => pd.diseaseCode === code);
    return {
      ageYear:
        d?.ageYear !== null && d?.ageYear !== undefined
          ? d.ageYear.toString()
          : "",
      ageMonth:
        d?.ageMonth !== null && d?.ageMonth !== undefined
          ? d.ageMonth.toString()
          : "",
      freeName: d?.freeName || "",
    };
  };
  const getHealthItem = (typeCode: string) => {
    if (!loadedData?.healthItems) return { value: "no", note: "" };
    const item = loadedData.healthItems.find((i) => i.type === typeCode);
    return { value: item?.hasItem ? "yes" : "no", note: item?.note || "" };
  };
  const getSeizureData = () => {
    const defaultData = {
      hasSeizure: "no",
      withFever: "",
      withoutFever: "",
      ageYear: "",
      ageMonth: "",
    };
    if (
      !loadedData?.seizureHistories ||
      loadedData.seizureHistories.length === 0
    )
      return defaultData;
    const s = loadedData.seizureHistories[0];
    return {
      hasSeizure: s.hasSeizure ? "yes" : "no",
      withFever: s.withFeverCount?.toString() || "",
      withoutFever: s.withoutFeverCount?.toString() || "",
      ageYear: s.firstAgeYear?.toString() || "",
      ageMonth: s.firstAgeMonth?.toString() || "",
    };
  };

  const startFiscalYear = (() => {
    if (!loadedData?.birthDate) return new Date().getFullYear();
    const dob = new Date(loadedData.birthDate);
    if (dob.getMonth() < 3 || (dob.getMonth() === 3 && dob.getDate() === 1)) {
      return dob.getFullYear() - 1;
    }
    return dob.getFullYear();
  })();

  const constitutionColumns = (() => {
    const histories = loadedData?.constitutionHistories || [];
    const admission = histories.find((h) => h.entryPeriod === "入所時");
    const others = histories
      .filter((h) => h.entryPeriod !== "入所時")
      .sort(
        (a, b) =>
          parseInt(a.entryPeriod || "0") - parseInt(b.entryPeriod || "0")
      );
    const result = [admission, ...others];
    while (result.length < 7) {
      result.push(undefined);
    }
    return result.slice(0, 7);
  })();
  const getConstValue = (colIndex: number, key: string) => {
    const data = constitutionColumns[colIndex];
    if (!data) return "";
    const val = data[key];
    if (typeof val === "boolean") return val ? "〇" : "";
    return val || "";
  };
  const getTeacher = (age: number, role: "TN" | "HN") => {
    if (!loadedData?.teacherAssigns) return "";
    const record = loadedData.teacherAssigns.find(
      (t) => t.ageClass === age && t.roleCode === role
    );
    return record?.staffName || "";
  };
  const ageColumns = [0, 1, 2, 3, 4, 5];

  const handleSave = async () => {
    // ... (Save Logic เดิม) ...
    // Copy paste logic from previous message
    if (isViewMode) return;
    const birthDateISO = convertToISO(
      getValue("eraName", loadedData?.eraName),
      getValue(
        "birthYear",
        getJapaneseDateParts(loadedData?.birthDate, "year")
      ),
      getValue(
        "birthMonth",
        getJapaneseDateParts(loadedData?.birthDate, "month")
      ),
      getValue("birthDay", getJapaneseDateParts(loadedData?.birthDate, "day"))
    );
    const admissionDateISO = convertToISO(
      "R",
      getValue(
        "admissionYear",
        getJapaneseDateParts(loadedData?.admissionDate, "year")
      ),
      getValue(
        "admissionMonth",
        getJapaneseDateParts(loadedData?.admissionDate, "month")
      ),
      getValue(
        "admissionDay",
        getJapaneseDateParts(loadedData?.admissionDate, "day")
      )
    );
    const currentBirthDateISO = birthDateISO;
    let calculatedStartFY = new Date().getFullYear();
    if (currentBirthDateISO) {
      const dob = new Date(currentBirthDateISO);
      if (dob.getMonth() < 3 || (dob.getMonth() === 3 && dob.getDate() === 1)) {
        calculatedStartFY = dob.getFullYear() - 1;
      } else {
        calculatedStartFY = dob.getFullYear();
      }
    }
    const saveData = {
      child: {
        childId: loadedData?.childId || undefined,
        name_child: getValue("name_child", loadedData?.name_child),
        furigana: getValue("furigana", loadedData?.furigana),
        gender: getValue("gender", loadedData?.gender),
        eraName: getValue("eraName", loadedData?.eraName),
        bloodType: getValue("bloodType", loadedData?.bloodType),
        birthDate: birthDateISO || loadedData?.birthDate,
        admissionDate: admissionDateISO || loadedData?.admissionDate,
        graduationDate: null,
        healthLedgerFlag: true,
        healthCardFlag: true,
        addresses: [0, 1, 2]
          .map((idx) => {
            const defaultFullAddress = `${
              loadedData?.addresses?.[idx]?.city || ""
            }${loadedData?.addresses?.[idx]?.ward || ""}${
              loadedData?.addresses?.[idx]?.addressDetail || ""
            }`;
            const fullAddressInput = getValue(
              `addresses_${idx}_addressDetail`,
              defaultFullAddress
            );
            let cityVal = "福岡市";
            let wardVal = "";
            let detailVal = fullAddressInput;
            if (fullAddressInput) {
              let tempAddr = fullAddressInput.trim();
              if (tempAddr.startsWith("福岡市")) {
                cityVal = "福岡市";
                tempAddr = tempAddr.replace("福岡市", "");
              }
              const wardIndex = tempAddr.indexOf("区");
              if (wardIndex !== -1) {
                wardVal = tempAddr.substring(0, wardIndex + 1);
                detailVal = tempAddr.substring(wardIndex + 1).trim();
              } else {
                detailVal = tempAddr;
              }
            }
            return {
              postalCode: getValue(
                `addresses_${idx}_postalCode`,
                loadedData?.addresses?.[idx]?.postalCode
              ),
              city: cityVal,
              ward: wardVal,
              addressDetail: detailVal,
              tel: getValue(
                `addresses_${idx}_tel`,
                loadedData?.addresses?.[idx]?.tel
              ),
              schoolArea: getValue(
                `addresses_${idx}_schoolArea`,
                loadedData?.addresses?.[idx]?.schoolArea
              ),
              isCurrent: idx === 0,
            };
          })
          .filter((a) => a.postalCode || a.addressDetail),
        guardians: familyMembers.map((member, idx) => {
          const bYear = getValue(
            `guardians_${idx}_birthYear`,
            getJapaneseDateParts(member.birthDate, "year")
          );
          const bMonth = getValue(
            `guardians_${idx}_birthMonth`,
            getJapaneseDateParts(member.birthDate, "month")
          );
          const bDay = getValue(
            `guardians_${idx}_birthDay`,
            getJapaneseDateParts(member.birthDate, "day")
          );
          const era = getValue(`guardians_${idx}_era`, "H");
          return {
            guardianId: member.guardianId || undefined,
            name_guardian: getValue(
              `guardians_${idx}_name_guardian`,
              member.name_guardian
            ),
            relation: getValue(`guardians_${idx}_relation`, member.relation),
            birthDate:
              convertToISO(era, bYear, bMonth, bDay) || member.birthDate,
            workplace: getValue(`guardians_${idx}_workplace`, member.workplace),
            workplaceAddress: getValue(
              `guardians_${idx}_workplaceAddress`,
              member.workplaceAddress
            ),
            workplaceTel: getValue(
              `guardians_${idx}_workplaceTel`,
              member.workplaceTel
            ),
            mobile: getValue(`guardians_${idx}_mobile`, member.mobile),
            isPrimary: idx === 0,
          };
        }),
        commutes: [
          {
            commuteId: loadedData?.commutes?.[0]?.commuteId || undefined,
            method: getValue("method", loadedData?.commutes?.[0]?.method),
            note: getValue("note", loadedData?.commutes?.[0]?.note),
          },
        ],
        clinics: clinicMaster
          .map((c) => ({
            clinicId: c.clinicId,
            clinicType: c.clinicTypeCode,
            tel: getValue(
              `clinics_${c.clinicTypeCode}_tel`,
              getClinicTel(c.clinicTypeCode)
            ),
          }))
          .filter((c) => c.tel),
        birthInfo: {
          pregnancyAbnormal: getValue("pregnancyAbnormal") === "abnormal",
          pregnancyIssueNote: getValue(
            "pregnancyIssueNote",
            loadedData?.birthInfo?.pregnancyIssueNote
          ),
          pregnancyWeeks: parseInt(
            getValue("pregnancyWeeks", loadedData?.birthInfo?.pregnancyWeeks) ||
              "0"
          ),
          birthOrder: parseInt(
            getValue("birthOrder", loadedData?.birthInfo?.birthOrder) || "1"
          ),
          deliveryAbnormal: getValue("deliveryAbnormal") === "abnormal",
          deliveryIssueNote: getValue(
            "deliveryIssueNote",
            loadedData?.birthInfo?.deliveryIssueNote
          ),
          birthWeightG: parseInt(
            getValue("birthWeightG", loadedData?.birthInfo?.birthWeightG) || "0"
          ),
          neonatalAbnormal: birthCondition === "abnormal",
          neonatalAsphyxia: birthDetails.includes("仮死"),
          neonatalSeizure: birthDetails.includes("けいれん"),
          neonatalStrongJaundice: birthDetails.includes("強い黄疸"),
          neonatalRespiratoryAbnormality: birthDetails.includes("呼吸異常"),
          neonatalMetabolicDisorder: birthDetails.includes("先天性代謝異常"),
          neonatalIssueOther: birthDetails.includes("その他")
            ? getValue("neonatalIssueOther", birthOther)
            : null,
        },
        infantDev: {
          feedingTypeCode: getValue(
            "feedingTypeCode",
            loadedData?.infantDev?.feedingTypeCode
          ),
          weaningStartMonth: parseInt(
            getValue(
              "weaningStartMonth",
              loadedData?.infantDev?.weaningStartMonth
            ) || "0"
          ),
          weaningCompleteMonth: parseInt(
            getValue(
              "weaningCompleteMonth",
              loadedData?.infantDev?.weaningCompleteMonth
            ) || "0"
          ),
          neckHoldMonth: parseInt(
            getValue("neckHoldMonth", loadedData?.infantDev?.neckHoldMonth) ||
              "0"
          ),
          crawlingMonth: parseInt(
            getValue("crawlingMonth", loadedData?.infantDev?.crawlingMonth) ||
              "0"
          ),
          walkingYears: parseInt(
            getValue("walkingYears", loadedData?.infantDev?.walkingYears) || "0"
          ),
          walkingMonth: parseInt(
            getValue("walkingMonth", loadedData?.infantDev?.walkingMonth) || "0"
          ),
          firstWordsMonth: parseInt(
            getValue(
              "firstWordsMonth",
              loadedData?.infantDev?.firstWordsMonth
            ) || "0"
          ),
        },
        healthChecks: ["4か月", "10か月", "1歳6か月", "3歳"]
          .map((type) => {
            const existing = getHealthCheckData(type);
            const era = getValue(`check_${type}_era`, existing.era || "R");
            const y = getValue(`check_${type}_year`, existing.year);
            const m = getValue(`check_${type}_month`, existing.month);
            const d = getValue(`check_${type}_day`, existing.day);
            if (!y || !m || !d) return null;
            return {
              checkType: type,
              checkDate: convertToISO(era, y, m, d),
              note: getValue(
                "healthCheck_note",
                getHealthCheckData("1歳6か月").note
              ),
            };
          })
          .filter(Boolean),
        medicalHistories: diseaseMaster
          .map((d) => {
            const code = d.diseaseCode;
            const existing = getPastDisease(code);
            const year = getValue(`past_${code}_year`, existing.ageYear);
            const month = getValue(`past_${code}_month`, existing.ageMonth);
            const name = getValue(`past_${code}_name`, existing.freeName);
            if (year || month || name) {
              return {
                diseaseCode: code,
                hasDisease: true,
                ageYear: parseInt(year || "0"),
                ageMonth: parseInt(month || "0"),
                freeName: name || null,
              };
            }
            return null;
          })
          .filter(Boolean),
        constitutionHistories: constitutionColumns
          .map((col, idx) => {
            const period =
              idx === 0 ? "入所時" : (calculatedStartFY + (idx - 1)).toString();
            const isYes = (key: string) =>
              getValue(`const_${idx}_${key}`, col?.[key] ? "yes" : "no") ===
              "yes";
            return {
              entryPeriod: period,
              catchColdEasily: isYes("catchColdEasily"),
              feverEasily: isYes("feverEasily"),
              stomachacheOften: isYes("stomachacheOften"),
              wheeze: isYes("wheeze"),
              eczema: isYes("eczema"),
              nosebleed: isYes("nosebleed"),
              otitisMedia: isYes("otitisMedia"),
              normalTempC: parseFloat(
                getValue(`const_${idx}_normalTempC`, col?.normalTempC) || "0"
              ),
              careInNursery:
                idx === 0
                  ? getValue(`const_${idx}_careInNursery`, col?.careInNursery)
                  : null,
            };
          })
          .filter((item) => {
            if (item.entryPeriod === "入所時") return true;
            const hasCondition = [
              item.catchColdEasily,
              item.feverEasily,
              item.stomachacheOften,
              item.wheeze,
              item.eczema,
              item.nosebleed,
              item.otitisMedia,
            ].some((val) => val === true);
            const hasTemp = item.normalTempC && item.normalTempC > 0;
            return hasCondition || hasTemp;
          }),
        vaccinations: vaccineMaster.flatMap((v) => {
          return [...Array(v.count)]
            .map((_, i) => {
              const dose = i + 1;
              const dateVal = getValue(
                `vaccine_${v.code}_${dose}`,
                getVaccineDate(v.code, dose)
              );
              if (dateVal) {
                return {
                  vaccineCode: v.code,
                  doseNo: dose,
                  vaccinatedDate: new Date(dateVal).toISOString(),
                };
              }
              return null;
            })
            .filter(Boolean);
        }),
        teacherAssigns: ageColumns.flatMap((age) => {
          const hn = getValue(`teacher_${age}_HN`, getTeacher(age, "HN"));
          const tn = getValue(`teacher_${age}_TN`, getTeacher(age, "TN"));
          const result = [];
          if (hn)
            result.push({
              fiscalYear: startFiscalYear + age,
              ageClass: age,
              roleCode: "HN",
              staffName: hn,
            });
          if (tn)
            result.push({
              fiscalYear: startFiscalYear + age,
              ageClass: age,
              roleCode: "TN",
              staffName: tn,
            });
          return result;
        }),
        healthItems: [
          {
            type: "DISLOCATION",
            hasItem: getValue("item_DISLOCATION") === "yes",
          },
          { type: "ASTHMA", hasItem: getValue("item_ASTHMA") === "yes" },
          {
            type: "ALLERGY",
            hasItem: getValue("item_ALLERGY") === "yes",
            note: getValue("item_ALLERGY_note"),
          },
        ],
        seizureHistories: [
          {
            hasSeizure:
              getValue("seizure_has", getSeizureData().hasSeizure) === "yes",
            withFeverCount: parseInt(
              getValue("seizure_fever_count", getSeizureData().withFever) || "0"
            ),
            withoutFeverCount: parseInt(
              getValue(
                "seizure_nofever_count",
                getSeizureData().withoutFever
              ) || "0"
            ),
            firstAgeYear: parseInt(
              getValue("seizure_first_year", getSeizureData().ageYear) || "0"
            ),
            firstAgeMonth: parseInt(
              getValue("seizure_first_month", getSeizureData().ageMonth) || "0"
            ),
            note: null,
          },
        ],
      },
    };
    try {
      await createchild(saveData);
      alert(t("บันทึกข้อมูลสำเร็จ"));
    } catch (error) {
      console.error("Save Error:", error);
      alert(t("เกิดข้อผิดพลาดในการบันทึก"));
    }
  };
  const getValue = (key: string, defaultVal: any = null) => {
    if (formDataRef.current && key in formDataRef.current) {
      return (formDataRef.current as any)[key];
    }
    return defaultVal;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <ContentMain
        className="flex flex-col min-h-screen"
        key={loadedData?.childId || "form-init"}
      >
        {/* Header */}
        <Grid container spacing={2} className="pt-7 pl-3">
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "3px solid #000",
                pb: 2,
                mb: 3,
              }}
            >
              {/* ... Header Content ... */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    border: "3px solid #000",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                  }}
                >
                  秘
                </Box>
                <Box>
                  <Typography variant="h4" component="div" fontWeight={700}>
                    児童票
                  </Typography>
                  <Typography variant="caption" component="div">
                    (様式1-1)
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography>健康管理台帳（</Typography>
                <FormControlLabel
                  control={<Checkbox disabled={isViewMode} />}
                  label="有"
                  sx={{ m: 0 }}
                />
                <Typography>）・ 健康個人カード（</Typography>
                <FormControlLabel
                  control={<Checkbox disabled={isViewMode} />}
                  label="有"
                  sx={{ m: 0 }}
                />
                <Typography>）</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* 🟢 Health Management Table Header (Filter Section) */}
        <Grid container spacing={2} className="pt-3 pl-3">
          <Grid item xs={12}>
            <Box
              sx={{
                border: "2px solid #000",
                p: 1,
                mb: 2,
                backgroundColor: "#f5f5f5",
              }}
            >
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={7}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography>年度:</Typography>
                    {/* ✅ Input สำหรับปีงบประมาณ */}
                    <TextField
                      label="年度"
                      size="small"
                      placeholder="2024"
                      disabled={isViewMode}
                      sx={{ width: 100, backgroundColor: "white" }}
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                    />
                    {/* ✅ Input สำหรับอายุ */}
                    <FormControl
                      size="small"
                      sx={{ width: 120, backgroundColor: "white" }}
                      disabled={isViewMode}
                    >
                      <InputLabel>年齢</InputLabel>
                      <Select
                        label="年齢"
                        value={filterAge}
                        onChange={(e) => setFilterAge(e.target.value)}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
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
        <Grid container spacing={2} className="pt-3 pl-3">
          <Grid item xs={12}>
            <TableContainer sx={{ border: "1px solid #000" }}>
              <Table
                sx={{
                  "& td, & th": { border: "1px solid #000", padding: "8px" },
                }}
              >
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: "#f5f5f5",
                        width: "100px",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <Typography>ふりがな</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "35%" }}>
                      <Autocomplete
                        freeSolo
                        disabled={isViewMode}
                        options={searchOptions}
                        // ✅ เพิ่มบรรทัดนี้: ปิดการกรองฝั่ง Client (ช่วยลดหน่วง เพราะ Server กรองมาให้แล้ว)
                        filterOptions={(x) => x}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.furigana
                        }
                        value={loadedData?.furigana || ""}
                        isOptionEqualToValue={(option, value) => {
                          if (value === "") return true;
                          return option.furigana === value;
                        }}
                        // เรียกฟังก์ชันที่แก้ด้านบน
                        onInputChange={handleFuriganaChange}
                        onChange={(_event, newValue) => {
                          if (newValue && typeof newValue !== "string") {
                            // อัปเดตทั้ง Furigana และ Name Child ทันทีที่เลือก
                            handleChange({
                              target: {
                                name: "furigana",
                                value: newValue.furigana,
                              },
                            } as any);
                            handleChange({
                              target: {
                                name: "name_child",
                                value: newValue.name_child,
                              },
                            } as any);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="やまだ　たろう"
                            size="small"
                            name="furigana"
                            sx={{ backgroundColor: "white" }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option.childId}>
                            <Box>
                              <Typography variant="body1">
                                {option.furigana}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                {option.name_child}
                              </Typography>
                            </Box>
                          </li>
                        )}
                      />
                    </TableCell>
                    <TableCell
                      rowSpan={2}
                      sx={{
                        backgroundColor: "#f5f5f5",
                        width: "80px",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <RadioGroup
                        name="gender"
                        defaultValue={loadedData?.gender || ""}
                        onChange={handleRadioChange}
                        row
                        sx={{ justifyContent: "center", gap: 1 }}
                      >
                        <FormControlLabel
                          value="M"
                          control={<Radio disabled={isViewMode} />}
                          label="男"
                          sx={{ margin: 0 }}
                        />
                        <FormControlLabel
                          value="F"
                          control={<Radio disabled={isViewMode} />}
                          label="女"
                          sx={{ margin: 0 }}
                        />
                      </RadioGroup>
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#f5f5f5",
                        width: "25%",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <Typography>生年月日</Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#f5f5f5",
                        width: "80px",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <Typography
                        sx={{
                          writingMode: "vertical-rl",
                          textOrientation: "upright",
                          margin: "auto",
                        }}
                      >
                        入所
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "18%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography fontSize="0.9rem">令和</Typography>
                        <TextField
                          size="small"
                          placeholder="年"
                          name="admissionYear"
                          disabled={isViewMode}
                          defaultValue={getJapaneseDateParts(
                            loadedData?.admissionDate,
                            "year"
                          )}
                          onChange={handleChange}
                          sx={{ width: 40, backgroundColor: "white" }}
                        />
                        <Typography fontSize="0.9rem">年</Typography>
                        <TextField
                          size="small"
                          placeholder="月"
                          name="admissionMonth"
                          disabled={isViewMode}
                          defaultValue={getJapaneseDateParts(
                            loadedData?.admissionDate,
                            "month"
                          )}
                          onChange={handleChange}
                          sx={{ width: 40, backgroundColor: "white" }}
                        />
                        <Typography fontSize="0.9rem">月</Typography>
                        <TextField
                          size="small"
                          placeholder="日"
                          name="admissionDay"
                          disabled={isViewMode}
                          defaultValue={getJapaneseDateParts(
                            loadedData?.admissionDate,
                            "day"
                          )}
                          onChange={handleChange}
                          sx={{ width: 40, backgroundColor: "white" }}
                        />
                        <Typography fontSize="0.9rem">日</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: "#f5f5f5",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <Typography>氏名</Typography>
                    </TableCell>
                    <TableCell>
                      <Autocomplete
                        disabled={isViewMode}
                        options={searchOptions}
                        getOptionLabel={(option) =>
                          typeof option === "string"
                            ? option
                            : option.name_child
                        }
                        value={loadedData?.name_child || null}
                        onChange={handleNameSelect}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="山田　太郎"
                            size="small"
                            name="name_child"
                            sx={{ bgcolor: "white" }}
                          />
                        )}
                        // จัดหน้าตา Dropdown ให้เห็นชัดเจน
                        renderOption={(props, option) => (
                          <li {...props} key={option.childId}>
                            <Box>
                              <Typography variant="body1">
                                {option.name_child}
                              </Typography>
                            </Box>
                          </li>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          flexWrap: "wrap",
                        }}
                      >
                        <RadioGroup
                          name="eraName"
                          defaultValue={loadedData?.eraName || ""}
                          onChange={handleChange}
                          row
                        >
                          <FormControlLabel
                            value="H"
                            control={
                              <Radio size="small" disabled={isViewMode} />
                            }
                            label="平成"
                            sx={{
                              mr: 0.5,
                              "& .MuiFormControlLabel-label": {
                                fontSize: "0.9rem",
                              },
                            }}
                          />
                          <FormControlLabel
                            value="R"
                            control={
                              <Radio size="small" disabled={isViewMode} />
                            }
                            label="令和"
                            sx={{
                              ml: 0.5,
                              "& .MuiFormControlLabel-label": {
                                fontSize: "0.9rem",
                              },
                            }}
                          />
                        </RadioGroup>
                        <TextField
                          size="small"
                          placeholder="年"
                          name="birthYear"
                          disabled={isViewMode}
                          defaultValue={getJapaneseDateParts(
                            loadedData?.birthDate,
                            "year"
                          )}
                          onChange={handleChange}
                          sx={{ width: 50, backgroundColor: "white" }}
                        />
                        <Typography fontSize="0.9rem">年</Typography>
                        <TextField
                          size="small"
                          placeholder="月"
                          name="birthMonth"
                          disabled={isViewMode}
                          defaultValue={getJapaneseDateParts(
                            loadedData?.birthDate,
                            "month"
                          )}
                          onChange={handleChange}
                          sx={{ width: 50, backgroundColor: "white" }}
                        />
                        <Typography fontSize="0.9rem">月</Typography>
                        <TextField
                          size="small"
                          placeholder="日"
                          name="birthDay"
                          disabled={isViewMode}
                          defaultValue={getJapaneseDateParts(
                            loadedData?.birthDate,
                            "day"
                          )}
                          onChange={handleChange}
                          sx={{ width: 50, backgroundColor: "white" }}
                        />
                        <Typography fontSize="0.9rem">日</Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#f5f5f5",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <Typography
                        sx={{
                          writingMode: "vertical-rl",
                          textOrientation: "upright",
                          margin: "auto",
                        }}
                      >
                        退所
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography fontSize="0.9rem">令和</Typography>
                        <TextField
                          size="small"
                          placeholder="年"
                          name="graduationYear"
                          disabled={isViewMode}
                          defaultValue={getJapaneseDateParts(
                            loadedData?.graduationDate,
                            "year"
                          )}
                          onChange={handleChange}
                          sx={{ width: 40, backgroundColor: "white" }}
                        />
                        <Typography fontSize="0.9rem">年</Typography>
                        <TextField
                          size="small"
                          placeholder="月"
                          name="graduationMonth"
                          disabled={isViewMode}
                          defaultValue={getJapaneseDateParts(
                            loadedData?.graduationDate,
                            "month"
                          )}
                          onChange={handleChange}
                          sx={{ width: 40, backgroundColor: "white" }}
                        />
                        <Typography fontSize="0.9rem">月</Typography>
                        <TextField
                          size="small"
                          placeholder="日"
                          name="graduationDay"
                          disabled={isViewMode}
                          defaultValue={getJapaneseDateParts(
                            loadedData?.graduationDate,
                            "day"
                          )}
                          onChange={handleChange}
                          sx={{ width: 40, backgroundColor: "white" }}
                        />
                        <Typography fontSize="0.9rem">日</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  {/* ... (Address Rows and the rest of the file remains unchanged) ... */}
                  {(() => {
                    const existingAddresses = loadedData?.addresses || [];
                    const rowsToRender =
                      existingAddresses.length > 3
                        ? existingAddresses
                        : [
                            ...existingAddresses,
                            ...Array(3 - existingAddresses.length).fill({}),
                          ];
                    return rowsToRender.map((addr, index) => (
                      <TableRow key={index}>
                        {index === 0 && (
                          <TableCell
                            rowSpan={rowsToRender.length}
                            sx={{
                              backgroundColor: "#f5f5f5",
                              textAlign: "center",
                              verticalAlign: "middle",
                              width: "100px",
                            }}
                          >
                            <Typography
                              sx={{
                                writingMode: "vertical-rl",
                                textOrientation: "upright",
                                margin: "auto",
                              }}
                            >
                              現住所
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell colSpan={2}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography>〒</Typography>
                            <TextField
                              size="small"
                              placeholder="000-0000"
                              disabled={isViewMode}
                              name={`addresses_${index}_postalCode`}
                              defaultValue={addr?.postalCode || ""}
                              onChange={handleChange}
                              sx={{ width: 100, backgroundColor: "white" }}
                            />
                            <Typography>福岡市</Typography>
                            <TextField
                              size="small"
                              placeholder="区"
                              disabled={isViewMode}
                              name={`addresses_${index}_addressDetail`}
                              defaultValue={`${addr?.city || ""}${
                                addr?.ward || ""
                              }${addr?.addressDetail || ""}`}
                              onChange={handleChange}
                              sx={{ flex: 1, backgroundColor: "white" }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography>TEL</Typography>
                            <Typography>(</Typography>
                            <TextField
                              size="small"
                              placeholder=""
                              disabled={isViewMode}
                              name={`addresses_${index}_tel`}
                              defaultValue={addr?.tel || ""}
                              onChange={handleChange}
                              sx={{ flex: 1, backgroundColor: "white" }}
                            />
                            <Typography>)</Typography>
                          </Box>
                        </TableCell>
                        <TableCell colSpan={2}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography>校区</Typography>
                            <TextField
                              size="small"
                              disabled={isViewMode}
                              name={`addresses_${index}_schoolArea`}
                              defaultValue={addr?.schoolArea || ""}
                              onChange={handleChange}
                              sx={{ flex: 1, backgroundColor: "white" }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ));
                  })()}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {/* ... (Rest of the component content: Family Table, Commute, Birth Info, etc. from previous file) ... */}
        {/* I am omitting the middle part to save space, but please include all other sections (Family, Clinics, Birth Info, Vaccinations, Past Diseases, Constitution, Teacher) from the previous complete code I provided. */}
        {/* Ensure the closing tags are correct */}

        {/* Family Table */}
        <Grid container spacing={2} className="pt-5 pl-3">
          <Grid item xs={12}>
            <TableContainer
              component={Box}
              sx={{ border: "1px solid #000", overflow: "auto" }}
            >
              <Table
                sx={{
                  minWidth: 650,
                  "& .MuiTableCell-root": {
                    border: "1px solid #000",
                    borderCollapse: "collapse",
                  },
                }}
                size="small"
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ width: "50px", p: 0 }} />
                    <TableCell
                      align="center"
                      sx={{
                        width: "15%",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        p: 1,
                      }}
                    >
                      氏名
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: "12%",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        p: 1,
                      }}
                    >
                      生年月日
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: "7%",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        p: 1,
                      }}
                    >
                      続柄
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: "18%",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        p: 1,
                      }}
                    >
                      勤務先
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: "20%",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        p: 1,
                      }}
                    >
                      勤務先住所
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: "20%",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        p: 1,
                      }}
                    >
                      TEL
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: "7%",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        p: 1,
                      }}
                    >
                      操作
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {familyMembers.map((member, index) => {
                    let era = "H";
                    let jpYear = "";
                    let month = "";
                    let day = "";
                    if (member.birthDate) {
                      const date = new Date(member.birthDate);
                      const year = date.getFullYear();
                      month = (date.getMonth() + 1).toString();
                      day = date.getDate().toString();
                      if (year >= 2019) {
                        era = "R";
                        jpYear = (year - 2018).toString();
                      } else if (year >= 1989) {
                        era = "H";
                        jpYear = (year - 1988).toString();
                      } else {
                        era = "S";
                        jpYear = (year - 1925).toString();
                      }
                    }
                    return [
                      <TableRow key={`${index}-main`}>
                        {index === 0 && (
                          <TableCell
                            rowSpan={familyMembers.length * 2}
                            sx={{
                              width: "50px",
                              writingMode: "vertical-rl",
                              textOrientation: "upright",
                              backgroundColor: "#f5f5f5",
                              textAlign: "center",
                              p: 2,
                            }}
                          >
                            家族の状況
                          </TableCell>
                        )}
                        <TableCell rowSpan={2}>
                          <TextField
                            fullWidth
                            size="small"
                            disabled={isViewMode}
                            name={`guardians_${index}_name_guardian`}
                            defaultValue={member.name_guardian || ""}
                            onChange={handleChange}
                          />
                        </TableCell>
                        <TableCell
                          rowSpan={2}
                          sx={{
                            p: 1,
                            verticalAlign: "top",
                            backgroundColor: "white",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            <RadioGroup
                              row
                              defaultValue={era}
                              name={`guardians_${index}_era`}
                              sx={{ mt: -0.5 }}
                            >
                              <FormControlLabel
                                value="S"
                                control={
                                  <Radio size="small" disabled={isViewMode} />
                                }
                                label={
                                  <Typography fontSize="0.75rem">S</Typography>
                                }
                              />
                              <FormControlLabel
                                value="H"
                                control={
                                  <Radio size="small" disabled={isViewMode} />
                                }
                                label={
                                  <Typography fontSize="0.75rem">H</Typography>
                                }
                              />
                              <FormControlLabel
                                value="R"
                                control={
                                  <Radio size="small" disabled={isViewMode} />
                                }
                                label={
                                  <Typography fontSize="0.75rem">R</Typography>
                                }
                              />
                            </RadioGroup>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <TextField
                                size="small"
                                placeholder="年"
                                disabled={isViewMode}
                                name={`guardians_${index}_birthYear`}
                                defaultValue={jpYear}
                                onChange={handleChange}
                                sx={{
                                  width: 50,
                                  "& .MuiOutlinedInput-root fieldset": {
                                    border: "1px solid #ccc",
                                  },
                                }}
                              />
                              <Typography fontSize="0.75rem">年</Typography>
                              <TextField
                                size="small"
                                placeholder="月"
                                disabled={isViewMode}
                                name={`guardians_${index}_birthMonth`}
                                defaultValue={month}
                                onChange={handleChange}
                                sx={{
                                  width: 50,
                                  "& .MuiOutlinedInput-root fieldset": {
                                    border: "1px solid #ccc",
                                  },
                                }}
                              />
                              <Typography fontSize="0.75rem">月</Typography>
                              <TextField
                                size="small"
                                placeholder="日"
                                disabled={isViewMode}
                                name={`guardians_${index}_birthDay`}
                                defaultValue={day}
                                onChange={handleChange}
                                sx={{
                                  width: 50,
                                  "& .MuiOutlinedInput-root fieldset": {
                                    border: "1px solid #ccc",
                                  },
                                }}
                              />
                              <Typography fontSize="0.75rem">日</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell rowSpan={2}>
                          <TextField
                            rows={4}
                            multiline
                            fullWidth
                            size="small"
                            disabled={isViewMode}
                            name={`guardians_${index}_relation`}
                            defaultValue={member.relation || ""}
                            onChange={handleChange}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            disabled={isViewMode}
                            name={`guardians_${index}_workplace`}
                            defaultValue={member.workplace || ""}
                            onChange={handleChange}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            disabled={isViewMode}
                            name={`guardians_${index}_workplaceAddress`}
                            defaultValue={member.workplaceAddress || ""}
                            onChange={handleChange}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            disabled={isViewMode}
                            name={`guardians_${index}_workplaceTel`}
                            defaultValue={member.workplaceTel || ""}
                            onChange={handleChange}
                          />
                        </TableCell>
                        <TableCell rowSpan={2} align="center">
                          {familyMembers.length > 1 && !isViewMode && (
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() =>
                                removeFamilyMember(
                                  member.id || member.guardianId
                                )
                              }
                            >
                              削除
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>,
                      <TableRow key={`${index}-mobile`}>
                        <TableCell
                          colSpan={3}
                          sx={{ borderTop: "1px dashed #888" }}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontSize="0.85rem">
                              携帯番号：
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              disabled={isViewMode}
                              name={`guardians_${index}_mobile`}
                              defaultValue={member.mobile || ""}
                              onChange={handleChange}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>,
                    ];
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            {!isViewMode && (
              <Button
                variant="contained"
                color="success"
                onClick={addFamilyMember}
                sx={{ mt: 2 }}
              >
                ➕ 家族を追加
              </Button>
            )}
          </Grid>
        </Grid>

        {/* Commute and Clinic */}
        <Grid container spacing={2} className="pt-5 pl-3">
          <Grid item xs={12}>
            <Box sx={{ border: "2px solid #000" }}>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ borderRight: "1px solid #000" }}
                >
                  <Box sx={{ display: "flex", height: "100%" }}>
                    <Box
                      sx={{
                        borderRight: "1px solid #000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 1,
                        minWidth: "40px",
                        writingMode: "vertical-rl",
                        textOrientation: "upright",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "16px",
                          letterSpacing: "8px",
                          lineHeight: 1,
                        }}
                      >
                        通所（園）方法
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 2 }}>
                      <RadioGroup
                        name="method"
                        defaultValue={loadedData?.commutes?.[0]?.method || ""}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          value="徒歩"
                          control={<Radio disabled={isViewMode} />}
                          label="徒歩"
                        />
                        <FormControlLabel
                          value="自転車"
                          control={<Radio disabled={isViewMode} />}
                          label="自転車"
                        />
                      </RadioGroup>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          詳細：
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={5}
                          placeholder="詳細を入力してください"
                          disabled={isViewMode}
                          sx={{ backgroundColor: "white" }}
                          name="note"
                          defaultValue={loadedData?.commutes?.[0]?.note || ""}
                          onChange={handleChange}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Box
                      sx={{
                        borderBottom: "1px solid #000",
                        p: 1.5,
                        textAlign: "center",
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      <Typography fontWeight={600}>かかりつけの病院</Typography>
                    </Box>
                    {clinicMaster.length > 0 ? (
                      clinicMaster.map((dept) => (
                        <Box
                          key={dept.clinicId}
                          sx={{
                            display: "flex",
                            borderBottom: "1px solid #000",
                            minHeight: "50px",
                          }}
                        >
                          <Box
                            sx={{
                              width: "30%",
                              borderRight: "1px solid #000",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              p: 1,
                            }}
                          >
                            <Typography>{dept.clinicTypeJp}</Typography>
                          </Box>
                          <Box
                            sx={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              p: 1,
                              gap: 1,
                            }}
                          >
                            <Typography>TEL (</Typography>
                            <TextField
                              size="small"
                              placeholder=""
                              disabled={isViewMode}
                              name={`clinics_${dept.clinicTypeCode}_tel`}
                              defaultValue={getClinicTel(dept.clinicTypeCode)}
                              onChange={handleChange}
                              sx={{
                                flex: 1,
                                backgroundColor: "white",
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": { border: "none" },
                                },
                              }}
                            />
                            <Typography>)</Typography>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Box p={2} textAlign="center">
                        <Typography variant="caption">Loading...</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: "flex", minHeight: "60px" }}>
                      <Box
                        sx={{
                          width: "30%",
                          borderRight: "1px solid #000",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 1,
                        }}
                      >
                        <Typography fontWeight={600}>血液型</Typography>
                      </Box>
                      <Box
                        sx={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          p: 2,
                          gap: 1,
                        }}
                      >
                        <TextField
                          size="small"
                          placeholder=""
                          disabled={isViewMode}
                          name="bloodType"
                          defaultValue={loadedData?.bloodType || ""}
                          onChange={handleChange}
                          sx={{
                            width: 100,
                            backgroundColor: "white",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { border: "none" },
                            },
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

        {/* Birth Info */}
        <Grid container spacing={2} className="pt-5 pl-3">
          <Grid item xs={12}>
            <Box sx={{ border: "2px solid #000" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        width: "10%",
                        borderRight: "1px solid #000",
                        borderBottom: "1px solid #000",
                        padding: "8px",
                        verticalAlign: "middle",
                      }}
                    >
                      <Typography fontWeight={600}>妊娠中の状況</Typography>
                    </td>
                    <td
                      style={{ borderBottom: "1px solid #000", padding: "8px" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <RadioGroup
                          name="pregnancyAbnormal"
                          defaultValue={
                            loadedData?.birthInfo?.pregnancyAbnormal
                              ? "abnormal"
                              : "normal"
                          }
                          onChange={handleRadioChange}
                          row
                        >
                          <FormControlLabel
                            value="normal"
                            control={
                              <Radio size="small" disabled={isViewMode} />
                            }
                            label="異常なし"
                          />
                          <FormControlLabel
                            value="abnormal"
                            control={
                              <Radio size="small" disabled={isViewMode} />
                            }
                            label="あり"
                          />
                        </RadioGroup>
                        <Typography>（</Typography>
                        <TextField
                          size="small"
                          disabled={isViewMode}
                          sx={{ width: 150, backgroundColor: "white" }}
                          name="pregnancyIssueNote"
                          defaultValue={
                            loadedData?.birthInfo?.pregnancyIssueNote || ""
                          }
                          onChange={handleChange}
                        />
                        <Typography>）</Typography>
                        <Typography fontWeight={600} sx={{ ml: 2 }}>
                          妊娠期間
                        </Typography>
                        <TextField
                          size="small"
                          disabled={isViewMode}
                          sx={{ width: 80, backgroundColor: "white" }}
                          name="pregnancyWeeks"
                          defaultValue={
                            loadedData?.birthInfo?.pregnancyWeeks || ""
                          }
                          onChange={handleChange}
                        />
                        <Typography>週</Typography>
                        <Box
                          sx={{
                            ml: "auto",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography fontWeight={600} fontSize="1.2rem">
                            第
                          </Typography>
                          <TextField
                            size="small"
                            disabled={isViewMode}
                            sx={{ width: 60, backgroundColor: "white", mx: 1 }}
                            name="birthOrder"
                            defaultValue={
                              loadedData?.birthInfo?.birthOrder || ""
                            }
                            onChange={handleChange}
                          />
                          <Typography fontWeight={600} fontSize="1.2rem">
                            子
                          </Typography>
                        </Box>
                      </Box>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "10%",
                        borderRight: "1px solid #000",
                        borderBottom: "1px solid #000",
                        padding: "8px",
                        verticalAlign: "middle",
                      }}
                    >
                      <Typography fontWeight={600}>分娩時の状況</Typography>
                    </td>
                    <td
                      style={{ borderBottom: "1px solid #000", padding: "8px" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <RadioGroup
                          name="deliveryAbnormal"
                          defaultValue={
                            loadedData?.birthInfo?.deliveryAbnormal
                              ? "abnormal"
                              : "normal"
                          }
                          onChange={handleRadioChange}
                          row
                        >
                          <FormControlLabel
                            value="normal"
                            control={
                              <Radio size="small" disabled={isViewMode} />
                            }
                            label="異常なし"
                          />
                          <FormControlLabel
                            value="abnormal"
                            control={
                              <Radio size="small" disabled={isViewMode} />
                            }
                            label="あり"
                          />
                        </RadioGroup>
                        <Typography>（</Typography>
                        <TextField
                          size="small"
                          disabled={isViewMode}
                          sx={{ width: 150, backgroundColor: "white" }}
                          name="deliveryIssueNote"
                          defaultValue={
                            loadedData?.birthInfo?.deliveryIssueNote || ""
                          }
                          onChange={handleChange}
                        />
                        <Typography>）</Typography>
                        <Typography fontWeight={600} sx={{ ml: 2 }}>
                          出生時体重
                        </Typography>
                        <Typography>（</Typography>
                        <TextField
                          size="small"
                          disabled={isViewMode}
                          sx={{ width: 100, backgroundColor: "white" }}
                          name="birthWeightG"
                          defaultValue={
                            loadedData?.birthInfo?.birthWeightG || ""
                          }
                          onChange={handleChange}
                        />
                        <Typography>g）</Typography>
                      </Box>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "10%",
                        borderRight: "1px solid #000",
                        borderBottom: "1px solid #000",
                        padding: "8px",
                        verticalAlign: "top",
                      }}
                    >
                      <Typography fontWeight={600}>出生時の状況</Typography>
                    </td>
                    <td
                      style={{ borderBottom: "1px solid #000", padding: "8px" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <RadioGroup
                          row
                          value={birthCondition}
                          onChange={(e) => {
                            if (!isViewMode) {
                              setBirthCondition(e.target.value);
                              if (e.target.value === "normal") {
                                setBirthDetails([]);
                                setBirthOther("");
                              }
                            }
                          }}
                        >
                          <FormControlLabel
                            value="normal"
                            control={
                              <Radio size="small" disabled={isViewMode} />
                            }
                            label="異常なし"
                          />
                          <FormControlLabel
                            value="abnormal"
                            control={
                              <Radio size="small" disabled={isViewMode} />
                            }
                            label="あり"
                          />
                        </RadioGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              disabled={
                                isViewMode || birthCondition === "normal"
                              }
                              checked={birthDetails.includes("仮死")}
                              onChange={(e) => {
                                if (e.target.checked)
                                  setBirthDetails([...birthDetails, "仮死"]);
                                else
                                  setBirthDetails(
                                    birthDetails.filter((d) => d !== "仮死")
                                  );
                              }}
                            />
                          }
                          label="仮死"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              disabled={
                                isViewMode || birthCondition === "normal"
                              }
                              checked={birthDetails.includes("けいれん")}
                              onChange={(e) => {
                                if (e.target.checked)
                                  setBirthDetails([
                                    ...birthDetails,
                                    "けいれん",
                                  ]);
                                else
                                  setBirthDetails(
                                    birthDetails.filter((d) => d !== "けいれん")
                                  );
                              }}
                            />
                          }
                          label="けいれん"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              disabled={
                                isViewMode || birthCondition === "normal"
                              }
                              checked={birthDetails.includes("強い黄疸")}
                              onChange={(e) => {
                                if (e.target.checked)
                                  setBirthDetails([
                                    ...birthDetails,
                                    "強い黄疸",
                                  ]);
                                else
                                  setBirthDetails(
                                    birthDetails.filter((d) => d !== "強い黄疸")
                                  );
                              }}
                            />
                          }
                          label="強い黄疸"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              disabled={
                                isViewMode || birthCondition === "normal"
                              }
                              checked={birthDetails.includes("呼吸異常")}
                              onChange={(e) => {
                                if (e.target.checked)
                                  setBirthDetails([
                                    ...birthDetails,
                                    "呼吸異常",
                                  ]);
                                else
                                  setBirthDetails(
                                    birthDetails.filter((d) => d !== "呼吸異常")
                                  );
                              }}
                            />
                          }
                          label="呼吸異常"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              disabled={
                                isViewMode || birthCondition === "normal"
                              }
                              checked={birthDetails.includes("先天性代謝異常")}
                              onChange={(e) => {
                                if (e.target.checked)
                                  setBirthDetails([
                                    ...birthDetails,
                                    "先天性代謝異常",
                                  ]);
                                else
                                  setBirthDetails(
                                    birthDetails.filter(
                                      (d) => d !== "先天性代謝異常"
                                    )
                                  );
                              }}
                            />
                          }
                          label="先天性代謝異常"
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                disabled={
                                  isViewMode || birthCondition === "normal"
                                }
                                checked={birthDetails.includes("その他")}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setBirthDetails([
                                      ...birthDetails,
                                      "その他",
                                    ]);
                                  } else {
                                    setBirthDetails(
                                      birthDetails.filter((d) => d !== "その他")
                                    );
                                    setBirthOther("");
                                  }
                                }}
                              />
                            }
                            label="その他"
                          />
                          <Typography>（</Typography>
                          <TextField
                            size="small"
                            name="neonatalIssueOther"
                            disabled={
                              isViewMode ||
                              birthCondition === "normal" ||
                              !birthDetails.includes("その他")
                            }
                            sx={{ width: 200, backgroundColor: "white" }}
                            defaultValue={birthOther}
                            key={birthOther}
                            onChange={handleChange}
                          />
                          <Typography>）</Typography>
                        </Box>
                      </Box>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "10%",
                        borderRight: "1px solid #000",
                        padding: "8px",
                        verticalAlign: "top",
                      }}
                    >
                      <Typography fontWeight={600}>乳児期の様子</Typography>
                    </td>
                    <td style={{ padding: "8px" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography>栄養方法</Typography>
                        <RadioGroup
                          name="feedingTypeCode"
                          defaultValue={
                            loadedData?.infantDev?.feedingTypeCode || ""
                          }
                          onChange={handleRadioChange}
                          row
                        >
                          {feedingMaster.length > 0 ? (
                            feedingMaster.map((feed) => (
                              <FormControlLabel
                                key={feed.feedingId}
                                value={feed.feedingTypeCode}
                                control={
                                  <Radio size="small" disabled={isViewMode} />
                                }
                                label={feed.feedingTypeJp}
                              />
                            ))
                          ) : (
                            <Typography variant="caption" sx={{ mx: 1 }}>
                              Loading...
                            </Typography>
                          )}
                        </RadioGroup>
                        <Typography sx={{ ml: 2 }}>離乳</Typography>
                        <RadioGroup
                          name="weaningStatus"
                          row
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "nowrap",
                          }}
                        >
                          <FormControlLabel
                            value="未開始"
                            control={
                              <Radio size="small" disabled={isViewMode} />
                            }
                            label="未開始"
                          />
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <FormControlLabel
                              value="開始"
                              control={
                                <Radio size="small" disabled={isViewMode} />
                              }
                              label="開始"
                            />
                            <TextField
                              size="small"
                              disabled={isViewMode}
                              sx={{ width: 60, backgroundColor: "white" }}
                              name="weaningStartMonth"
                              defaultValue={
                                loadedData?.infantDev?.weaningStartMonth || ""
                              }
                              onChange={handleChange}
                            />
                            <Typography>か月</Typography>
                          </Box>
                        </RadioGroup>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography>完了</Typography>
                          <TextField
                            size="small"
                            disabled={isViewMode}
                            sx={{ width: 60, backgroundColor: "white" }}
                            name="weaningCompleteMonth"
                            defaultValue={
                              loadedData?.infantDev?.weaningCompleteMonth || ""
                            }
                            onChange={handleChange}
                          />
                          <Typography>か月</Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography>首のすわり（</Typography>
                        <TextField
                          size="small"
                          disabled={isViewMode}
                          sx={{ width: 60, backgroundColor: "white" }}
                          name="neckHoldMonth"
                          defaultValue={
                            loadedData?.infantDev?.neckHoldMonth || ""
                          }
                          onChange={handleChange}
                        />
                        <Typography>か月）</Typography>
                        <Typography>はいはい（</Typography>
                        <TextField
                          size="small"
                          disabled={isViewMode}
                          sx={{ width: 60, backgroundColor: "white" }}
                          name="crawlingMonth"
                          defaultValue={
                            loadedData?.infantDev?.crawlingMonth || ""
                          }
                          onChange={handleChange}
                        />
                        <Typography>か月）</Typography>
                        <Typography>ひとり歩き（</Typography>
                        <TextField
                          size="small"
                          disabled={isViewMode}
                          sx={{ width: 60, backgroundColor: "white" }}
                          name="walkingYears"
                          defaultValue={
                            loadedData?.infantDev?.walkingYears || ""
                          }
                          onChange={handleChange}
                        />
                        <Typography>歳</Typography>
                        <TextField
                          size="small"
                          disabled={isViewMode}
                          sx={{ width: 60, backgroundColor: "white" }}
                          name="walkingMonth"
                          defaultValue={
                            loadedData?.infantDev?.walkingMonth || ""
                          }
                          onChange={handleChange}
                        />
                        <Typography>か月）</Typography>
                        <Typography>"ママ"などの言葉（</Typography>
                        <TextField
                          size="small"
                          disabled={isViewMode}
                          sx={{ width: 60, backgroundColor: "white" }}
                          name="firstWordsMonth"
                          defaultValue={
                            loadedData?.infantDev?.firstWordsMonth || ""
                          }
                          onChange={handleChange}
                        />
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
            <Box sx={{ border: "2px solid #000" }}>
              <Box
                sx={{
                  p: 1.5,
                  backgroundColor: "#f5f5f5",
                  borderBottom: "1px solid #000",
                }}
              >
                <Typography fontWeight={600}>予防接種記録入力</Typography>
              </Box>
              <Table size="small">
                <TableBody>
                  {vaccineMaster.length > 0 ? (
                    vaccineMaster.map((vaccine, idx) => (
                      <TableRow key={vaccine.code || idx}>
                        <TableCell
                          sx={{
                            width: "25%",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                          }}
                        >
                          {vaccine.name}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1.5,
                              flexWrap: "wrap",
                              py: 0.5,
                            }}
                          >
                            {[...Array(vaccine.count)].map((_, i) => {
                              const dose = i + 1;
                              return (
                                <Box
                                  key={i}
                                  sx={{
                                    display: "flex",
                                    gap: 0.5,
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    fontSize="0.85rem"
                                    color="text.secondary"
                                  >
                                    {dose}回:
                                  </Typography>
                                  <TextField
                                    type="date"
                                    size="small"
                                    disabled={isViewMode}
                                    name={`vaccine_${vaccine.code}_${dose}`}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ width: 130 }}
                                    defaultValue={getVaccineDate(
                                      vaccine.code,
                                      dose
                                    )}
                                    onChange={handleChange}
                                  />
                                </Box>
                              );
                            })}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                        Loading vaccines...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>

        {/* Past Diseases */}
        <Grid container spacing={2} className="pt-5 pl-3">
          <Grid item xs={12}>
            <TableContainer sx={{ border: "1px solid #000" }}>
              <Table
                sx={{
                  "& td, & th": { border: "1px solid #000" },
                  borderCollapse: "collapse",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      rowSpan={2}
                      colSpan={2}
                      sx={{
                        width: "10%",
                        backgroundColor: "#f5f5f5",
                        textAlign: "center",
                        verticalAlign: "middle",
                        padding: "16px 8px",
                      }}
                    >
                      <Typography sx={{ letterSpacing: "8px" }}>
                        乳幼児健診
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", padding: "8px", width: "10%" }}
                    >
                      <Typography fontWeight={600}>4か月</Typography>
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", padding: "8px", width: "10%" }}
                    >
                      <Typography fontWeight={600}>10か月</Typography>
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", padding: "8px", width: "10%" }}
                    >
                      <Typography fontWeight={600}>1歳6か月</Typography>
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", padding: "8px", width: "10%" }}
                    >
                      <Typography fontWeight={600}>3歳</Typography>
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", padding: "8px", width: "12%" }}
                    >
                      <Typography fontWeight={600}>特記事項</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {["4か月", "10か月", "1歳6か月", "3歳"].map((checkType) => {
                      const data = getHealthCheckData(checkType);
                      return (
                        <TableCell
                          key={checkType}
                          sx={{ textAlign: "center", padding: "4px" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <RadioGroup
                              row
                              defaultValue={data.era}
                              name={`check_${checkType}_era`}
                              onChange={handleRadioChange}
                            >
                              <FormControlLabel
                                value="heisei"
                                control={
                                  <Radio size="small" disabled={isViewMode} />
                                }
                                label="H"
                                sx={{
                                  mr: 0.5,
                                  "& .MuiFormControlLabel-label": {
                                    fontSize: "0.85rem",
                                  },
                                }}
                              />
                              <FormControlLabel
                                value="reiwa"
                                control={
                                  <Radio size="small" disabled={isViewMode} />
                                }
                                label="R"
                                sx={{
                                  "& .MuiFormControlLabel-label": {
                                    fontSize: "0.85rem",
                                  },
                                }}
                              />
                            </RadioGroup>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <TextField
                                size="small"
                                disabled={isViewMode}
                                defaultValue={data.year}
                                name={`check_${checkType}_year`}
                                onChange={handleChange}
                                sx={{
                                  width: "40px",
                                  backgroundColor: "white",
                                  "& fieldset": { borderColor: "#999" },
                                }}
                              />
                              <Typography fontSize="0.85rem">年</Typography>
                              <TextField
                                size="small"
                                disabled={isViewMode}
                                defaultValue={data.month}
                                name={`check_${checkType}_month`}
                                onChange={handleChange}
                                sx={{
                                  width: "40px",
                                  backgroundColor: "white",
                                  "& fieldset": { borderColor: "#999" },
                                }}
                              />
                              <Typography fontSize="0.85rem">月</Typography>
                              <TextField
                                size="small"
                                disabled={isViewMode}
                                defaultValue={data.day}
                                name={`check_${checkType}_day`}
                                onChange={handleChange}
                                sx={{
                                  width: "40px",
                                  backgroundColor: "white",
                                  "& fieldset": { borderColor: "#999" },
                                }}
                              />
                              <Typography fontSize="0.85rem">日</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      );
                    })}
                    <TableCell sx={{ padding: "4px" }}>
                      <TextField
                        fullWidth
                        size="small"
                        disabled={isViewMode}
                        multiline
                        rows={2}
                        name="healthCheck_note"
                        defaultValue={getHealthCheckData("1歳6か月").note}
                        onChange={handleChange}
                        sx={{
                          backgroundColor: "white",
                          "& fieldset": { borderColor: "#999" },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(() => {
                    const specialCodes = ["MAJOR_INJURY", "OTHER_SERIOUS"];
                    const excludeCodes = ["ASTHMA"];
                    const majorDisease = diseaseMaster.find(
                      (d) => d.diseaseCode === "MAJOR_INJURY"
                    );
                    const otherDisease = diseaseMaster.find(
                      (d) => d.diseaseCode === "OTHER_SERIOUS"
                    );
                    const dynamicDiseases = diseaseMaster.filter(
                      (d) =>
                        !specialCodes.includes(d.diseaseCode) &&
                        !excludeCodes.includes(d.diseaseCode)
                    );
                    const renderDynamicCell = (index: number) => {
                      const disease = dynamicDiseases[index];
                      if (!disease)
                        return (
                          <>
                            <TableCell sx={{ padding: "8px" }}></TableCell>
                            <TableCell sx={{ padding: "4px" }}></TableCell>
                          </>
                        );
                      return (
                        <>
                          <TableCell sx={{ padding: "8px" }}>
                            <Typography fontSize="0.9rem">
                              {disease.labelJp || disease.diseaseCode}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ padding: "4px" }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Typography fontSize="0.85rem">(</Typography>
                              <TextField
                                size="small"
                                disabled={isViewMode}
                                defaultValue={
                                  getPastDisease(disease.diseaseCode).ageYear
                                }
                                name={`past_${disease.diseaseCode}_year`}
                                onChange={handleChange}
                                sx={{ width: "40px", backgroundColor: "white" }}
                              />
                              <Typography fontSize="0.85rem">歳</Typography>
                              <TextField
                                size="small"
                                disabled={isViewMode}
                                defaultValue={
                                  getPastDisease(disease.diseaseCode).ageMonth
                                }
                                name={`past_${disease.diseaseCode}_month`}
                                onChange={handleChange}
                                sx={{ width: "40px", backgroundColor: "white" }}
                              />
                              <Typography fontSize="0.85rem">か月)</Typography>
                            </Box>
                          </TableCell>
                        </>
                      );
                    };
                    return (
                      <>
                        <TableRow>
                          <TableCell
                            rowSpan={9}
                            sx={{
                              backgroundColor: "#f5f5f5",
                              textAlign: "center",
                              verticalAlign: "middle",
                              writingMode: "vertical-rl",
                              textOrientation: "upright",
                              padding: "16px 8px",
                            }}
                          >
                            <Typography sx={{ letterSpacing: "12px" }}>
                              既往症
                            </Typography>
                          </TableCell>
                          {renderDynamicCell(0)}
                          {renderDynamicCell(1)}
                          <TableCell rowSpan={2} sx={{ padding: "8px" }}>
                            <Typography fontSize="0.9rem">
                              {majorDisease ? majorDisease.labelJp : ""}
                            </Typography>
                          </TableCell>
                          <TableCell rowSpan={2} sx={{ padding: "4px" }}>
                            {majorDisease && (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 0.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Typography fontSize="0.85rem">(</Typography>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    disabled={isViewMode}
                                    placeholder="病名・内容"
                                    defaultValue={
                                      getPastDisease("MAJOR_INJURY").freeName
                                    }
                                    name="past_MAJOR_INJURY_name"
                                    onChange={handleChange}
                                    sx={{ backgroundColor: "white" }}
                                  />
                                  <Typography fontSize="0.85rem">)</Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Typography fontSize="0.85rem">(</Typography>
                                  <TextField
                                    size="small"
                                    disabled={isViewMode}
                                    sx={{
                                      width: "40px",
                                      backgroundColor: "white",
                                    }}
                                    defaultValue={
                                      getPastDisease("MAJOR_INJURY").ageYear
                                    }
                                    name="past_MAJOR_INJURY_year"
                                    onChange={handleChange}
                                  />
                                  <Typography fontSize="0.85rem">歳</Typography>
                                  <TextField
                                    size="small"
                                    disabled={isViewMode}
                                    sx={{
                                      width: "40px",
                                      backgroundColor: "white",
                                    }}
                                    defaultValue={
                                      getPastDisease("MAJOR_INJURY").ageMonth
                                    }
                                    name="past_MAJOR_INJURY_month"
                                    onChange={handleChange}
                                  />
                                  <Typography fontSize="0.85rem">
                                    か月)
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          {renderDynamicCell(2)}
                          {renderDynamicCell(3)}
                        </TableRow>
                        <TableRow>
                          {renderDynamicCell(4)}
                          {renderDynamicCell(5)}
                          <TableCell rowSpan={2} sx={{ padding: "8px" }}>
                            <Typography fontSize="0.9rem">
                              {otherDisease ? otherDisease.labelJp : ""}
                            </Typography>
                          </TableCell>
                          <TableCell rowSpan={2} sx={{ padding: "4px" }}>
                            {otherDisease && (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 0.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Typography fontSize="0.85rem">(</Typography>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    disabled={isViewMode}
                                    placeholder="病名"
                                    defaultValue={
                                      getPastDisease("OTHER_SERIOUS").freeName
                                    }
                                    name="past_OTHER_SERIOUS_name"
                                    onChange={handleChange}
                                    sx={{ backgroundColor: "white" }}
                                  />
                                  <Typography fontSize="0.85rem">)</Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Typography fontSize="0.85rem">(</Typography>
                                  <TextField
                                    size="small"
                                    disabled={isViewMode}
                                    sx={{
                                      width: "40px",
                                      backgroundColor: "white",
                                    }}
                                    defaultValue={
                                      getPastDisease("OTHER_SERIOUS").ageYear
                                    }
                                    name="past_OTHER_SERIOUS_year"
                                    onChange={handleChange}
                                  />
                                  <Typography fontSize="0.85rem">歳</Typography>
                                  <TextField
                                    size="small"
                                    disabled={isViewMode}
                                    sx={{
                                      width: "40px",
                                      backgroundColor: "white",
                                    }}
                                    defaultValue={
                                      getPastDisease("OTHER_SERIOUS").ageMonth
                                    }
                                    name="past_OTHER_SERIOUS_month"
                                    onChange={handleChange}
                                  />
                                  <Typography fontSize="0.85rem">
                                    か月)
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          {renderDynamicCell(6)}
                          {renderDynamicCell(7)}
                        </TableRow>
                        <TableRow>
                          {renderDynamicCell(8)}
                          <TableCell sx={{ padding: "8px" }}>
                            <Typography fontSize="0.9rem">
                              脱臼の経験
                            </Typography>
                          </TableCell>
                          <TableCell colSpan={3} sx={{ padding: "4px" }}>
                            <RadioGroup
                              row
                              defaultValue={getHealthItem("DISLOCATION").value}
                              name="item_DISLOCATION"
                              onChange={handleRadioChange}
                            >
                              <FormControlLabel
                                value="yes"
                                control={
                                  <Radio size="small" disabled={isViewMode} />
                                }
                                label="有"
                                sx={{ mr: 1 }}
                              />
                              <FormControlLabel
                                value="no"
                                control={
                                  <Radio size="small" disabled={isViewMode} />
                                }
                                label="無"
                              />
                            </RadioGroup>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          {renderDynamicCell(9)}
                          <TableCell sx={{ padding: "8px" }}>
                            <Typography fontSize="0.9rem">
                              けいれん(ひきつけ)
                            </Typography>
                          </TableCell>
                          <TableCell colSpan={3} sx={{ padding: "4px" }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <RadioGroup
                                row
                                defaultValue={getSeizureData().hasSeizure}
                                name="seizure_has"
                                onChange={handleRadioChange}
                              >
                                <FormControlLabel
                                  value="yes"
                                  control={
                                    <Radio size="small" disabled={isViewMode} />
                                  }
                                  label="有"
                                  sx={{ mr: 1 }}
                                />
                                <FormControlLabel
                                  value="no"
                                  control={
                                    <Radio size="small" disabled={isViewMode} />
                                  }
                                  label="無"
                                />
                              </RadioGroup>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Typography fontSize="0.85rem">
                                  (有熱
                                </Typography>
                                <TextField
                                  size="small"
                                  disabled={isViewMode}
                                  defaultValue={getSeizureData().withFever}
                                  name="seizure_fever_count"
                                  onChange={handleChange}
                                  sx={{
                                    width: "40px",
                                    backgroundColor: "white",
                                  }}
                                />
                                <Typography fontSize="0.85rem">
                                  回・無熱
                                </Typography>
                                <TextField
                                  size="small"
                                  disabled={isViewMode}
                                  defaultValue={getSeizureData().withoutFever}
                                  name="seizure_nofever_count"
                                  onChange={handleChange}
                                  sx={{
                                    width: "40px",
                                    backgroundColor: "white",
                                  }}
                                />
                                <Typography fontSize="0.85rem">回)</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          {renderDynamicCell(10)}
                          <TableCell sx={{ padding: "8px" }}>
                            <Typography fontSize="0.9rem">
                              初めてけいれんを起こした月齢
                            </Typography>
                          </TableCell>
                          <TableCell colSpan={3} sx={{ padding: "4px" }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Typography fontSize="0.85rem">(</Typography>
                              <TextField
                                size="small"
                                disabled={isViewMode}
                                defaultValue={getSeizureData().ageYear}
                                name="seizure_first_year"
                                onChange={handleChange}
                                sx={{ width: "40px", backgroundColor: "white" }}
                              />
                              <Typography fontSize="0.85rem">歳</Typography>
                              <TextField
                                size="small"
                                disabled={isViewMode}
                                defaultValue={getSeizureData().ageMonth}
                                name="seizure_first_month"
                                onChange={handleChange}
                                sx={{ width: "40px", backgroundColor: "white" }}
                              />
                              <Typography fontSize="0.85rem">か月)</Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          {renderDynamicCell(11)}
                          <TableCell sx={{ padding: "8px" }}>
                            <Typography fontSize="0.9rem">
                              {diseaseMaster.find(
                                (d) => d.diseaseCode === "ASTHMA"
                              )?.labelJp || "喘息"}
                              の診断
                            </Typography>
                          </TableCell>
                          <TableCell colSpan={3} sx={{ padding: "4px" }}>
                            <RadioGroup
                              row
                              defaultValue={getHealthItem("ASTHMA").value}
                              name="item_ASTHMA"
                              onChange={handleRadioChange}
                            >
                              <FormControlLabel
                                value="yes"
                                control={
                                  <Radio size="small" disabled={isViewMode} />
                                }
                                label="有"
                                sx={{ mr: 1 }}
                              />
                              <FormControlLabel
                                value="no"
                                control={
                                  <Radio size="small" disabled={isViewMode} />
                                }
                                label="無"
                              />
                            </RadioGroup>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          {renderDynamicCell(12)}
                          <TableCell sx={{ padding: "8px" }}>
                            <Typography fontSize="0.9rem">
                              アレルギーの診断
                            </Typography>
                          </TableCell>
                          <TableCell colSpan={3} sx={{ padding: "4px" }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <RadioGroup
                                row
                                defaultValue={getHealthItem("ALLERGY").value}
                                name="item_ALLERGY"
                                onChange={handleRadioChange}
                              >
                                <FormControlLabel
                                  value="yes"
                                  control={
                                    <Radio size="small" disabled={isViewMode} />
                                  }
                                  label="有"
                                  sx={{ mr: 1 }}
                                />
                                <FormControlLabel
                                  value="no"
                                  control={
                                    <Radio size="small" disabled={isViewMode} />
                                  }
                                  label="無"
                                />
                              </RadioGroup>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  flex: 1,
                                }}
                              >
                                <Typography fontSize="0.85rem">
                                  (有の場合:
                                </Typography>
                                <TextField
                                  size="small"
                                  disabled={isViewMode}
                                  defaultValue={getHealthItem("ALLERGY").note}
                                  name="item_ALLERGY_note"
                                  onChange={handleChange}
                                  sx={{
                                    flex: 1,
                                    minWidth: "100px",
                                    backgroundColor: "white",
                                  }}
                                />
                                <Typography fontSize="0.85rem">)</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })()}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {/* Constitution Table */}
        <Grid container spacing={2} className="pt-5 pl-3">
          <Grid item xs={12}>
            <TableContainer
              component={Box}
              sx={{ border: "1px solid #000", overflow: "auto" }}
            >
              <Table
                sx={{
                  minWidth: 650,
                  "& .MuiTableCell-root": {
                    border: "1px solid #000",
                    borderCollapse: "collapse",
                    whiteSpace: "nowrap",
                  },
                }}
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ width: "50px", p: 0, backgroundColor: "#f5f5f5" }}
                    />
                    <TableCell
                      align="center"
                      sx={{ p: 2, backgroundColor: "#f5f5f5" }}
                    />
                    {constitutionColumns.map((_col, index) => {
                      const age = index - 1;
                      const fiscalYear = startFiscalYear + age;
                      return (
                        <TableCell
                          key={index}
                          align="center"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            p: 1,
                            backgroundColor: "#f5f5f5",
                            minWidth: "90px",
                          }}
                        >
                          {index === 0 ? (
                            "入所時"
                          ) : (
                            <Box>
                              <Typography
                                sx={{ fontSize: "0.9rem", fontWeight: 600 }}
                              >
                                {fiscalYear}年度
                              </Typography>
                              <Typography sx={{ fontSize: "0.8rem" }}>
                                ({age}歳児)
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(() => {
                    const renderRadioCell = (
                      colIndex: number,
                      fieldName: string,
                      dbValue: any
                    ) => {
                      let defaultVal = "";
                      if (dbValue === true) defaultVal = "yes";
                      if (dbValue === false) defaultVal = "no";
                      return (
                        <TableCell
                          key={colIndex}
                          align="center"
                          sx={{ p: 0.5, backgroundColor: "white" }}
                        >
                          <RadioGroup
                            row
                            name={`const_${colIndex}_${fieldName}`}
                            defaultValue={defaultVal}
                            onChange={handleRadioChange}
                            sx={{
                              justifyContent: "center",
                              flexWrap: "nowrap",
                            }}
                          >
                            <FormControlLabel
                              value="yes"
                              control={
                                <Radio
                                  size="small"
                                  disabled={isViewMode}
                                  sx={{ p: 0.5, "& svg": { fontSize: 18 } }}
                                />
                              }
                              label={
                                <Typography sx={{ fontSize: "0.8rem" }}>
                                  有
                                </Typography>
                              }
                              sx={{ mr: 0.5, ml: 0 }}
                            />
                            <FormControlLabel
                              value="no"
                              control={
                                <Radio
                                  size="small"
                                  disabled={isViewMode}
                                  sx={{ p: 0.5, "& svg": { fontSize: 18 } }}
                                />
                              }
                              label={
                                <Typography sx={{ fontSize: "0.8rem" }}>
                                  無
                                </Typography>
                              }
                              sx={{ mr: 0, ml: 0 }}
                            />
                          </RadioGroup>
                        </TableCell>
                      );
                    };
                    return (
                      <>
                        <TableRow>
                          <TableCell
                            rowSpan={9}
                            align="center"
                            sx={{
                              p: 1,
                              backgroundColor: "white",
                              fontSize: "0.9rem",
                              writingMode: "vertical-rl",
                              textOrientation: "upright",
                              letterSpacing: "8px",
                            }}
                          >
                            現在の体質
                          </TableCell>
                          <TableCell
                            sx={{
                              p: 1,
                              backgroundColor: "white",
                              fontSize: "0.9rem",
                            }}
                          >
                            かぜをひきやすい
                          </TableCell>
                          {constitutionColumns.map((col, i) =>
                            renderRadioCell(
                              i,
                              "catchColdEasily",
                              col?.catchColdEasily
                            )
                          )}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              p: 1,
                              backgroundColor: "white",
                              fontSize: "0.9rem",
                            }}
                          >
                            発熱しやすい
                          </TableCell>
                          {constitutionColumns.map((col, i) =>
                            renderRadioCell(i, "feverEasily", col?.feverEasily)
                          )}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              p: 1,
                              backgroundColor: "white",
                              fontSize: "0.9rem",
                            }}
                          >
                            時々腹痛を訴える
                          </TableCell>
                          {constitutionColumns.map((col, i) =>
                            renderRadioCell(
                              i,
                              "stomachacheOften",
                              col?.stomachacheOften
                            )
                          )}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              p: 1,
                              backgroundColor: "white",
                              fontSize: "0.9rem",
                            }}
                          >
                            ゼイゼイがある
                          </TableCell>
                          {constitutionColumns.map((col, i) =>
                            renderRadioCell(i, "wheeze", col?.wheeze)
                          )}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              p: 1,
                              backgroundColor: "white",
                              fontSize: "0.9rem",
                            }}
                          >
                            湿疹ができやすい
                          </TableCell>
                          {constitutionColumns.map((col, i) =>
                            renderRadioCell(i, "eczema", col?.eczema)
                          )}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              p: 1,
                              backgroundColor: "white",
                              fontSize: "0.9rem",
                            }}
                          >
                            鼻血ができやすい
                          </TableCell>
                          {constitutionColumns.map((col, i) =>
                            renderRadioCell(i, "nosebleed", col?.nosebleed)
                          )}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              p: 1,
                              backgroundColor: "white",
                              fontSize: "0.9rem",
                            }}
                          >
                            中耳炎になりやすい
                          </TableCell>
                          {constitutionColumns.map((col, i) =>
                            renderRadioCell(i, "otitisMedia", col?.otitisMedia)
                          )}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              p: 1,
                              backgroundColor: "white",
                              fontSize: "0.9rem",
                            }}
                          >
                            平　熱
                          </TableCell>
                          {constitutionColumns.map((_col, i) => (
                            <TableCell
                              key={i}
                              sx={{ p: 1, backgroundColor: "white" }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 0.5,
                                }}
                              >
                                <TextField
                                  fullWidth
                                  size="small"
                                  disabled={isViewMode}
                                  name={`const_${i}_normalTempC`}
                                  defaultValue={getConstValue(i, "normalTempC")}
                                  onChange={handleChange}
                                  sx={{
                                    backgroundColor: "white",
                                    "& .MuiOutlinedInput-root fieldset": {
                                      border: "1px solid #ccc",
                                    },
                                    "& input": { textAlign: "center" },
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: "0.9rem",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  ℃
                                </Typography>
                              </Box>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            sx={{
                              p: 1,
                              backgroundColor: "white",
                              fontSize: "0.9rem",
                            }}
                          >
                            保育園で気をつけてほしいこと その他特記事項
                          </TableCell>
                          <TableCell
                            colSpan={7}
                            sx={{ p: 1, backgroundColor: "white" }}
                          >
                            <TextField
                              fullWidth
                              multiline
                              rows={2}
                              disabled={isViewMode}
                              name="const_0_careInNursery"
                              defaultValue={
                                constitutionColumns[0]?.careInNursery || ""
                              }
                              onChange={handleChange}
                              sx={{
                                backgroundColor: "white",
                                "& .MuiOutlinedInput-root fieldset": {
                                  border: "1px solid #ccc",
                                },
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })()}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {/* Teacher Assignments */}
        <Grid container spacing={2} className="pt-5 pl-3">
          <Grid item xs={12}>
            <TableContainer
              component={Box}
              sx={{ border: "1px solid #000", overflow: "auto" }}
            >
              <Table
                sx={{
                  minWidth: 650,
                  "& .MuiTableCell-root": {
                    border: "1px solid #000",
                    borderCollapse: "collapse",
                    whiteSpace: "nowrap",
                  },
                }}
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ width: "80px", p: 0, backgroundColor: "#f5f5f5" }}
                    />
                    {ageColumns.map((age) => {
                      const fy = startFiscalYear + age;
                      return (
                        <TableCell
                          key={age}
                          align="center"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            p: 1,
                            backgroundColor: "#f5f5f5",
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{ fontSize: "0.9rem", fontWeight: 600 }}
                            >
                              {fy}年度
                            </Typography>
                            <Typography sx={{ fontSize: "0.85rem" }}>
                              ({age}歳児)
                            </Typography>
                          </Box>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        p: 1,
                        backgroundColor: "white",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                    >
                      担任
                    </TableCell>
                    {ageColumns.map((age) => (
                      <TableCell
                        key={age}
                        sx={{ p: 1, backgroundColor: "white" }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          disabled={isViewMode}
                          name={`teacher_${age}_HN`}
                          defaultValue={getTeacher(age, "HN")}
                          onChange={handleChange}
                          sx={{
                            backgroundColor: "white",
                            "& .MuiOutlinedInput-root fieldset": {
                              border: "1px solid #ccc",
                            },
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        p: 1,
                        backgroundColor: "white",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                    >
                      副担任
                    </TableCell>
                    {ageColumns.map((age) => (
                      <TableCell
                        key={age}
                        sx={{ p: 1, backgroundColor: "white" }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          disabled={isViewMode}
                          name={`teacher_${age}_TN`}
                          defaultValue={getTeacher(age, "TN")}
                          onChange={handleChange}
                          sx={{
                            backgroundColor: "white",
                            "& .MuiOutlinedInput-root fieldset": {
                              border: "1px solid #ccc",
                            },
                          }}
                        />
                      </TableCell>
                    ))}
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
            onClick={() => navigate(-1)}
          >
            {t("overallplanadd.cancel")}
          </Button>
          {!isViewMode && (
            <Button
              variant="contained"
              color="success"
              startIcon={<Save />}
              onClick={handleSave}
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
          )}
        </Box>
      </ContentMain>
    </>
  );
}
