"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/icons/logo";
import { initializeFirebase } from "@/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_ROUTES = ["/"]; // Add any other public auth routes like /register
const APP_ROUTE_PREFIX = "/dashboard";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { auth } = initializeFirebase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (loading) return;

    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isAppRoute = !isAuthRoute;

    if (user && isAuthRoute) {
      router.push(APP_ROUTE_PREFIX);
    } else if (!user && isAppRoute) {
      router.push("/");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-12 w-12 animate-pulse" />
        </div>
      </div>
    );
  }

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  if ((user && isAuthRoute) || (!user && !isAuthRoute)) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-12 w-12 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
