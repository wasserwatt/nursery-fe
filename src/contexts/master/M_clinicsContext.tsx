import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import axios from "../../configs/axios"; 
import { Socket } from "socket.io-client";

export type clinics = {
  clinicId: string;
  clinicTypeCode: string;
  clinicTypeJp: string;
};

type clinicsType = {
  fetchclinics: () => Promise<clinics[]>;
};
export const M_clinicsContext = createContext<clinicsType | undefined>(
    undefined
);
export const useM_clinics = (): clinicsType => {
    const context = useContext(M_clinicsContext);
    if (!context)
        throw new Error("useM_clinics must be used within M_clinicsProvider");
    return context;
};
export const M_clinicsProvider = ({ children }: { children: ReactNode }) => {
    const fetchclinics = async (): Promise<clinics[]> => {
    try {
        const response = await axios.get("/clinics/");
        const data: clinics[] = response.data.clinics;
        return data; // คืนค่าให้ Component
    } catch (error) {
        console.error("Error fetching clinics:", error);
        throw error;
    }
    };
    return (
    <M_clinicsContext.Provider
        value={{
        fetchclinics,
        }}
    >
        {children}
    </M_clinicsContext.Provider>
    );
};
