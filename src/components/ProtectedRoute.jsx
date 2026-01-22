import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const location = useLocation();

  // Wait for both auth and user to load
  if (!authLoaded || !userLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Not signed in - redirect to sign in
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Get user metadata
  const publicMetadata = user?.publicMetadata || {};
  const role = publicMetadata.role;
  const companyId = publicMetadata.company_id;

  // Check if user is a dsp_admin
  if (role === "dsp_admin") {
    // If no company_id, redirect to onboarding (unless already there)
    if (!companyId && location.pathname !== "/onboarding") {
      return <Navigate to="/onboarding" replace />;
    }

    // If has company_id and trying to access onboarding, redirect to dashboard
    if (companyId && location.pathname === "/onboarding") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // For non-dsp_admin users or users without role, check onboarding
  // New users (no role set) should go to onboarding
  if (!role && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;
