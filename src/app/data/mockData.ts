export type FoodCategory = "Khmer Food" | "Fast Food" | "Drinks" | "Dessert" | "Noodles" | "BBQ";
export type OrderStatus = "Pending" | "Confirmed" | "Cooking" | "Rider Picking" | "Delivering" | "Completed" | "Cancelled";
export type PaymentMethod = "Cash On Delivery" | "ABA" | "KHQR";

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  category: FoodCategory;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  address: string;
  phone: string;
  isOpen: boolean;
  isApproved: boolean;
  isBlocked: boolean;
  totalOrders: number;
  totalEarnings: number;
}

export interface Food {
  id: string;
  restaurantId: string;
  name: string;
  image: string;
  price: number;
  category: FoodCategory;
  description: string;
  isAvailable: boolean;
  rating: number;
  addons?: Addon[];
}

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  food: Food;
  quantity: number;
  selectedAddons: Addon[];
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  restaurantName: string;
  riderId?: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  note?: string;
  createdAt: string;
  estimatedDelivery?: string;
}

export interface OrderItem {
  foodName: string;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "rider" | "restaurant" | "admin";
  avatar: string;
  isActive: boolean;
  joinedAt: string;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  isOnline: boolean;
  rating: number;
  totalDeliveries: number;
  todayEarnings: number;
  location: string;
}

export const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Malis Restaurant",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop",
    category: "Khmer Food",
    rating: 4.8,
    reviews: 324,
    deliveryTime: "25-35 min",
    deliveryFee: 1.5,
    minOrder: 5,
    address: "136 Norodom Blvd, Phnom Penh",
    phone: "012 345 678",
    isOpen: true,
    isApproved: true,
    isBlocked: false,
    totalOrders: 1240,
    totalEarnings: 18500,
  },
  {
    id: "r2",
    name: "KFC Cambodia",
    image: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=400&h=250&fit=crop",
    category: "Fast Food",
    rating: 4.5,
    reviews: 892,
    deliveryTime: "20-30 min",
    deliveryFee: 1.0,
    minOrder: 4,
    address: "Aeon Mall, Sen Sok, Phnom Penh",
    phone: "023 456 789",
    isOpen: true,
    isApproved: true,
    isBlocked: false,
    totalOrders: 3560,
    totalEarnings: 42000,
  },
  {
    id: "r3",
    name: "Bai Cha House",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop",
    category: "Khmer Food",
    rating: 4.6,
    reviews: 210,
    deliveryTime: "30-45 min",
    deliveryFee: 1.0,
    minOrder: 3,
    address: "Street 63, Phnom Penh",
    phone: "011 234 567",
    isOpen: true,
    isApproved: true,
    isBlocked: false,
    totalOrders: 890,
    totalEarnings: 12300,
  },
  {
    id: "r4",
    name: "Pizza Company",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop",
    category: "Fast Food",
    rating: 4.3,
    reviews: 456,
    deliveryTime: "35-50 min",
    deliveryFee: 2.0,
    minOrder: 8,
    address: "Mao Tse Toung Blvd, Phnom Penh",
    phone: "015 678 901",
    isOpen: true,
    isApproved: true,
    isBlocked: false,
    totalOrders: 1800,
    totalEarnings: 28000,
  },
  {
    id: "r5",
    name: "Num Banh Chok Café",
    image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=250&fit=crop",
    category: "Noodles",
    rating: 4.7,
    reviews: 178,
    deliveryTime: "20-30 min",
    deliveryFee: 0.5,
    minOrder: 2,
    address: "Riverside, Phnom Penh",
    phone: "016 789 012",
    isOpen: false,
    isApproved: true,
    isBlocked: false,
    totalOrders: 650,
    totalEarnings: 7800,
  },
  {
    id: "r6",
    name: "Boeng Kak BBQ",
    image: "https://images.unsplash.com/photo-1544025162-d76594f0b5d8?w=400&h=250&fit=crop",
    category: "BBQ",
    rating: 4.4,
    reviews: 267,
    deliveryTime: "40-55 min",
    deliveryFee: 2.5,
    minOrder: 10,
    address: "Street 93, Phnom Penh",
    phone: "017 890 123",
    isOpen: true,
    isApproved: true,
    isBlocked: false,
    totalOrders: 420,
    totalEarnings: 15600,
  },
];

