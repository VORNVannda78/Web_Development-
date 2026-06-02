import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export interface PointTransaction {
  id: string;
  type: "earn" | "redeem";
  points: number;
  description: string;
  date: string;
  orderId?: string;
}

interface LoyaltyContextType {
  points: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  tierProgress: number; // 0-100%
  transactions: PointTransaction[];
  earnPoints: (amount: number, orderId: string, restaurantName: string) => void;
  redeemPoints: (points: number) => boolean; // returns true if successful
  pointsToDiscount: (points: number) => number; // $0.10 per 10 points
}

const STORAGE_KEY = "eatzone_loyalty";
const POINTS_PER_DOLLAR = 10; // earn 10 pts per $1 spent
const POINTS_TO_DOLLAR = 0.01; // 1 pt = $0.01 discount

const getTier = (points: number): LoyaltyContextType["tier"] => {
  if (points >= 5000) return "Platinum";
  if (points >= 2000) return "Gold";
  if (points >= 500) return "Silver";
  return "Bronze";
};

const getTierProgress = (points: number): number => {
  if (points >= 5000) return 100;
  if (points >= 2000) return ((points - 2000) / (5000 - 2000)) * 100;
  if (points >= 500) return ((points - 500) / (2000 - 500)) * 100;
  return (points / 500) * 100;
};

const LoyaltyContext = createContext<LoyaltyContextType | null>(null);

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState<number>(() => {
    try { return parseInt(localStorage.getItem(STORAGE_KEY + "_pts") ?? "0") || 120; } catch { return 120; }
  });
  const [transactions, setTransactions] = useState<PointTransaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + "_txn");
      return stored ? JSON.parse(stored) : [
        { id: "t1", type: "earn", points: 65, description: "Order from Malis Restaurant", date: "2026-05-28", orderId: "ORD-2026-001" },
        { id: "t2", type: "earn", points: 55, description: "Order from KFC Cambodia", date: "2026-05-25", orderId: "ORD-2026-000" },
      ];
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY + "_pts", String(points)); } catch {}
  }, [points]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY + "_txn", JSON.stringify(transactions)); } catch {}
  }, [transactions]);

  const earnPoints = useCallback((amount: number, orderId: string, restaurantName: string) => {
    const earned = Math.floor(amount * POINTS_PER_DOLLAR);
    setPoints((p) => p + earned);
    setTransactions((prev) => [{
      id: Date.now().toString(),
      type: "earn",
      points: earned,
      description: `Order from ${restaurantName}`,
      date: new Date().toISOString().split("T")[0],
      orderId,
    }, ...prev]);
  }, []);

  const redeemPoints = useCallback((pts: number) => {
    if (pts > points) return false;
    setPoints((p) => p - pts);
    setTransactions((prev) => [{
      id: Date.now().toString(),
      type: "redeem",
      points: pts,
      description: `Redeemed for discount`,
      date: new Date().toISOString().split("T")[0],
    }, ...prev]);
    return true;
  }, [points]);

  const pointsToDiscount = useCallback((pts: number) => pts * POINTS_TO_DOLLAR, []);

  return (
    <LoyaltyContext.Provider value={{
      points, tier: getTier(points), tierProgress: getTierProgress(points),
      transactions, earnPoints, redeemPoints, pointsToDiscount,
    }}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const ctx = useContext(LoyaltyContext);
  if (!ctx) throw new Error("useLoyalty must be within LoyaltyProvider");
  return ctx;
}

export const POINTS_PER_DOLLAR_RATE = POINTS_PER_DOLLAR;
