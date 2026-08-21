import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleSignInButton } from "./google-sign-in-button";

export default async function AuthPage({ searchParams }: PageProps<"/auth">) {
  const { redirectTo } = await searchParams;
  const callbackURL =
    typeof redirectTo === "string" ? redirectTo : "/dashboard";

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-32 dark:bg-black">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Sign in to your account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleSignInButton callbackURL={callbackURL} />
        </CardContent>
      </Card>
    </div>
  );
}
