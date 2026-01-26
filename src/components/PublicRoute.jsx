import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  // Redirect to dashboard if signed in (after Clerk loads)
  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show content immediately without waiting for Clerk
  return children;
};

export default PublicRoute;
