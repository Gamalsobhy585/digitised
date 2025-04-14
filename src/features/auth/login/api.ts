import { z } from "zod";
import { loginSchema } from "../schemas";
import { api } from "../../../lib/api-client";
import { ApiResponse } from "../../../lib/types";
import { User } from "./types";



export async function login(data: z.infer<typeof loginSchema>) {
  return api.post<ApiResponse<User>>("/login", data);
}

export async function logout() {
  return api.post<ApiResponse<null>>("/logout");
}