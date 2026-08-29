import { useSession } from "@/auth/auth-client";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

function AuthContent() {
  const { data, isPending, error } = useSession();
  console.log(data, isPending, error);
  if (isPending) {
    return <>Loading...</>;
  }
  if (error) {
    return <>Error: {error.message}</>;
  }
  if (data) {
    return <>Signed in as {data.user.name}</>;
  }
  if (!data) {
    return (
      <>
        <GoogleSignInButton />
      </>
    );
  }
}

export default AuthContent;
