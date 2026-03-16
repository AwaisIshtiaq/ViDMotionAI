"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { UserContext } from "@/hooks/useUserContext";

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user, isLoaded } = useUser();
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) {
      setIsLoading(false);
      return;
    }

    async function syncUser() {
      try {
        const currentUser = user;
        if (!currentUser) {
          console.warn("No user found, skipping sync");
          setIsLoading(false);
          return;
        }
        
        const email = currentUser.primaryEmailAddress?.emailAddress;
        
        if (!email) {
          console.warn("No email found for user, skipping sync");
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/users/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            fullName: currentUser.fullName,
          }),
        });

        const text = await response.text();
        
        if (!response.ok) {
          console.error("Sync failed:", text);
          setIsLoading(false);
          return;
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          console.error("Invalid JSON response:", text);
          setIsLoading(false);
          return;
        }

        setIsNewUser(data.isNewUser);
        console.log("User synced:", data.isNewUser ? "new user" : "existing user");
      } catch (error) {
        console.error("Error syncing user:", error);
      } finally {
        setIsLoading(false);
      }
    }

    syncUser();
  }, [user, isLoaded]);

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ isNewUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}
