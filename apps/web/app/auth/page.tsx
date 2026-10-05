import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AuthShowcase } from "./auth-showcase";
import { IconThemeToggle } from "@/components/icon-theme-toggle";
import { GoogleSignInButton } from "./google-sign-in-button";

export const metadata: Metadata = {
  title: "Sign in · Notebase",
};

export default async function AuthPage({ searchParams }: PageProps<"/auth">) {
  const { redirectTo } = await searchParams;
  const callbackURL =
    typeof redirectTo === "string" ? redirectTo : "/dashboard";

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <div className="flex min-w-0 flex-[1_1_50%] flex-col px-6 py-5">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/notebase-logo.webp"
              alt="Notebase"
              width={124}
              height={30}
              className="h-6 w-auto dark:hidden"
              priority
            />
            <Image
              src="/notebase-logo-dark.webp"
              alt="Notebase"
              width={124}
              height={30}
              className="hidden h-6 w-auto dark:block"
              priority
            />
          </Link>
          <IconThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="flex w-full max-w-[360px] flex-col gap-7">
            <div className="flex flex-col gap-2.5">
              <h1 className="text-[30px] font-semibold tracking-[-0.03em]">
                Sign in
              </h1>
              <p className="text-[15px] leading-[1.55] text-muted-foreground">
                Sign in to your account to continue.
              </p>
            </div>
            <GoogleSignInButton callbackURL={callbackURL} />
            <p className="text-[13px] leading-[1.6] text-pretty text-muted-foreground">
              New to Notebase? Signing in creates your account. The browser
              extension uses the same sign-in.
            </p>
            <p className="border-t border-border pt-5 text-[12.5px] leading-[1.6] text-muted-foreground">
              By continuing, you agree to the{" "}
              <Link
                href="/legal#terms"
                className="text-primary hover:underline"
              >
                Terms and conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/legal#privacy"
                className="text-primary hover:underline"
              >
                Privacy policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <AuthShowcase />
    </div>
  );
}