export const foods: Food[] = [
  {
    id: "f1",
    restaurantId: "r1",
    name: "Amok Fish",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop",
    price: 6.5,
    category: "Khmer Food",
    description: "Traditional Cambodian fish curry steamed in banana leaf with coconut milk and spices.",
    isAvailable: true,
    rating: 4.9,
    addons: [
      { id: "a1", name: "Extra Rice", price: 0.5 },
      { id: "a2", name: "Extra Sauce", price: 0.5 },
    ],
  },
  {
    id: "f2",
    restaurantId: "r1",
    name: "Lok Lak",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop",
    price: 7.0,
    category: "Khmer Food",
    description: "Stir-fried beef with peppers, served with lime and pepper dipping sauce.",
    isAvailable: true,
    rating: 4.7,
    addons: [
      { id: "a3", name: "Fried Egg", price: 0.75 },
      { id: "a4", name: "Extra Beef", price: 2.0 },
    ],
  },
  {
    id: "f3",
    restaurantId: "r1",
    name: "Bai Sach Chrouk",
    image: "https://images.unsplash.com/photo-1598511726623-d2e9996892f7?w=300&h=200&fit=crop",
    price: 3.5,
    category: "Khmer Food",
    description: "Grilled pork over broken rice served with pickled vegetables and ginger broth.",
    isAvailable: true,
    rating: 4.8,
  },
  {
    id: "f4",
    restaurantId: "r2",
    name: "Crispy Chicken Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
    price: 5.5,
    category: "Fast Food",
    description: "Crispy fried chicken fillet with lettuce, mayo in a sesame bun.",
    isAvailable: true,
    rating: 4.5,
    addons: [
      { id: "a5", name: "Add Cheese", price: 0.5 },
      { id: "a6", name: "Extra Sauce", price: 0.25 },
    ],
  },
  {
    id: "f5",
    restaurantId: "r2",
    name: "Zinger Bucket (6pcs)",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=300&h=200&fit=crop",
    price: 12.0,
    category: "Fast Food",
    description: "6 pieces of crispy spicy fried chicken with 2 sides.",
    isAvailable: true,
    rating: 4.6,
  },
  {
    id: "f6",
    restaurantId: "r3",
    name: "Bai Cha (Fried Rice)",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop",
    price: 3.0,
    category: "Khmer Food",
    description: "Cambodian-style fried rice with egg, vegetables and your choice of protein.",
    isAvailable: true,
    rating: 4.6,
    addons: [
      { id: "a7", name: "Chicken", price: 1.5 },
      { id: "a8", name: "Beef", price: 2.0 },
      { id: "a9", name: "Seafood", price: 2.5 },
    ],
  },
  {
    id: "f7",
    restaurantId: "r4",
    name: "Pepperoni Pizza (L)",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop",
    price: 14.0,
    category: "Fast Food",
    description: "Large pizza with mozzarella cheese and pepperoni slices.",
    isAvailable: true,
    rating: 4.3,
    addons: [
      { id: "a10", name: "Extra Cheese", price: 1.5 },
      { id: "a11", name: "Mushrooms", price: 1.0 },
    ],
  },
  {
    id: "f8",
    restaurantId: "r5",
    name: "Num Banh Chok",
    image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=300&h=200&fit=crop",
    price: 2.5,
    category: "Noodles",
    description: "Traditional Khmer noodles with fresh fish sauce and vegetables.",
    isAvailable: true,
    rating: 4.7,
  },
  {
    id: "f9",
    restaurantId: "r6",
    name: "BBQ Beef Platter",
    image: "https://images.unsplash.com/photo-1544025162-d76594f0b5d8?w=300&h=200&fit=crop",
    price: 18.0,
    category: "BBQ",
    description: "Marinated beef slices grilled to perfection with dipping sauces.",
    isAvailable: true,
    rating: 4.5,
  },
];

