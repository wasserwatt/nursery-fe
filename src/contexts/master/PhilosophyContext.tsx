import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import axios from "../../configs/axios";
import { createSocket } from "../../configs/socket";
import { Socket } from "socket.io-client";

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
  Philosophy: M_philosophy[];
  socket: Socket | null;
};

// สร้าง Context
export const PhilosophyContext = createContext<
  PhilosophyContextType | undefined
>(undefined);

export const usePhilosophy = () => {
  const context = useContext(PhilosophyContext);
  if (!context) {
    throw new Error("usePhilosophy must be used within PhilosophyProvider");
  }
  return context;
};

export const PhilosophyProvider = ({ children }: { children: ReactNode }) => {
  // 🟩 Hooks ต้องประกาศในนี้เท่านั้น
  const [socket, setSocket] = useState<Socket | null>(null);
  const [Philosophy, setPhilosophy] = useState<M_philosophy[]>([]);

  const fetchM_philosophy = async (): Promise<M_philosophy[]> => {
    try {
      const response = await axios.get("/philosophy/");
      const data = response.data.philosophy;
      const sorted = data.sort(
        (a: { id: number }, b: { id: number }) => a.id - b.id
      );

      setPhilosophy(sorted);
      return sorted;
    } catch (error) {
      console.error("Error fetching M_philosophy:", error);
      throw error;
    }
  };

  const fetchPhilosophyById = async (id: number): Promise<M_philosophy> => {
    try {
      const res = await axios.get(`/philosophy/${id}`);
      return res.data;
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
      return res.data;
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
      return res.data;
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

  useEffect(() => {
    const s = createSocket();
    setSocket(s);

    const handleCreated = (philosophy: M_philosophy) => {
      setPhilosophy((prev) =>
        prev.some((p) => p.id === philosophy.id) ? prev : [philosophy, ...prev]
      );
    };

    const handleUpdated = (philosophy: M_philosophy) => {
      setPhilosophy((prev) =>
        prev.map((p) => (p.id === philosophy.id ? philosophy : p))
      );
    };

    const handleDeleted = (id: string) => {
      const idNum = Number(id);
      setPhilosophy((prev) => prev.filter((p) => p.id !== idNum));
    };

    s.on("philosophy:created", handleCreated);
    s.on("philosophy:updated", handleUpdated);
    s.on("philosophy:deleted", handleDeleted);

    return () => {
      s.off("philosophy:created", handleCreated);
      s.off("philosophy:updated", handleUpdated);
      s.off("philosophy:deleted", handleDeleted);
      s.disconnect();
    };
  }, []);

  return (
    <PhilosophyContext.Provider
      value={{
        fetchM_philosophy,
        fetchPhilosophyById,
        createPhilosophy,
        updatePhilosophy,
        deletePhilosophy,
        socket,
        Philosophy,
      }}
    >
      {children}
    </PhilosophyContext.Provider>
  );
};
