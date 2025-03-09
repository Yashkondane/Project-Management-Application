
import React, { createContext, useContext, ReactNode } from 'react';

interface UserContextType {
  user: null;
  profile: null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Simple mock context without authentication
  const value = {
    user: null,
    profile: null,
    loading: false,
    signOut: async () => {
      console.log('Sign out function is disabled');
    },
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
