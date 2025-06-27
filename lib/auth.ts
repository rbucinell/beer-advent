import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { username } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { convertOldUserToNewAccount } from "./claimOld";

const client = new MongoClient(process.env.MONGODB_URI as string); //"mongodb://0.0.0.0:27017/database");
const db = client.db("beer-advent");

export const auth = betterAuth({
  appName: "beer-advent",
  trustedOrigins: ["http://localhost:3000", "https://localhost:3000", "beer-advent.vercel.app"],
  database: mongodbAdapter(db),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "email-password"],
    }
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [username()],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-in/social") {
        console.log("After Hook");
        console.log("Path", ctx.path);
        const newSession = ctx.context.newSession;
        console.log("user", JSON.stringify(newSession?.user));
      }
    })
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          return {
            data: {
              ...user,
              username: user.email.split("@")[0],
              displayUsername: user.email.split("@")[0]
            }
          }
        },
        after: async (user) => {
          console.log("databaseHooks:user:create:after");
          await convertOldUserToNewAccount(user);
        }
      }
    }
  }
});
