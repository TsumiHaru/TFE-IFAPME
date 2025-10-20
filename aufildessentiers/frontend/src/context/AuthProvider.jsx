import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { API_ENDPOINTS } from "../config/api";

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.error("Error decoding token:", error);
    return null;
  }
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const checkLocalStorage = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // token exists
    } else {
      // no token
    }
    return token;
  };

  useEffect(() => {
    const token = checkLocalStorage();
    if (token) {
      try {
        const decoded = decodeToken(token);
        if (!decoded) {
          localStorage.removeItem("token");
          setUser(null);
          return;
        }

        if ((decoded.exp || 0) * 1000 > Date.now()) {
          const userData = {
            id: decoded.userId || decoded.id,
            role: decoded.role,
          };
          setUser(userData);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.error("Error handling token:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const login = async (email, password) => {
    
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      // Adapter pour le nouveau format de réponse du backend Node.js
      if (response.ok && data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        const decoded = decodeToken(data.accessToken);
        
        if (!decoded) {
          console.error("Failed to decode token");
          return { success: false, message: "Invalid token received" };
        }

        const userData = {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          name: data.user?.name
        };
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, message: data.error || "Login failed" };
      }
    } catch (error) {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.error("Login error:", error);
      return { success: false, message: "An error occurred during login" };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await fetch(API_ENDPOINTS.LOGOUT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
