import React, { createContext, ReactNode, useContext } from "react";
import axios from "../../configs/axios";

export type M_philosophy = {
  id: number;
  philosophy_detail: string;
};

export type philosophyForm = {
  philosophy_detail: string;
};

type PhilosophyContextType = {
  fetchM_philosophy: () => Promise<M_philosophy[]>;
  fetchPhilosophyById: (id: number) => Promise<M_philosophy>;
  createPhilosophy: (form: philosophyForm) => Promise<M_philosophy>;
  updatePhilosophy: (
    id: number,
    form: Partial<philosophyForm>
  ) => Promise<M_philosophy>;
  deletePhilosophy: (id: number) => Promise<void>;
};

// สร้าง Context
export const PhilosophyContext = createContext<
  PhilosophyContextType | undefined
>(undefined);

export const usePhilosophy = () => {
  const context = useContext(PhilosophyContext);
  if (!context) {
    throw new Error("usePhilosophy  must be used within PhilosophyProvider");
  }
  return context;
};

export const PhilosophyProvider = ({ children }: { children: ReactNode }) => {
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

  const fetchPhilosophyById = async (id: number): Promise<M_philosophy> => {
    try {
      const res = await axios.get(`/philosophy/${id}`);
      const data: M_philosophy = res.data;
      return data;
    } catch (err) {
      console.error(`Error fetching philosophy id=${id}:`, err);
      throw err;
    }
  };

  const createPhilosophy = async (
    form: philosophyForm
  ): Promise<M_philosophy> => {
    try {
      const res = await axios.post("/philosophy", form);
      return res.data as M_philosophy;
    } catch (err) {
      console.error("Error creating philosophy:", err);
      throw err;
    }
  };

  const updatePhilosophy = async (
    id: number,
    form: Partial<philosophyForm>
  ): Promise<M_philosophy> => {
    try {
      const res = await axios.put(`/philosophy/${id}`, form);
      return res.data as M_philosophy;
    } catch (err) {
      console.error(`Error updating philosophy id=${id}:`, err);
      throw err;
    }
  };

  const deletePhilosophy = async (id: number): Promise<void> => {
    try {
      await axios.delete(`/philosophy/${id}`);
    } catch (err) {
      console.error(`Error deleting philosophy id=${id}:`, err);
      throw err;
    }
  };

  return (
    <PhilosophyContext.Provider
      value={{
        fetchM_philosophy,
        fetchPhilosophyById,
        createPhilosophy,
        updatePhilosophy,
        deletePhilosophy,
      }}
    >
      {children}
    </PhilosophyContext.Provider>
  );
};
