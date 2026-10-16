import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { Logo } from "@/components/logo";
import { webUrl } from "@/lib/web";

interface LoginScreenProps {
  error?: string;
}

// Mirrors the web app's sign-in page, sized for the popup
export function LoginScreen({ error }: LoginScreenProps) {
  return (
    <div className="flex h-full flex-col px-6 py-5">
      <Logo />

      <div className="flex flex-1 flex-col justify-center gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-[-0.03em]">
            Sign in
          </h1>
          <p className="text-sm leading-[1.55] text-muted-foreground">
            Sign in to your account to save notes from any page.
          </p>
        </div>
        <GoogleSignInButton />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <p className="text-[13px] leading-[1.6] text-pretty text-muted-foreground">
          New to Notebase? Signing in creates your account. The extension uses
          the same sign-in as the web app.
        </p>
      </div>

      <p className="border-t border-border pt-4 text-xs leading-[1.6] text-muted-foreground">
        By continuing, you agree to the{" "}
        <a
          href={webUrl("/legal#terms")}
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          Terms and conditions
        </a>{" "}
        and{" "}
        <a
          href={webUrl("/legal#privacy")}
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          Privacy policy
        </a>
        .
      </p>
    </div>
  );
}
