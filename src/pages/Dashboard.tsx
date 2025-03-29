
import { useUser, useAuth } from "@clerk/clerk-react";
import Header from "@/components/Layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      toast.error("You need to be signed in to view this page");
      navigate("/sign-in");
    }
  }, [isLoaded, isSignedIn, navigate]);
  
  // Get user role from metadata
  const userRole = user?.publicMetadata?.role as string || "user";
  const isTherapist = userRole === "therapist";

  if (!isLoaded || !isSignedIn) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-copilot-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {user?.fullName || "Not provided"}</p>
                  <p><span className="font-medium">Email:</span> {user?.primaryEmailAddress?.emailAddress}</p>
                  <p><span className="font-medium">Role:</span> {isTherapist ? "Therapist" : "User"}</p>
                </div>
              </CardContent>
            </Card>
            
            {isTherapist ? (
              <Card>
                <CardHeader>
                  <CardTitle>Therapist Portal</CardTitle>
                  <CardDescription>Access your therapist tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>You have access to therapist features.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Therapy Sessions</CardTitle>
                  <CardDescription>Your recent therapy sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Your recent sessions will appear here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
