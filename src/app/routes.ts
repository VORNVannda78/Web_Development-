import { createBrowserRouter, redirect } from "react-router";

import { FoodPandaLayout } from "./components/foodpanda/FoodPandaLayout";
import { FoodPandaHome } from "./components/foodpanda/FoodPandaHome";
import { FoodPandaRestaurant } from "./components/foodpanda/FoodPandaRestaurant";
import { FoodPandaCart } from "./components/foodpanda/FoodPandaCart";
import { FoodPandaCheckout } from "./components/foodpanda/FoodPandaCheckout";
import { FoodPandaTracking } from "./components/foodpanda/FoodPandaTracking";
import { PromotionsPage } from "./components/foodpanda/PromotionsPage";
import { FavoritesPage } from "./components/foodpanda/FavoritesPage";
import { InvoicePage } from "./components/foodpanda/InvoicePage";
import { ReviewPage } from "./components/foodpanda/ReviewPage";
import { OrderHistoryPage } from "./components/foodpanda/OrderHistoryPage";

import { RestaurantLayout } from "./components/restaurant/RestaurantLayout";
import { RestaurantDashboard } from "./components/restaurant/RestaurantDashboard";
import { FoodsPage } from "./components/restaurant/FoodsPage";
import { OrdersPage } from "./components/restaurant/OrdersPage";
import { EarningsPage } from "./components/restaurant/EarningsPage";

import { RiderLayout } from "./components/rider/RiderLayout";
import { RiderDashboard } from "./components/rider/RiderDashboard";
import { DeliveriesPage } from "./components/rider/DeliveriesPage";
import { RiderEarningsPage } from "./components/rider/RiderEarningsPage";

import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { RestaurantManagement } from "./components/admin/RestaurantManagement";
import { UserManagement } from "./components/admin/UserManagement";
import { ReportsPage } from "./components/admin/ReportsPage";
import { MerchantPortal } from "./components/merchant/MerchantPortal";

export const router = createBrowserRouter([
  { path: "/", loader: () => redirect("/food") },

  {
    path: "/food",
    Component: FoodPandaLayout,
    children: [
      { index: true, Component: FoodPandaHome },
      { path: "restaurants/:id", Component: FoodPandaRestaurant },
      { path: "cart", Component: FoodPandaCart },
      { path: "checkout", Component: FoodPandaCheckout },
      { path: "tracking", Component: FoodPandaTracking },
      { path: "promotions", Component: PromotionsPage },
      { path: "favorites", Component: FavoritesPage },
      { path: "invoice/:orderId", Component: InvoicePage },
      { path: "review/:orderId", Component: ReviewPage },
      { path: "orders", Component: OrderHistoryPage },
    ],
  },

  {
    path: "/restaurant",
    Component: RestaurantLayout,
    children: [
      { index: true, Component: RestaurantDashboard },
      { path: "foods", Component: FoodsPage },
      { path: "orders", Component: OrdersPage },
      { path: "earnings", Component: EarningsPage },
    ],
  },

  {
    path: "/rider",
    Component: RiderLayout,
    children: [
      { index: true, Component: RiderDashboard },
      { path: "deliveries", Component: DeliveriesPage },
      { path: "earnings", Component: RiderEarningsPage },
    ],
  },

  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "restaurants", Component: RestaurantManagement },
      { path: "users", Component: UserManagement },
      { path: "reports", Component: ReportsPage },
    ],
  },

  { path: "/merchant", Component: MerchantPortal },
]);
