
import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Layout/Header";

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-copilot-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <SignIn 
            routing="path" 
            path="/sign-in"
            afterSignInUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
