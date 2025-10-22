import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { User, Lock, Bell, Star } from "lucide-react"

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
          <Avatar className="size-20">
            <AvatarImage src={user.image ?? ""} alt="User Image" />
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">Account Settings</h1>
            <p className="text-muted-foreground text-sm">Manage your account settings and preferences</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="w-full justify-start gap-6">
            <TabsTrigger value="profile" className="flex gap-1.5"><User className="size-4 mr-2" />Profile</TabsTrigger>
            <TabsTrigger value="security" className="flex gap-1.5"><Lock className="size-4 mr-2" />Security</TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-1.5"><Bell className="size-4 mr-2" />Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Profile Details</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Product Designer" readOnly />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Connected Accounts</h2>
                {[
                  { name: "GitHub", status: "Connected", action: "Disconnect" },
                  { name: "Google", status: "Not Connected", action: "Connect" },
                  { name: "Twitter", status: "Not Connected", action: "Connect" },
                ].map((account) => (
                  <div
                    key={account.name}
                    className="flex flex-col items-start justify-between gap-4 py-3 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                        <Star className="text-muted-foreground size-5" />
                      </div>
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-muted-foreground text-sm">{account.status}</p>
                      </div>
                    </div>
                    <Button variant={account.status === "Connected" ? "outline" : "default"}>{account.action}</Button>
                  </div>
                ))}
              </CardContent>
            </Card> */}
          </TabsContent>

          <TabsContent value="security" className="space-y-6" />
          <TabsContent value="notifications" className="space-y-6" />
        </Tabs>
      </div>
    </main>

    // <div className="mt-10 text-center">
    //   <h1 className="text-2xl font-bold underline">Account</h1>
    //   <ul>
    //     <li>Name: {user.name}</li>
    //     <li>Email: {user.email}</li>
    //     <li>Provier: {session.session.token}</li>
    //     <li><Image priority={true} src={user.image as string} alt="User image" width={200} height={200}></Image></li>
    //   </ul>
    // </div >
  )
}
