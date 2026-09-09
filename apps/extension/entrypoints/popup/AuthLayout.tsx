import { useSession } from "@/auth/auth-client";
import { LoginScreen } from "@/components/login-screen";
import { AccountScreen } from "@/components/account-screen";
import type { PropsWithChildren } from "react";
import Loader from "./loader";

function AuthLayout({ children }: PropsWithChildren) {
  const { data, isPending, error } = useSession();

  if (isPending) {
    return <Loader />;
  }

  if (error) {
    return <LoginScreen error={error.message} />;
  }

  if (!data) {
    return <LoginScreen />;
  }

  return (
    <>
      <AccountScreen user={data.user} />
      {children}
    </>
  );
}

export default AuthLayout;
