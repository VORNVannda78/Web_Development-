import { createContext, useContext, useState, ReactNode } from "react";

export type DeliveryMode = "delivery" | "pickup";

interface AuthUser {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => void;
  showAuthModal: boolean;
  openAuthModal: (redirectAfter?: () => void) => void;
  closeAuthModal: () => void;
  pendingAction: (() => void) | null;
  deliveryMode: DeliveryMode;
  setDeliveryMode: (mode: DeliveryMode) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("delivery");

  const login = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const name = email.split("@")[0];
    setUser({ name: name.charAt(0).toUpperCase() + name.slice(1), email });
  };

  const signup = async (name: string, email: string, _password: string, phone?: string) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser({ name, email, phone });
  };

  const loginWithGoogle = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    setUser({ name: "Google User", email: "user@gmail.com", avatar: "G" });
  };

  const loginWithFacebook = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    setUser({ name: "Facebook User", email: "user@facebook.com", avatar: "f" });
  };

  const logout = () => setUser(null);

  const openAuthModal = (redirectAfter?: () => void) => {
    setPendingAction(redirectAfter ? () => redirectAfter : null);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setPendingAction(null);
  };

  return (
    <AuthContext.Provider value={{
      user, login, signup, loginWithGoogle, loginWithFacebook, logout,
      showAuthModal, openAuthModal, closeAuthModal, pendingAction,
      deliveryMode, setDeliveryMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
