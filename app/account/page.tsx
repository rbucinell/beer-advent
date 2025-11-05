import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { headers } from "next/headers";
import { AccountForm } from "./components/AccountForm";

export default async function Account() {

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/");
  }

  return (
    <main className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-6">
          <Avatar className="size-20 md:size-24 lg:size-32">
            <AvatarImage
              src={session.user.image ?? ""}
              alt="User Image"
            />
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">Account Settings</h1>
            <p className="text-muted-foreground text-sm">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <AccountForm sessionUser={session.user} />
      </div>
    </main>
  );
}