export const orders: Order[] = [
  {
    id: "ORD001",
    customerId: "u1",
    restaurantId: "r1",
    restaurantName: "Malis Restaurant",
    riderId: "rider1",
    items: [
      { foodName: "Amok Fish", quantity: 1, price: 6.5 },
      { foodName: "Lok Lak", quantity: 2, price: 7.0 },
    ],
    status: "Delivering",
    totalAmount: 22.5,
    deliveryFee: 1.5,
    deliveryAddress: "House 12, Street 271, BKK1, Phnom Penh",
    paymentMethod: "Cash On Delivery",
    note: "Please don't add MSG",
    createdAt: "2026-05-13T09:30:00",
    estimatedDelivery: "2026-05-13T10:05:00",
  },
  {
    id: "ORD002",
    customerId: "u1",
    restaurantId: "r2",
    restaurantName: "KFC Cambodia",
    riderId: "rider2",
    items: [
      { foodName: "Crispy Chicken Burger", quantity: 2, price: 5.5 },
      { foodName: "Zinger Bucket (6pcs)", quantity: 1, price: 12.0 },
    ],
    status: "Completed",
    totalAmount: 24.0,
    deliveryFee: 1.0,
    deliveryAddress: "House 12, Street 271, BKK1, Phnom Penh",
    paymentMethod: "ABA",
    createdAt: "2026-05-12T14:20:00",
    estimatedDelivery: "2026-05-12T14:50:00",
  },
  {
    id: "ORD003",
    customerId: "u2",
    restaurantId: "r1",
    restaurantName: "Malis Restaurant",
    items: [
      { foodName: "Bai Sach Chrouk", quantity: 3, price: 3.5 },
    ],
    status: "Cooking",
    totalAmount: 12.0,
    deliveryFee: 1.5,
    deliveryAddress: "Russian Market Area, Phnom Penh",
    paymentMethod: "KHQR",
    createdAt: "2026-05-13T10:00:00",
  },
];

export const riders: Rider[] = [
  {
    id: "rider1",
    name: "Dara Sok",
    phone: "012 111 222",
    avatar: "DS",
    isOnline: true,
    rating: 4.8,
    totalDeliveries: 342,
    todayEarnings: 18.5,
    location: "BKK1, Phnom Penh",
  },
  {
    id: "rider2",
    name: "Virak Pich",
    phone: "012 333 444",
    avatar: "VP",
    isOnline: true,
    rating: 4.6,
    totalDeliveries: 218,
    todayEarnings: 12.0,
    location: "Toul Kork, Phnom Penh",
  },
  {
    id: "rider3",
    name: "Chanra Lim",
    phone: "012 555 666",
    avatar: "CL",
    isOnline: false,
    rating: 4.9,
    totalDeliveries: 521,
    todayEarnings: 0,
    location: "Offline",
  },
];

export const users: User[] = [
  { id: "u1", name: "Sophea Mao", email: "sophea@gmail.com", phone: "012 100 200", role: "customer", avatar: "SM", isActive: true, joinedAt: "2025-01-15" },
  { id: "u2", name: "Borey Chan", email: "borey@gmail.com", phone: "012 300 400", role: "customer", avatar: "BC", isActive: true, joinedAt: "2025-03-22" },
  { id: "u3", name: "Dara Sok", email: "dara@gmail.com", phone: "012 111 222", role: "rider", avatar: "DS", isActive: true, joinedAt: "2025-02-10" },
  { id: "u4", name: "Virak Pich", email: "virak@gmail.com", phone: "012 333 444", role: "rider", avatar: "VP", isActive: true, joinedAt: "2025-04-05" },
  { id: "u5", name: "Malis Restaurant", email: "malis@gmail.com", phone: "023 111 222", role: "restaurant", avatar: "MR", isActive: true, joinedAt: "2024-12-01" },
];

export const promotions = [
  { id: "p1", code: "NHAM20", discount: 20, type: "percent", minOrder: 10, description: "20% off orders over $10" },
  { id: "p2", code: "FREE1", discount: 1.0, type: "fixed", minOrder: 5, description: "$1 off delivery fee" },
  { id: "p3", code: "KHMER15", discount: 15, type: "percent", minOrder: 8, description: "15% off Khmer Food" },
];
