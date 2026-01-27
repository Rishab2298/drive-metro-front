import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard only after page is rendered and Clerk is loaded
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Always render children immediately - no blocking checks
  return children;
};

export default PublicRoute;
