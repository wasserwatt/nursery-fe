import React, { createContext, ReactNode, useContext } from "react";
import axios from "../configs/axios";

// Type ของข้อมูล Policy
export type M_philosophy = {
  philosophy_detail: string;
};

export type M_policy = {
  id: number;
  policy_detail: string;
};

export type Yougo = {
  id: number;
  development_area_id: number;
  title_id: number;
  title: string;
  no_desc: number;
  yougo_desc: string;
};

export type M_development_areas = {
  goals: any;
  id: number;
  code: string;
  name_ja: string;
  name_en: string;
  yougo: Yougo[];
};

export type M_competencies = {
  id: number;
  competencies_detail: string;
};

export type M_ten_figures = {
  id: number;
  ten_detail: string;
};

export type OverallPlan = {
  id: string;
  year: string;
  child_vision: string;
  educator_vision: string;
  created_at: string;
};

export type PolicyForm = {
  policy_master_id: number;
  policy_text_snap: string;
};

export type ObjectiveAgeForm = {
  title_id: number;
  yougo_snapshot: string;
  age0: string;
  age1: string;
  age2: string;
  age3: string;
  age4: string;
  age5: string;
};

export type FiguresForm = {
  ref_id: number;
  type: string;
  title_snapshot: string;
};

export type PillarsForm = {
  physical_mental_health: string;
  relationships_people: string;
  relationships_environment: string;
  respect_human_rights: string;
  respect_expression: string;
  guardian_support_collaboration: string;
  community_collaboration: string;
  school_connection: string;
};

export type PracticesForm = {
  health_support: string;
  environment_sanitation_safety: string;
  food_education: string;
  neuvola_support: string;
  guardian_support: string;
  support_childcare: string;
};

export type ScheduleForm = {
  month: string;
  event_school: string;
  event_seasonal: string;
  food_education: string;
  health: string;
  neuvola: string;
  staff_training: string;
};

export type OverallPlanForm = {
  year: string;
  philosophy_snapshot: string;
  child_vision: string;
  educator_vision: string;
  policies: PolicyForm[];
  objectives: ObjectiveAgeForm[];
  figures: FiguresForm[];
  pillars: PillarsForm[];
  practices: PracticesForm[];
  schedule: ScheduleForm[];
};

// Type ของ Context
type OverallPlanContextType = {
  fetchM_philosophy: () => Promise<M_philosophy[]>;
  fetchM_policy: () => Promise<M_policy[]>;
  fetchM_development_areas: () => Promise<M_development_areas[]>;
  fetchM_development_Yougo: () => Promise<Yougo[]>;
  fetchM_competencies: () => Promise<M_competencies[]>;
  fetchM_ten_figures: () => Promise<M_ten_figures[]>;
  fetchOverallPlans: () => Promise<OverallPlan[]>;
  fetchOverallPlanById: (id: number) => Promise<OverallPlanForm>;
  fetchOverallPlanYear: () => Promise<OverallPlanForm>;
  editOverallPlanMain: (id: number, form: OverallPlanForm) => Promise<void>;
  createOverallPlan: (form: OverallPlanForm) => Promise<void>;
  deleteOverallPlanMain: (id: number) => Promise<OverallPlanForm>;
};

// สร้าง Context
export const OverallPlanContext = createContext<
  OverallPlanContextType | undefined
>(undefined);

export const useOverallPlan = () => {
  const context = useContext(OverallPlanContext);
  if (!context) {
    throw new Error("useOverallPlan must be used within OverallPlanProvider");
  }
  return context;
};

