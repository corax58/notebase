import { useSession } from "@/auth/auth-client";
import { LoginScreen } from "@/components/login-screen";
import { AccountScreen } from "@/components/account-screen";

function AuthContent() {
  const { data, isPending, error } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center px-6 py-10 text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (error) {
    return <LoginScreen error={error.message} />;
  }

  if (!data) {
    return <LoginScreen />;
  }

  return <AccountScreen user={data.user} />;
}

export default AuthContent;
