"use client";

import appConfig from "@/app/app.config";
import React from "react";
import { User } from "better-auth";
import { useForm } from "react-hook-form";
import { useUserById } from "@/app/hooks/hooks";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { IAuthUser } from "@/app/models/authuser";

interface AccountFormProps {
  sessionUser: User;
}

const FormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  username: z.string(),
  preferredDay1: z.coerce.number().min(0).max(appConfig.MAX_EVENT_DAYS).optional(),
  preferredDay2: z.coerce.number().min(0).max(appConfig.MAX_EVENT_DAYS).optional(),
});

export function AccountForm({ sessionUser }: AccountFormProps) {
  const { user } = useUserById(sessionUser.id);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      preferredDay1: 0,
      preferredDay2: 0,
    },
  });

  // Reset form with user data when it loads
  React.useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ")[1] || "",
        email: user.email || "",
        username: user.username || "",
        preferredDay1: user.preferredDays?.[0] ?? 0,
        preferredDay2: user.preferredDays?.[1] ?? 0,
      });
    }
  }, [user, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { email, firstName, lastName, username, preferredDay1, preferredDay2 } = data;

    try {
      const response = await fetch(`/api/user/${(user as any).id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          username,
          preferredDays: [preferredDay1, preferredDay2],
        }),
      });

      if (response.ok) {
        toast.success("Changes saved successfully!");
      } else {
        toast.error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Error saving changes");
    }
  }

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
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="nobody@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input disabled placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Label>Preffered Days</Label>
              <p className="text-xs font-light">Set as 0 to ignore</p>
              <div className="flex flex-row gap-2">
                <FormField
                  control={form.control}
                  name="preferredDay1"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Day 1</FormLabel>

                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredDay2"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Day 2</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}