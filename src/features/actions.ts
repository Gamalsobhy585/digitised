"use server";

import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function setServerCookie(
  serverCookies: { name: string; value: string }[]
) {
  const cookieStore = cookies() as unknown as ReadonlyRequestCookies;
  
  serverCookies.forEach((cookie) => {
    cookieStore.set(cookie.name, cookie.value, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  });
}

export async function getServerCookie(name: string) {
  const cookieStore = cookies() as unknown as ReadonlyRequestCookies;
  const serverCookie = cookieStore.get(name)?.value;
  return serverCookie;
}

export async function removeServerCookie(name: string) {
  const cookieStore = cookies() as unknown as ReadonlyRequestCookies;
  cookieStore.delete(name);
}