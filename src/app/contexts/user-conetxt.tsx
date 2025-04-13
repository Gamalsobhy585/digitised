"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

 interface UserContextType {
  token: string | null;
  name: string | null;
  email: string | null;
  setToken: (token: string | null) => void;
  setName: (name: string | null) => void;
  setEmail: (email: string | null) => void;
}


const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  );

  const [name, setName] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('name') : null
  );
  const [email, setEmail] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('email') : null
  );



  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);



  useEffect(() => {
    if (name) localStorage.setItem('name', name);
    else localStorage.removeItem('name');
  }, [name]);

  useEffect(() => {
    if (email) localStorage.setItem('email', email);
    else localStorage.removeItem('email');
  }, [email]);



  return (
<UserContext.Provider
      value={{
        token,
        name,
        email,
        setToken,
        setName,
        setEmail,
      }}
    >      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}

export default UserContext;