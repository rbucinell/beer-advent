import { username } from 'better-auth/plugins';
import { z } from 'zod';

const alphaNumeric = /^[a-z0-9]+$/;

export const signUpAuthForm = z.object({
  firstName: z.string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),

  lastName: z.string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),

  username: z.string()
    .min(6, { message: "Username must be at least 6 characters long" })
    .max(25, { message: "Username cannot exceed 25 characters" })
    .regex(alphaNumeric, { message: "Username must be alphanumeric characers only" }),

  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .min(2)
    .max(50),

  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password cannot exceed 128 characters" })
});

export const signInAuthFormSchema = signUpAuthForm.pick({
  email: true,
  password: true
});
