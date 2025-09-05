import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { trpc } from '../config/trpc';

interface VibeAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  signOut: () => void;
}

const VibeAuthContext = createContext<VibeAuthContextType | undefined>(undefined);

export const useVibeAuth = () => {
  const context = useContext(VibeAuthContext);
  if (!context) {
    throw new Error('useVibeAuth must be used within a VibeAuthProvider');
  }
  return context;
};

interface VibeAuthProviderProps {
  children: React.ReactNode;
}

export const VibeAuthProvider: React.FC<VibeAuthProviderProps> = ({ children }) => {
  const { isSignedIn, isLoaded, signOut: authSignOut } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
    }
  }, [isLoaded]);

  const signOut = async () => {
    try {
      await authSignOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value: VibeAuthContextType = {
    isAuthenticated: isSignedIn || false,
    isLoading,
    user,
    signOut,
  };

  return (
    <VibeAuthContext.Provider value={value}>
      {children}
    </VibeAuthContext.Provider>
  );
};
