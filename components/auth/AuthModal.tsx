"use client";

import { useEffect, useState } from "react";
import { SignIn, SignUp, useUser } from "@clerk/nextjs";
import { syncUserToDatabase } from "@/lib/auth";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {mode === "signin" ? (
          <SignIn 
            routing="path"
            path="/sign-in"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0",
              },
            }}
          />
        ) : (
          <SignUp 
            routing="path"
            path="/sign-up"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0",
              },
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export function UserSyncHandler() {
  const { user, isLoaded } = useUser();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (isLoaded && user && !synced) {
      syncUserToDatabase(
        user.id,
        user.primaryEmailAddress?.emailAddress || "",
        user.fullName
      ).then(() => {
        setSynced(true);
      });
    }
  }, [user, isLoaded, synced]);

  return null;
}