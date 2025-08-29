import { useState, useEffect } from "react";
import { mockUser } from "@/lib/mockData";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
