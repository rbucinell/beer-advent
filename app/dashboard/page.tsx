import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Dashboard() {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return redirect("/");
  }

  const user = session?.user;

  return (
    <div className="mt-10 text-center">
      <h1 className="text-2xl font-bold underline">Dashboard</h1>
      <ul>
        <li>Name: {user.name}</li>
        <li>Email: {user.email}</li>
        <li>Provier: {session.session.token}</li>
        <li><Image priority={true} src={user.image as string} alt="User image" width={200} height={200}></Image></li>
      </ul>
    </div >
  )
}
