import { createContext, useContext, useMemo, useState } from "react";
import { loginUser, logoutUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const username = sessionStorage.getItem("username");
    const role = sessionStorage.getItem("role");
    return username && role ? { username, role } : null;
  });

  async function signIn(username, password) {
    const result = await loginUser(username, password);
    const nextUser = { username: result.username, role: result.role };
    sessionStorage.setItem("username", nextUser.username);
    sessionStorage.setItem("role", nextUser.role);
    setUser(nextUser);
    return nextUser;
  }

  async function signOut() {
    try {
      await logoutUser();
    } catch {
      // The local session must still be cleared if the server session has expired.
    } finally {
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("role");
      setUser(null);
    }
  }

  const value = useMemo(() => ({ user, signIn, signOut }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
