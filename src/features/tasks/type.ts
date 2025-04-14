import { taskSchema } from "./schemas";
import { z } from "zod";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: number; 
  status_display: "pending" | "completed"; 
  due_date: string | null;
}

export const statusDisplayMap = {
  1: "pending",
  2: "completed"
} as const;

export const statusReverseMap = {
  pending: 1,
  completed: 2
} as const;


export type UpdateTaskVariables = {
  id: string;
  data: z.infer<typeof taskSchema>;
};

export const statusNumericMap = {
  pending: 1,
  completed: 2
} as const;
