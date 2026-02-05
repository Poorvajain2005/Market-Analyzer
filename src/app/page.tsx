import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/icons/logo";

export default function AuthenticationPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-10 w-10" />
          <h1 className="font-headline text-3xl font-bold tracking-tight text-center">
            Welcome to MarketMind
          </h1>
          <p className="text-muted-foreground text-center">
            Sign in to your account or create a new one to get started.
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
