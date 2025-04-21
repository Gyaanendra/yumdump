import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';

type AuthContextType = {
  isSignedIn: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  userData: {
    name: string;
    email: string;
    phone: string;
  };
  updateUserData: (data: Partial<{ name: string; email: string; phone: string }>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, signOut, isLoaded } = useClerkAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: 'Garvita',
    email: 'garvita@mail.com',
    phone: '08123456789',
  });

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        // Update user data from Clerk if available
        setUserData({
          name: user.fullName || userData.name,
          email: user.primaryEmailAddress?.emailAddress || userData.email,
          phone: user.phoneNumbers[0]?.phoneNumber || userData.phone,
        });
      }
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, user]);

  const updateUserData = (data: Partial<{ name: string; email: string; phone: string }>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, isLoading, signOut, userData, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};