// Provider
export const OverallPlanProvider = ({ children }: { children: ReactNode }) => {
  // ฟังก์ชัน async ดึงข้อมูลจาก API
  const fetchOverallPlans = async (): Promise<OverallPlan[]> => {
    try {
      const response = await axios.get("/overallplan/getoverplans");
      const data: OverallPlan[] = response.data;
      return data; // คืนค่าให้ Component
    } catch (error) {
      console.error("Error fetching overall plans:", error);
      throw error;
    }
  };

  const fetchOverallPlanById = async (id: number): Promise<OverallPlanForm> => {
    try {
      const response = await axios.get(`/overallplan/${id}`);

      // ถ้า backend ส่ง data ใน .data
      const data: OverallPlanForm = response.data;

      // console.log(data); // ดีสำหรับ debug
      return data;
    } catch (error) {
      console.error("Error fetching overall plan by ID:", error);
      throw error;
    }
  };

   const fetchOverallPlanYear = async (): Promise<OverallPlanForm> => {
    try {
      const response = await axios.get(`/overallplan/`);

      // ถ้า backend ส่ง data ใน .data
      const data: OverallPlanForm = response.data;

      // console.log(data); // ดีสำหรับ debug
      return data;
    } catch (error) {
      console.error("Error fetching overall plan by ID:", error);
      throw error;
    }
  };

    const deleteOverallPlanMain = async (id: number): Promise<OverallPlanForm> => {
    try {
      const response = await axios.delete(`/overallplan/${id}`);

      // ถ้า backend ส่ง data ใน .data
      const data: OverallPlanForm = response.data;

      console.log(data); // ดีสำหรับ debug
      return data;
    } catch (error) {
      console.error("Error fetching overall plan by ID:", error);
      throw error;
    }
  };

  const editOverallPlanMain = async (
    id: number,
    form: OverallPlanForm
  ): Promise<void> => {
    try {
      await axios.put(`/overallplan/${id}`, form);
      console.log("Overall Plan updated successfully");
    } catch (error) {
      console.error("Error updating overall plan:", error);
      throw error;
    }
  };

  const fetchM_philosophy = async (): Promise<M_philosophy[]> => {
    try {
      const response = await axios.get("/philosophy/");
      const data: M_philosophy[] = response.data.philosophy;
      return data; // คืนค่าให้ Component
    } catch (error) {
      console.error("Error fetching M_philosophy:", error);
      throw error;
    }
  };

  const fetchM_policy = async (): Promise<M_policy[]> => {
    try {
      const response = await axios.get("/policy/");
      const data: M_policy[] = response.data.policies;
      return data; // คืนค่าให้ Component
    } catch (error) {
      console.error("Error fetching M_policy:", error);
      throw error;
    }
  };

  const fetchM_development_areas = async (): Promise<M_development_areas[]> => {
    try {
      const response = await axios.get("/development-areas/");
      const data: M_development_areas[] = response.data.areas;
      return data; // คืนค่าให้ Component
    } catch (error) {
      console.error("Error fetching development areas:", error);
      throw error;
    }
  };

  const fetchM_development_Yougo = async (): Promise<Yougo[]> => {
    try {
      const response = await axios.get("/yougo/");
      const data: Yougo[] = response.data.yougos;
      return data; // คืนค่าให้ Component
    } catch (error) {
      console.error("Error fetching development areas:", error);
      throw error;
    }
  };

  const fetchM_competencies = async (): Promise<M_competencies[]> => {
    try {
      const response = await axios.get("/competencies/");
      const data: M_competencies[] = response.data.competencies;
      return data; // คืนค่าให้ Component
    } catch (error) {
      console.error("Error fetching development areas:", error);
      throw error;
    }
  };

  const fetchM_ten_figures = async (): Promise<M_ten_figures[]> => {
    try {
      const response = await axios.get("/ten-figures/");
      const data: M_ten_figures[] = response.data.figures;
      return data; // คืนค่าให้ Component
    } catch (error) {
      console.error("Error fetching development areas:", error);
      throw error;
    }
  };

  const createOverallPlan = async (form: OverallPlanForm): Promise<void> => {
    try {
      const response = await axios.post("/overallplan/", form);
      console.log("Overall Plan created:", response.data);
    } catch (error) {
      console.error("Error creating overall plan:", error);
      throw error;
    }
  };

  return (
    <OverallPlanContext.Provider
      value={{
        fetchM_philosophy,
        fetchM_policy,
        fetchM_development_areas,
        fetchM_development_Yougo,
        fetchM_competencies,
        fetchM_ten_figures,
        createOverallPlan,
        fetchOverallPlans,
        fetchOverallPlanById,
        editOverallPlanMain,
        deleteOverallPlanMain,
        fetchOverallPlanYear,
      }}
    >
      {children}
    </OverallPlanContext.Provider>
  );
};
