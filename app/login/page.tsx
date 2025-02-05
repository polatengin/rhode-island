import { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4 py-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Welcome back</h1>
          <p className="text-gray-500">
            Please sign in to your account to continue
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
