import { useState } from "react";
import { storage } from "../utils/storage";

export function useAuth() {
  const [user, setUser] = useState(()=>storage.get("sg_user"));

  function login(e, p) {
    if (e && p.length >= 6) {
      const u = { email:e, name:e.split("@")[0], av:e[0].toUpperCase() };
      setUser(u);
      storage.set("sg_user", u);
      return true;
    }
    return false;
  }

  function signup(n, e, p) {
    if (n && e && p.length >= 6) {
      const u = { email:e, name:n, av:n[0].toUpperCase() };
      setUser(u);
      storage.set("sg_user", u);
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
    try { localStorage.removeItem("sg_user"); } catch {}
  }

  return { user, login, signup, logout };
}