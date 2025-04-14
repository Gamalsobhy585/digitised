import { z } from "zod";
import { registerSchema } from "../schemas";
import { api } from "../../../lib/api-client";
import { ApiResponse } from "../../../lib/types";

export async function register(data: z.infer<typeof registerSchema>) {
  try {
    const res = await api.post<ApiResponse<null>>("/auth/register", data);
    return res.message;
  } catch (error) {
    console.error(error);
  }
}
