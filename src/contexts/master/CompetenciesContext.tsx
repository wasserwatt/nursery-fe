import React, { createContext, ReactNode, useContext } from "react";
import axios from "../../configs/axios";

export type M_competencies = {
  id: number;
  competencies_detail: string;
};

export type competenciesForm = {
  competencies_detail: string;
};

type CompetenciesType = {
  fetchM_competencies: () => Promise<M_competencies[]>;
  fetchCompetenciesById: (id: number) => Promise<M_competencies>;
  createCompetencies: (form: competenciesForm) => Promise<M_competencies>;
  updateCompetencies: (
    id: number,
    form: Partial<competenciesForm>
  ) => Promise<M_competencies>;
  deleteCompetencies: (id: number) => Promise<void>;
};

// สร้าง Context
export const CompetenciesContext = createContext<CompetenciesType | undefined>(
  undefined
);

export const useCompetencies = () => {
  const context = useContext(CompetenciesContext);
  if (!context) {
    throw new Error("useCompetencies  must be used within CompetenciesProvider");
  }
  return context;
};

export const CompetenciesProvider = ({ children }: { children: ReactNode }) => {
  const fetchM_competencies = async (): Promise<M_competencies[]> => {
    try {
      const response = await axios.get("/competencies/");
      const data: M_competencies[] = response.data.competencies;
      return data; // คืนค่าให้ Component
    } catch (error) {
      console.error("Error fetching competencies:", error);
      throw error;
    }
  };

  const fetchCompetenciesById = async (id: number): Promise<M_competencies> => {
    try {
      const res = await axios.get(`/competencies/${id}`);
      const data: M_competencies = res.data;
      return data;
    } catch (err) {
      console.error(`Error fetching competencies id=${id}:`, err);
      throw err;
    }
  };

  const createCompetencies = async (
    form: competenciesForm
  ): Promise<M_competencies> => {
    try {
      const res = await axios.post("/competencies", form);
      return res.data as M_competencies;
    } catch (err) {
      console.error("Error creating competencies:", err);
      throw err;
    }
  };

  const updateCompetencies = async (
    id: number,
    form: Partial<competenciesForm>
  ): Promise<M_competencies> => {
    try {
      const res = await axios.put(`/competencies/${id}`, form);
      return res.data as M_competencies;
    } catch (err) {
      console.error(`Error updating competencies id=${id}:`, err);
      throw err;
    }
  };

  const deleteCompetencies = async (id: number): Promise<void> => {
    try {
      await axios.delete(`/competencies/${id}`);
    } catch (err) {
      console.error(`Error deleting competencies id=${id}:`, err);
      throw err;
    }
  };

  return (
    <CompetenciesContext.Provider
      value={{
        fetchM_competencies,
        fetchCompetenciesById,
        createCompetencies,
        updateCompetencies,
        deleteCompetencies,
      }}
    >
      {children}
    </CompetenciesContext.Provider>
  );
};
