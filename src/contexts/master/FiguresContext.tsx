import React, { createContext, ReactNode, useContext } from "react";
import axios from "../../configs/axios";

export type M_ten_figures = {
  id: number;
  ten_detail: string;
};

export type figuresForm = {
  ten_detail: string;
};

type CompetenciesType = {
  fetchM_ten_figures: () => Promise<M_ten_figures[]>;
  fetchFiguresById: (id: number) => Promise<M_ten_figures>;
  createFigures: (form: figuresForm) => Promise<M_ten_figures>;
  updateFigures: (
    id: number,
    form: Partial<figuresForm>
  ) => Promise<M_ten_figures>;
  deleteFigures: (id: number) => Promise<void>;
};

// สร้าง Context
export const FiguresContext = createContext<CompetenciesType | undefined>(
  undefined
);

export const useFigures = () => {
  const context = useContext(FiguresContext);
  if (!context) {
    throw new Error("useFigures  must be used within FiguresProvider");
  }
  return context;
};

export const FiguresProvider = ({ children }: { children: ReactNode }) => {
  const fetchM_ten_figures = async (): Promise<M_ten_figures[]> => {
    try {
      const response = await axios.get("/ten-figures/");
      const data: M_ten_figures[] = response.data.figures;
      return data; // คืนค่าให้ Component
    } catch (error) {
      console.error("Error fetching Figures:", error);
      throw error;
    }
  };

  const fetchFiguresById = async (id: number): Promise<M_ten_figures> => {
    try {
      const res = await axios.get(`/ten-figures/${id}`);
      const data: M_ten_figures = res.data;
      return data;
    } catch (err) {
      console.error(`Error fetching Figures id=${id}:`, err);
      throw err;
    }
  };

  const createFigures = async (form: figuresForm): Promise<M_ten_figures> => {
    try {
      const res = await axios.post("/ten-figures", form);
      return res.data as M_ten_figures;
    } catch (err) {
      console.error("Error creating Figures:", err);
      throw err;
    }
  };

  const updateFigures = async (
    id: number,
    form: Partial<figuresForm>
  ): Promise<M_ten_figures> => {
    try {
      const res = await axios.put(`/ten-figures/${id}`, form);
      return res.data as M_ten_figures;
    } catch (err) {
      console.error(`Error updating Figures id=${id}:`, err);
      throw err;
    }
  };

  const deleteFigures = async (id: number): Promise<void> => {
    try {
      await axios.delete(`/ten-figures/${id}`);
    } catch (err) {
      console.error(`Error deleting Figures id=${id}:`, err);
      throw err;
    }
  };

  return (
    <FiguresContext.Provider
      value={{
        fetchM_ten_figures,
        fetchFiguresById,
        createFigures,
        updateFigures,
        deleteFigures,
      }}
    >
      {children}
    </FiguresContext.Provider>
  );
};
