// contexts/OverallplanContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import axios from "../configs/axios";
import { createSocket } from "../configs/socket";
import { Socket } from "socket.io-client";

export type OverallPlan = {
  id: string;
  year: string;
  child_vision: string;
  educator_vision: string;
  created_at: string;
};

export type OverallPlanForm = {
  year: string;
  philosophy_snapshot: string;
  child_vision: string;
  educator_vision: string;
  policies: any[];
  objectives: any[];
  figures: any[];
  pillars: any[];
  practices: any[];
  schedule: any[];
};

export type ObjectiveAgeForm = {
  title_id: number;
  yougo_snapshot: string;
  age0: string;
  age1: string;
  age2: string;
  age3: string;
  age4: string;
  age5: string;
};

type OverallPlanContextType = {
  fetchOverallPlans: () => Promise<OverallPlan[]>;
  fetchOverallPlanById: (id: number) => Promise<OverallPlanForm>;
  fetchOverallPlanYear: () => Promise<OverallPlanForm>;
  editOverallPlanMain: (id: number, form: OverallPlanForm) => Promise<void>;
  createOverallPlan: (form: OverallPlanForm) => Promise<void>;
  deleteOverallPlanMain: (id: number) => Promise<void>;
  plans: OverallPlan[];
  socket: Socket | null;
};

export const OverallPlanContext = createContext<
  OverallPlanContextType | undefined
>(undefined);

export const useOverallPlan = (): OverallPlanContextType => {
  const context = useContext(OverallPlanContext);
  if (!context)
    throw new Error("useOverallPlan must be used within OverallPlanProvider");
  return context;
};

export const OverallPlanProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [plans, setPlans] = useState<OverallPlan[]>([]);

  // Fetch plans
  const fetchOverallPlans = async () => {
    const response = await axios.get("/overallplan/getoverplans");
    const data = response.data;
    setPlans(data); // <-- แก้ตรงนี้เท่านั้น พอเลย
    return data;
  };

  const fetchOverallPlanById = async (id: number): Promise<OverallPlanForm> => {
    const response = await axios.get(`/overallplan/${id}`);
    return response.data;
  };

  const fetchOverallPlanYear = async (): Promise<OverallPlanForm> => {
    const response = await axios.get("/overallplan/");
    return response.data;
  };

  const deleteOverallPlanMain = async (id: number): Promise<void> => {
    await axios.patch(`/overallplan/${id}`);
    setPlans((prev) => prev.filter((p) => p.id !== String(id)));
  };

  const editOverallPlanMain = async (
    id: number,
    form: OverallPlanForm
  ): Promise<void> => {
    await axios.put(`/overallplan/${id}`, form);
    setPlans((prev) =>
      prev.map((p) => (p.id === String(id) ? { ...p, ...form } : p))
    );
  };

  const createOverallPlan = async (form: OverallPlanForm): Promise<void> => {
    const response = await axios.post("/overallplan/", form);
    const newPlan: OverallPlan = response.data;
    setPlans((prev) => [newPlan, ...prev]);
  };

  useEffect(() => {
    const s = createSocket();
    setSocket(s);

    const handleCreated = (plan: OverallPlan) => {
      //  console.log("Socket created:", plan); 
      setPlans((prev) =>
        prev.some((p) => p.id === plan.id) ? prev : [plan, ...prev]
      );
    };
    const handleUpdated = (plan: OverallPlan) => {
      // console.log("Socket updated:", plan);
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? plan : p)));
    };
    const handleDeleted = (id: string) => {
      const idNum = Number(id);
      setPlans((prev) => prev.filter((p) => Number(p.id) !== idNum));
    };

    s.on("overallplan:created", handleCreated);
    s.on("overallplan:updated", handleUpdated);
    s.on("overallplan:deleted", handleDeleted);

    return () => {
      s.off("overallplan:created", handleCreated);
      s.off("overallplan:updated", handleUpdated);
      s.off("overallplan:deleted", handleDeleted);
      s.disconnect();
    };
  }, []);

  return (
    <OverallPlanContext.Provider
      value={{
        fetchOverallPlans,
        fetchOverallPlanById,
        fetchOverallPlanYear,
        editOverallPlanMain,
        createOverallPlan,
        deleteOverallPlanMain,
        plans,
        socket,
      }}
    >
      {children}
    </OverallPlanContext.Provider>
  );
};
