
import { SignUp } from "@clerk/clerk-react";
import Header from "@/components/Layout/Header";

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-copilot-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <SignUp
            routing="path"
            path="/sign-up"
            afterSignUpUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
