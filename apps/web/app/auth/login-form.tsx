"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { GoogleSignInButton } from "./google-sign-in-button";

export function LoginForm({ callbackURL }: { callbackURL: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const result = await authClient.signIn.email({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      callbackURL,
    });

    if (result.error) {
      setError("We couldn’t sign you in with those details.");
      setIsPending(false);
    }
  }

  return (
    <div className="w-full max-w-xs">
      <div className="mb-9 text-center">
        <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a46a78]">
          Welcome back
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#292536]">
          Hello Again!
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#8f8b98]">
          Let&apos;s get started with your 30 days trial.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-xs font-medium text-[#726d7d]" htmlFor="email">
          Email
          <span className="relative">
            <Mail aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#aaa5b2]" />
            <Input
              required
              autoComplete="email"
              className="h-12 rounded-xl border-transparent bg-white pl-10 text-sm text-[#292536] shadow-[0_4px_16px_rgba(83,72,103,0.04)] placeholder:text-[#b9b5bf] focus-visible:border-[#ae7180] focus-visible:ring-[#ae7180]/20"
              id="email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
          </span>
        </label>

        <label className="flex flex-col gap-2 text-xs font-medium text-[#726d7d]" htmlFor="password">
          Password
          <span className="relative">
            <LockKeyhole aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#aaa5b2]" />
            <Input
              required
              autoComplete="current-password"
              className="h-12 rounded-xl border-transparent bg-white px-10 text-sm text-[#292536] shadow-[0_4px_16px_rgba(83,72,103,0.04)] placeholder:text-[#b9b5bf] focus-visible:border-[#ae7180] focus-visible:ring-[#ae7180]/20"
              id="password"
              name="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#aaa5b2] transition-colors hover:text-[#726d7d]"
              onClick={() => setShowPassword((visible) => !visible)}
              type="button"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </span>
        </label>

        <div className="flex justify-end">
          <Link className="text-xs font-medium text-[#a46a78] hover:underline" href="#">
            Recovery password
          </Link>
        </div>

        {error ? (
          <p aria-live="polite" className="text-center text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button
          className="mt-1 h-12 rounded-xl bg-[#a46a78] text-sm font-medium text-white shadow-[0_8px_18px_rgba(164,106,120,0.22)] hover:bg-[#925d6b]"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="my-7 flex items-center gap-3 text-[0.68rem] text-[#aaa5b2]">
        <span className="h-px flex-1 bg-[#dfdce4]" />
        <span>Or continue with</span>
        <span className="h-px flex-1 bg-[#dfdce4]" />
      </div>

      <div className="flex justify-center">
        <GoogleSignInButton callbackURL={callbackURL} compact />
      </div>

      <p className="mt-8 text-center text-xs text-[#aaa5b2]">
        Don&apos;t have an account?{" "}
        <Link className="font-semibold text-[#a46a78] hover:underline" href="#">
          Create one
        </Link>
      </p>
    </div>
  );
}
