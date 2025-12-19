import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import axios from "../../configs/axios"; 
import { Socket } from "socket.io-client";

export type diseases = {
  diseaseCode: string;
  labelJp: string;
  labelTh: string;
};

type diseaseType = {
    fetchdiseases: () => Promise<diseases[]>;
};
export const M_diseaseContext = createContext<diseaseType | undefined>(
    undefined
);
export const useM_disease = (): diseaseType => {
    const context = useContext(M_diseaseContext);
    if (!context)
        throw new Error("useM_disease must be used within M_diseaseProvider");
    return context;
};
export const M_diseaseProvider = ({ children }: { children: ReactNode }) => {
    const fetchdiseases = async (): Promise<diseases[]> => {
    try {
        const response = await axios.get("/diseases");
        const data: diseases[] = response.data.diseaseTypes;
        return data; // คืนค่าให้ Component
    }   
    catch (error) {
        console.error("Error fetching diseases:", error);
        throw error;
    }   
    };
    return (
    <M_diseaseContext.Provider
        value={{
        fetchdiseases,
        }}
    >
        {children}
    </M_diseaseContext.Provider>
    );
};