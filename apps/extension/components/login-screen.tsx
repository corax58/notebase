import { GoogleSignInButton } from "@/components/google-sign-in-button";

interface LoginScreenProps {
  error?: string;
}

export function LoginScreen({ error }: LoginScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-6 py-10 text-center">
      <div className="flex flex-col items-center gap-2">
        <img src="/icon/128.png" alt="Notebase" className="size-12" />
        <h1 className="text-lg font-semibold">Sign in to Notebase</h1>
        <p className="text-sm text-muted-foreground">
          Save and organize notes from anywhere on the web.
        </p>
      </div>
      <GoogleSignInButton />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
