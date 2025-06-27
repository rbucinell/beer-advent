"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Divider, Stack } from "@mui/material";
import { signUpAuthForm } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Google } from "@mui/icons-material";

export default function SignIn() {

  const form = useForm<z.infer<typeof signUpAuthForm>>({
    resolver: zodResolver(signUpAuthForm),
    defaultValues: {
      "firstName": "",
      "lastName": "",
      "username": "",
      "email": "",
      "password": "",
    }
  });

  async function googleSignup() {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/dashboard',
    })
  }

  async function onSubmit(values: z.infer<typeof signUpAuthForm>) {
    const { firstName, lastName, username, email, password } = values;
    authClient.signUp.email({
      name: `${firstName} ${lastName}`, email, username, password, image: "",
      callbackURL: '/dashboard', //`user/${username}`
    }, {
      onRequest: () => {
        toast.info("Please wait...");
      },
      onSuccess: () => {
        form.reset();
        toast.success("Logged in successfully");
      },
      onError: (ctx) => {
        toast.error("Error", { description: ctx.error.message });
      }
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <Stack direction={"column"} gap={2}>

          <Button startIcon={<Google />} variant={"outlined"} onClick={googleSignup}> Google</Button>
          <Divider>or</Divider>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <div className="flex flex-row flex-wrap md:flex-nowrap">

                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl><Input placeholder="John" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>)}
                />

                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>)}
                />
              </div>

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input placeholder="odysseus@iliad.com" {...field} /></FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>)}
              />

              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Username</FormLabel>
                  <FormControl><Input placeholder="odysseus123" {...field} /></FormControl>
                  <FormDescription>This is your profile username</FormDescription>
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

              <Button variant={"contained"} type="submit">Submit</Button>
            </form>
          </Form>
        </Stack>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-primary hover:underline">Sign In</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
