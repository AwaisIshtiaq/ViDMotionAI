"use client";

import { createContext, useContext } from "react";

interface UserContextType {
  isNewUser: boolean | null;
  isLoading: boolean;
}

export const UserContext = createContext<UserContextType>({
  isNewUser: null,
  isLoading: true,
});

export function useUserContext() {
  return useContext(UserContext);
}
