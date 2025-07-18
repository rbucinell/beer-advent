import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User, Lock, Bell, Star } from "lucide-react";
import AuthUser from "../models/authuser";

export default async function Account() {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return redirect("/");
  }

  const user = session?.user;

  return (
    <main className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-6">
          <Avatar className="size-20 md:size-24 lg:size-32">
            <AvatarImage src={user.image ?? ""} alt="User Image" />
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">Account Settings</h1>
            <p className="text-muted-foreground text-sm">Manage your account settings and preferences</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Profile Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={user.name.split(' ')[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" defaultValue={user.name.split(' ')[1]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue={user.username ?? ""} disabled className="text-base-content" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main >
  )
}
