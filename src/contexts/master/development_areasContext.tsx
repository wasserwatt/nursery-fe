import React, { createContext, ReactNode, useContext } from "react";
import axios from "../../configs/axios";
import { Subarea } from "./SubareaContext";
export type M_development_areas = {
  goals: any;
  id: number;
  code: string;
  name_ja: string;
  name_en: string;
  yougo: Subarea[];
};

export type development_areasForm = {
  code: string;
  name_ja: string;
  name_en: string;
};

type Development_areasType = {
  fetchM_development_areas: () => Promise<M_development_areas[]>;
  fetchDevelopment_areasById: (id: number) => Promise<M_development_areas>;
  createDevelopment_areas: (
    form: development_areasForm
  ) => Promise<M_development_areas>;
  updateDevelopment_areas: (
    id: number,
    form: Partial<development_areasForm>
  ) => Promise<M_development_areas>;
  deleteDevelopment_areas: (id: number) => Promise<void>;
};

// สร้าง Context
export const Development_areasContext = createContext<
  Development_areasType | undefined
>(undefined);

export const useDevelopment_areas = () => {
  const context = useContext(Development_areasContext);
  if (!context) {
    throw new Error("useDevelopment areas must be used within Development areasProvider");
  }
  return context;
};

export const Development_areasProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
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

  const fetchDevelopment_areasById = async (
    id: number
  ): Promise<M_development_areas> => {
    try {
      const res = await axios.get(`/development-areas/${id}`);
      const data: M_development_areas = res.data;
      return data;
    } catch (err) {
      console.error(`Error fetching subarea id=${id}:`, err);
      throw err;
    }
  };

  const createDevelopment_areas = async (
    form: development_areasForm
  ): Promise<M_development_areas> => {
    try {
      const res = await axios.post("/development-areas", form);
      return res.data as M_development_areas;
    } catch (err) {
      console.error("Error creating Development areas:", err);
      throw err;
    }
  };

  const updateDevelopment_areas = async (
    id: number,
    form: Partial<development_areasForm>
  ): Promise<M_development_areas> => {
    try {
      const res = await axios.put(`/development-areas/${id}`, form);
      return res.data as M_development_areas;
    } catch (err) {
      console.error(`Error updating Development areas id=${id}:`, err);
      throw err;
    }
  };

  const deleteDevelopment_areas = async (id: number): Promise<void> => {
    try {
      await axios.delete(`/development-areas/${id}`);
    } catch (err) {
      console.error(`Error deleting Development areas id=${id}:`, err);
      throw err;
    }
  };

  return (
    <Development_areasContext.Provider
      value={{
        fetchM_development_areas,
        fetchDevelopment_areasById,
        createDevelopment_areas,
        updateDevelopment_areas,
        deleteDevelopment_areas,
      }}
    >
      {children}
    </Development_areasContext.Provider>
  );
};
