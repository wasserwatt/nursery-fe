import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import axios from "../../configs/axios"; 
import { Socket } from "socket.io-client";

export type vaccine = {
    vaccineId: string;
    vaccineTypeCode: string;
    vaccineTypeJp: string;
    minAgeMonth: number;
    maxAgeMonth: number;
    note: string;
};

type vaccineType = {
    fetchvaccine: () => Promise<vaccine[]>;
};
export const M_vaccineContext = createContext<vaccineType | undefined>(
    undefined
);
export const useM_vaccine = (): vaccineType => {
    const context = useContext(M_vaccineContext);
    if (!context)
        throw new Error("useM_vaccine must be used within M_vaccineProvider");
    return context;
};
export const M_vaccineProvider = ({ children }: { children: ReactNode }) => {
    const fetchvaccine = async (): Promise<vaccine[]> => {
    try {
        const response = await axios.get("/vaccines");
        const data: vaccine[] = response.data.vaccines;
        return data; // คืนค่าให้ Component
    }
    catch (error) {
        console.error("Error fetching vaccine:", error);
        throw error;
    }
    };
    return (
    <M_vaccineContext.Provider
        value={{
        fetchvaccine,
        }}
    >
        {children}
    </M_vaccineContext.Provider>
    );
};