import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import axios from "../../configs/axios"; 
import { Socket } from "socket.io-client";
export type feeding = {
  feedingId: string;
  feedingTypeCode: string;
  feedingTypeJp: string;
};
type feedingType = {
    fetchfeeding: () => Promise<feeding[]>;
};
export const M_feedingContext = createContext<feedingType | undefined>(
    undefined
);
export const useM_feeding = (): feedingType => {
    const context = useContext(M_feedingContext);
    if (!context)
        throw new Error("useM_feeding must be used within M_feedingProvider");
    return context;
};
export const M_feedingProvider = ({ children }: { children: ReactNode }) => {
    const fetchfeeding = async (): Promise<feeding[]> => {
    try {
        const response = await axios.get("/feeding/");
        const data: feeding[] = response.data.feedingTypes;
        return data; // คืนค่าให้ Component
    }
    catch (error) {
        console.error("Error fetching feeding:", error);
        throw error;
    }
    };
    return (
    <M_feedingContext.Provider
        value={{
        fetchfeeding,
        }}
    >
        {children}
    </M_feedingContext.Provider>
    );
};