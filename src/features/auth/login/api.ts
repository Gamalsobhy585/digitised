import { z } from "zod";
import { loginSchema } from "../schemas";
import { api } from "../../../lib/api-client";
import { ApiResponse } from "../../../lib/types";
import { User } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(data: z.infer<typeof loginSchema>) {
  return api.post<ApiResponse<User>>("/auth/login", data);
}
export async function logout() {
  return api.post("/auth/logout");
}


