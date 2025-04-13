"use server";

import { getServerCookie } from "../features/actions";

export async function checkAuth() {
  const token = await getServerCookie("token");

  return { isAuthenticated: !!token };
}
