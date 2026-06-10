'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  email: string;
  name: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for cookie on mount
    const checkAuth = () => {
      const match = document.cookie.match(/(^| )launchlens_user=([^;]+)/);
      if (match) {
        try {
          const decoded = decodeURIComponent(match[2]);
          setUser(JSON.parse(decoded));
        } catch {
          setUser({ email: 'dev@launchlens.io', name: 'Developer Account' });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, name: string) => {
    setIsLoading(true);
    const mockUser = { email, name: name || 'Developer Account' };
    
    // Save to cookie (valid for 7 days)
    document.cookie = `launchlens_user=${encodeURIComponent(JSON.stringify(mockUser))}; path=/; max-age=604800; SameSite=Lax`;
    
    setUser(mockUser);
    setIsLoading(false);
    router.push('/dashboard');
  };

  const logout = async () => {
    setIsLoading(true);
    // Delete cookie
    document.cookie = 'launchlens_user=; path=/; max-age=-1; SameSite=Lax';
    setUser(null);
    setIsLoading(false);
    router.push('/login');
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}

export default useAuth;
