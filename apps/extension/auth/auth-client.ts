import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  baseURL: import.meta.env.WXT_API_URL,
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: async () => (await storage.getItem<string>("local:token")) ?? "",
    },
    onSuccess: async (ctx) => {
      const token = ctx.response.headers.get("set-auth-token");
      if (token) await storage.setItem("local:token", token);
    },
  },
});
