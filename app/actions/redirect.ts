"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function redirectToAccount() {
  redirect("/account");
}

export async function redirectTo( path:string ) {
  redirect(path);
}