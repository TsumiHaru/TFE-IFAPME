import { createContext, useContext } from "react";

const AuthContext = createContext(null);

// Ajouter le hook useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;