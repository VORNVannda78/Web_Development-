import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ToastProvider } from "./context/ToastContext";
import { LoyaltyProvider } from "./context/LoyaltyContext";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <LoyaltyProvider>
            <ToastProvider>
              <RouterProvider router={router} />
            </ToastProvider>
          </LoyaltyProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
