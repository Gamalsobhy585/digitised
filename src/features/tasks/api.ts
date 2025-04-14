import { z } from "zod"; 
import { taskSchema } from "./schemas";
import { api } from "../../lib/api-client"; 
import { ApiResponse } from "../../lib/types";



export const getTasks = async ({
  page = 1,
  query = "",
  filter = "",
}: {
  page: number;
  query?: string;
  filter?: string;
}) => {
  try {
    const res = await api.get<ApiResponse<any>>("/tasks", {
      params: {
        query,
        filter,
        page
      }
    });
    return res;
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
};

export async function getTask(id: string) {
  try {
    const res = await api.get<ApiResponse<any>>(`/tasks/${id}`);
    return res.data;
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}

export async function updateTask(
  id: string,
  task: z.infer<typeof taskSchema>
) {
  try {
    const res = await api.patch<ApiResponse<any>>(`/tasks/${id}`, task);
    return res;
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}

export async function createTask(task: z.infer<typeof taskSchema>) {
  try {
    const res = await api.post<ApiResponse<any>>("/tasks", task);
    return res;
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}

export async function deleteTask(id: string) {
  try {
    const res = await api.delete<ApiResponse<any>>(`/tasks/${id}`);
    return res;
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}