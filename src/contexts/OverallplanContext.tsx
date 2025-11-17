import React, { createContext, ReactNode, useContext } from "react";
import axios from "../configs/axios";

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
      const response = await axios.patch(`/overallplan/${id}`);

      // ถ้า backend ส่ง data ใน .data
      const data: OverallPlanForm = response.data;

      // console.log(data); // ดีสำหรับ debug
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
