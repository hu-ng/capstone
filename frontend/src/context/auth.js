// Custom react context hook to persist auth tokens on the client side

import { createContext, useContext } from "react";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}
