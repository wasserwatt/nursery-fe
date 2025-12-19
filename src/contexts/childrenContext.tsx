// childrenContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import axios from "../configs/axios"; // ตรวจสอบ path ให้ถูกต้อง
import { Socket } from "socket.io-client";

// กำหนด Type ให้ตรงกับ Prisma Model ที่ Backend ส่งมา (แบบคร่าวๆ)
export type ChildData = {
  childId: number;
  name_child: string;
  furigana: string;
  gender: string;
  eraName: string;
  bloodType: string;
  birthDate: string;
  admissionDate: string;
  graduationDate: string | null;
  healthLedgerFlag: boolean;
  healthCardFlag: boolean;
  addresses: any[];
  guardians: any[];
  commutes: any[];
  clinics: any[];
  birthInfo: any;
  infantDev: any;
  healthChecks: any[];
  medicalHistories: any[];
  constitutionHistories: any[];
  vaccinations: any[];
  teacherAssigns: any[];
  pastDiseases: any[];
  healthItems: any[];
  seizureHistories: any[];
  // ... เพิ่ม type อื่นๆ ตามที่ prisma include มา
};

type childContextType = {
  // เพิ่มฟังก์ชัน searchChildByName
  fetchChild: () => Promise<any>;
 searchChildByName: (furigana: string) => Promise<ChildData[]>;
  getChildById: (id: string) => Promise<ChildData | null>;
  createchild: (child: any) => Promise<void>;
  socket: Socket | null;
};

export const ChildrenContext = createContext<childContextType | undefined>(
  undefined
);

export const useChildren = (): childContextType => {
  const context = useContext(ChildrenContext);
  if (!context)
    throw new Error("useChildren must be used within ChildrenProvider");
  return context;
};

export const ChildrenProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);


  const fetchChild = async () => {
    try {
      const response = await axios.get('/children/');
      return response.data.children;
    } catch (error) {
      console.error("Error fetching child:", error);
      return null;
    }
  };

  const getChildById = async (id: string) => {
    try {
      // ยิงไปที่ endpoint ใหม่ (ตัวอย่าง path)
      const response = await axios.get(`/children/id/${id}`);
      return response.data.child;
    } catch (error) {
      console.error("Error fetching child by ID:", error);
      return null;
    }
  };

  // ฟังก์ชันค้นหา
 const searchChildByName = async (furigana: string) => {
    try {
      const response = await axios.post('/children/childrens', { 
        furigana: furigana 
      });
      
      // ✅ คืนค่าเป็น Array (ถ้า backend ส่ง children) หรือ Array ว่าง
      return response.data.children || []; 
    } catch (error) {
      console.error("Error searching child:", error);
      return []; // คืนค่า array ว่างเมื่อ error
    }
  };

  const createchild = async (child: any): Promise<void> => {
     await axios.post("/children/", child);
  };

   return (
      <ChildrenContext.Provider
        value={{
          searchChildByName,
          createchild,
          fetchChild,
          socket,
          getChildById,
        }}
      >
        {children}
      </ChildrenContext.Provider>
    );
  };