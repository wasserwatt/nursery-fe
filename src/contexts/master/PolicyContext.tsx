import React, { createContext, ReactNode, useContext } from "react";
import axios from "../../configs/axios";

export type M_policy = {
  id: number;
  policy_detail: string;
};

export type policyForm = {
  policy_detail: string;
};

type PolicyContextType = {
  fetchM_policy: () => Promise<M_policy[]>;
  fetchPolicyById: (id: number) => Promise<M_policy>;
  createPolicy: (form: policyForm) => Promise<M_policy>;
  updatePolicy: (id: number, form: Partial<policyForm>) => Promise<M_policy>;
  deletePolicy: (id: number) => Promise<void>;
};

// สร้าง Context
export const PolicyContext = createContext<PolicyContextType | undefined>(
  undefined
);

export const usePolicy = () => {
  const context = useContext(PolicyContext);
  if (!context) {
    throw new Error("usePolicy  must be used within PolicyProvider");
  }
  return context;
};

export const PolicyProvider = ({ children }: { children: ReactNode }) => {
  const fetchM_policy = async (): Promise<M_policy[]> => {
    try {
      const response = await axios.get("/policy/");
      const data: M_policy[] = response.data.policies;
      return data; // คืนค่าให้ Component
    } catch (error) {
      console.error("Error fetching M_policy:", error);
      throw error;
    }
  };

  const fetchPolicyById = async (id: number): Promise<M_policy> => {
    try {
      const res = await axios.get(`/policy/${id}`);
      const data: M_policy = res.data;
      return data;
    } catch (err) {
      console.error(`Error fetching policy id=${id}:`, err);
      throw err;
    }
  };

  const createPolicy = async (form: policyForm): Promise<M_policy> => {
    try {
      const res = await axios.post("/policy", form);
      return res.data as M_policy;
    } catch (err) {
      console.error("Error creating policy:", err);
      throw err;
    }
  };

  const updatePolicy = async (
    id: number,
    form: Partial<policyForm>
  ): Promise<M_policy> => {
    try {
      const res = await axios.put(`/policy/${id}`, form);
      return res.data as M_policy;
    } catch (err) {
      console.error(`Error updating policy id=${id}:`, err);
      throw err;
    }
  };

  const deletePolicy = async (id: number): Promise<void> => {
    try {
      await axios.delete(`/policy/${id}`);
    } catch (err) {
      console.error(`Error deleting policy id=${id}:`, err);
      throw err;
    }
  };

  return (
    <PolicyContext.Provider
      value={{
        fetchM_policy,
        fetchPolicyById,
        createPolicy,
        updatePolicy,
        deletePolicy,
      }}
    >
      {children}
    </PolicyContext.Provider>
  );
};
