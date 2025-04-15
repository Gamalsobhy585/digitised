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

export async function importFile(file: File): Promise<ApiResponse<any>> {
  if (!file) {
    return {
      code: 400,
      message: "No file provided",
      status: "error"
    };
  }
  
  const validTypes = [
    'text/csv',
    'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (!validTypes.includes(file.type)) {
    return {
      code: 400,
      message: "Invalid file type",
      status: "error"
    };
  }
  
  try {
    const formData = new FormData();
    formData.append('file', file, file.name);
    
    // The updated api.post will now handle FormData correctly
    const res = await api.post<ApiResponse<any>>('/tasks/import', formData);
    return res.data;
    
  } catch (error) {
    console.error('Upload error:', error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : "Upload failed",
      status: "error"
    };
  }
}
export async function changeOrder(firstTaskId: number, secondTaskId: number): Promise<ApiResponse<any>> {
  try {
    const response = await api.post<ApiResponse<any>>('/tasks/priority/change', {
      first_task_id: firstTaskId,
      second_task_id: secondTaskId
    });
    return response;
  } catch (error) {
    console.error("Error reordering tasks:", error);
    throw error;
  }
}