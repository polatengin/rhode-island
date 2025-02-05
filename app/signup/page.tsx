import { Metadata } from "next";
import { SignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4 py-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Create an account</h1>
          <p className="text-gray-500">
            Sign up to get started with your new account
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
