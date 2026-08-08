import { useCallback, useMemo, useState } from "react";
import { SessionContext } from "./SessionContext";
import { apiRequest } from "../services/apiClient";

const TOKEN_KEY = "poke-planets-token";

export function SessionProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);

  const authenticate = useCallback(async (mode, credentials) => {
    const result = await apiRequest(`/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    localStorage.setItem(TOKEN_KEY, result.token);
    setToken(result.token);
    setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      login: (c) => authenticate("login", c),
      register: (c) => authenticate("register", c),
      logout,
    }),
    [token, user, authenticate, logout],
  );
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
