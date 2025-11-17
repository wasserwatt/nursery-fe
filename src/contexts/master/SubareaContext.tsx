// src/contexts/SubareaContext.tsx
import React, { createContext, ReactNode, useContext } from "react";
import axios from "../../configs/axios";

// type ของ Subarea (map จาก Yougo)
export type Subarea = {
  id: number;
  development_area_id: number;
  title_id: number;
  title: string;
  no_desc: number;
  yougo_desc: string;
};

// เวลา create / update ไม่ต้องส่ง id
export type SubareaForm = {
  development_area_id: number;
  title_id: number;
  title: string;
  no_desc: number;
  yougo_desc: string;
};

type SubareaContextType = {
  fetchSubareas: () => Promise<Subarea[]>;
  fetchSubareaById: (id: number) => Promise<Subarea>;
  createSubarea: (form: SubareaForm) => Promise<Subarea>;
  updateSubarea: (id: number, form: Partial<SubareaForm>) => Promise<Subarea>;
  deleteSubarea: (id: number) => Promise<void>;
};

// สร้าง Context
const SubareaContext = createContext<SubareaContextType | undefined>(undefined);

// custom hook
export const useSubarea = () => {
  const context = useContext(SubareaContext);
  if (!context) {
    throw new Error("useSubarea must be used within SubareaContextProvider");
  }
  return context;
};

// Provider
export const SubareaContextProvider = ({ children }: { children: ReactNode }) => {
  // 🔹 GET /yougo  → ดึงทั้งหมด
  const fetchSubareas = async (): Promise<Subarea[]> => {
    try {
      const res = await axios.get("/yougo"); 
      const data: Subarea[] = res.data.yougos ?? res.data;
      return data;
    } catch (err) {
      console.error("Error fetching subareas:", err);
      throw err;
    }
  };

  // 🔹 GET /yougo/:id
  const fetchSubareaById = async (id: number): Promise<Subarea> => {
    try {
      const res = await axios.get(`/yougo/${id}`);
      const data: Subarea = res.data;
      return data;
    } catch (err) {
      console.error(`Error fetching subarea id=${id}:`, err);
      throw err;
    }
  };

  // 🔹 POST /yougo
  const createSubarea = async (form: SubareaForm): Promise<Subarea> => {
    try {
      const res = await axios.post("/yougo", form);
      return res.data as Subarea;
    } catch (err) {
      console.error("Error creating subarea:", err);
      throw err;
    }
  };

  // 🔹 PUT /yougo/:id
  const updateSubarea = async (
    id: number,
    form: Partial<SubareaForm>
  ): Promise<Subarea> => {
    try {
      const res = await axios.put(`/yougo/${id}`, form);
      return res.data as Subarea;
    } catch (err) {
      console.error(`Error updating subarea id=${id}:`, err);
      throw err;
    }
  };

  // 🔹 DELETE /yougo/:id
  const deleteSubarea = async (id: number): Promise<void> => {
    try {
      await axios.delete(`/yougo/${id}`);
    } catch (err) {
      console.error(`Error deleting subarea id=${id}:`, err);
      throw err;
    }
  };

  return (
    <SubareaContext.Provider
      value={{
        fetchSubareas,
        fetchSubareaById,
        createSubarea,
        updateSubarea,
        deleteSubarea,
      }}
    >
      {children}
    </SubareaContext.Provider>
  );
};
