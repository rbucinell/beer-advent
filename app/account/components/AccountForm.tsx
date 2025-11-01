// app/account/AccountForm.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { IAuthUser } from "@models/authuser";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AccountFormProps {
  user: IAuthUser;
}

const FormSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    username: z.string(),
    preferredDay1: z.coerce.number().min(0).max(24).optional(),
    preferredDay2: z.coerce.number().min(0).max(24).optional(),
})

export function AccountForm({ user }: AccountFormProps) {

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const{ email, firstName, lastName, username, preferredDay1, preferredDay2 } = data;
    console.log( 'data', data );
    console.log( 'user', user );
    console.log( `id: ${(user as any).id}` );
    try {

      const response = await fetch(`/api/user/${(user as any).id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          username,
          preferredDays: [preferredDay1, preferredDay2]
        })
      });

      if (response.ok) {
        toast.success('Changes saved successfully!');
      } else {
        toast.error('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes');
    }
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver:zodResolver(FormSchema),
     defaultValues: {
      firstName: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ')[1] || '',
      email: user.email || '',
      username: user.username || '',
      preferredDay1: user.preferredDays?.[0] ?? 0,
      preferredDay2: user.preferredDays?.[1] ?? 0,
    },
  })

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Profile Details</h2>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                        <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                        <Input placeholder="nobody@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input disabled placeholder="username" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                        This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                    </FormItem>
                )}/>
                <div>
                <Label>
                    Preffered Days
                </Label>
                <p className="text-xs font-light">Set as 0 to ignore</p>
                <div className="flex flex-row gap-2">
                    <FormField control={form.control} name="preferredDay1" render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>Day 1</FormLabel>
                       
                        <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                    <FormField control={form.control} name="preferredDay2" render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>Day 2</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                </div>
                </div>
                <div className="mt-6 flex justify-end">
          {/* <Button onClick={handleSaveChanges}>Save Changes</Button> */}
          <Button type="submit">Save Changes</Button>
        </div>
          </form>
           
        </Form>
       
      </CardContent>

    </Card>
        // <div className="grid gap-4 md:grid-cols-2">
        //   <div className="space-y-2">
        //     <Label htmlFor="firstName">First Name</Label>
        //     <Input 
        //       id="firstName" 
        //       value={firstName}
        //       onChange={(e) => setFirstName(e.target.value)}
        //     />
        //   </div>
        //   <div className="space-y-2">
        //     <Label htmlFor="lastName">Last name</Label>
        //     <Input 
        //       id="lastName" 
        //       value={lastName}
        //       onChange={(e) => setLastName(e.target.value)}
        //     />
        //   </div>
        //   <div className="space-y-2">
        //     <Label htmlFor="email">Email</Label>
        //     <Input 
        //       id="email" 
        //       type="email" 
        //       value={email}
        //       onChange={(e) => setEmail(e.target.value)}
        //     />
        //   </div>
        //   <div className="space-y-2">
        //     <Label htmlFor="username">Username</Label>
        //     <Input 
        //       id="username" 
        //       defaultValue={user.username ?? ""} 
        //       disabled 
        //       className="text-base-content" 
        //     />
        //   </div>
        //   <div className="space-y-2">
        //     <Label htmlFor="preferredDays">Preferred Days</Label>
        //     <Input 
        //       id="preferredDay1" 
        //       type="number"
        //       value={preferredDay1}
        //       min={1} max={24}
        //       onChange={(e) => setPreferredDay1(e.target.value ? Number(e.target.value) : '')}
        //       className="text-base-content"
        //       defaultValue={undefined}
        //       placeholder="0"
        //     />
        //     <Input 
        //       id="preferredDay2" 
        //       type="number"
        //       value={preferredDay2}
        //       min={1} max={24}
        //       onChange={(e) => setPreferredDay2(e.target.value ? Number(e.target.value) : '')}
        //       className="text-base-content" 
        //       defaultValue={undefined}
        //       placeholder="0"
        //     />
        //   </div>
        // </div>
  );
}