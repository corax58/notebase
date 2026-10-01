import { LoginForm } from "./login-form";

export default async function AuthPage({ searchParams }: PageProps<"/auth">) {
  const { redirectTo } = await searchParams;
  const callbackURL =
    typeof redirectTo === "string" ? redirectTo : "/dashboard";

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#c28b79] px-4 py-10 sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.24),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_50%)]" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[1.6rem] border border-white/70 bg-[#f4f4fa] shadow-[0_22px_60px_rgba(74,44,46,0.24)] lg:grid-cols-[1fr_1.04fr]">
        <div className="flex min-h-[560px] items-center justify-center px-7 py-12 sm:px-16 lg:px-20">
          <LoginForm callbackURL={callbackURL} />
        </div>
        <div
          aria-label="Dreamy sunset landscape illustration"
          className="relative hidden min-h-[560px] overflow-hidden bg-[#6e5f83] bg-cover bg-center lg:block"
          style={{
            backgroundImage:
              "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yECpLu3YX4mu60DEF0FPfZZ0mRtIXI.png)",
            backgroundPosition: "right center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#4b476d]/40 via-transparent to-white/10" />
          <p className="absolute bottom-7 left-8 max-w-[15rem] text-sm font-medium tracking-wide text-white/80">
            A calmer place for all your thoughts.
          </p>
        </div>
      </div>
    </main>
  );
}
