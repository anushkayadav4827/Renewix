import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // If guest session or standalone mode is active, allow immediately
    if (localStorage.getItem('renewix_guest_user') === 'true') {
      setIsAuthenticated(true);
      return;
    }

    getCurrentUser()
      .then(() => setIsAuthenticated(true))
      .catch(() => {
        // Standalone / Firebase Hosting resilience: automatically grant guest session
        localStorage.setItem('renewix_guest_user', 'true');
        setIsAuthenticated(true);
      });
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#103D29]" />
      </div>
    );
  }

  return <>{children}</>;
}
