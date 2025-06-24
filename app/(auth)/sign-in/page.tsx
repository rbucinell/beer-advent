"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { signInAuthFormSchema } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignIn() {

  const form = useForm<z.infer<typeof signInAuthFormSchema>>({
    resolver: zodResolver(signInAuthFormSchema),
    defaultValues: {
      "email": "",
      "password": ""
    }
  });


  async function onSubmit(values: z.infer<typeof signInAuthFormSchema>) {
    const { email, password } = values;
    const { data, error } = await authClient.signIn.email({
      email, password, callbackURL: '/dashboard'
    }, {
      onRequest: () => {
        toast.info("Please wait...");
      },
      onSuccess: () => {
        form.reset();
      },
      onError: (ctx) => {
        toast.error("Error", { description: ctx.error.message });
      }
    });
    console.log(data, error);
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>SignIn</CardTitle>
        <CardDescription>Welcome back! Please sign in to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input placeholder="" {...field} /></FormControl>
                <FormMessage />
              </FormItem>)}
            />

            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>)}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account yet?{' '}
          <Link href="/sign-up" className="text-primary hover:underline">Sign Up</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
