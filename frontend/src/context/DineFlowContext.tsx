import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

// =====================================================
// TYPES
// =====================================================

export type OrderStatus =
| "PLACED"
| "CONFIRMED"
| "PREPARING"
| "READY"
| "COMPLETED"
| "CANCELLED";

export type ReservationStatus =
  | "Confirmed"
  | "Seated"
  | "Completed"
  | "Cancelled";

export type OrderType =
  | "Dine-in"
  | "Takeaway";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  available: boolean;
  rating: number;
  prepTime: string;
  tags: string[];
  calories: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  tableNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  notes?: string;
  paymentMethod?: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  estimatedMinutes: number;
}

export interface Reservation {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: string;
  specialNotes: string;
  status: ReservationStatus;
}

export interface AdminUser {
  name: string;
  email: string;
  role: string;
}

export interface AdminAuth {
  isAuthenticated: boolean;
  user: AdminUser | null;
}

// =====================================================
// FUNCTION TYPES
// =====================================================

export interface OrderData {
  customerName?: string;
  customerPhone?: string;
  tableNumber?: string;
  orderType?: OrderType;
  notes?: string;
  paymentMethod?: string;
}

export interface ReservationData {
  guestName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: string;
  specialNotes: string;
}

export interface NewMenuItem {
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  prepTime: string;
  tags: string[];
  calories: string;
}

export interface CartTotal {
  subtotal: number;
  tax: number;
  total: number;
}

// =====================================================
// CONTEXT TYPE
// =====================================================

interface DineFlowContextType {
  // Menu
  menuItems: MenuItem[];
  addMenuItem: (newItem: NewMenuItem) => void;
  updateMenuItem: (updatedItem: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getCartTotal: () => CartTotal;

  // Orders
  orders: Order[];
  placeOrder: (orderData: OrderData) => Order;
  updateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus
  ) => void;

  currentActiveOrder: Order | undefined;

  currentActiveOrderId: string;

  setCurrentActiveOrderId: React.Dispatch<
    React.SetStateAction<string>
  >;

  // Reservations
  reservations: Reservation[];
  createReservation: (
    resData: ReservationData
  ) => Reservation;

  updateReservationStatus: (
    id: string,
    status: ReservationStatus
  ) => void;

  // Admin authentication
  adminAuth: AdminAuth;

  loginAdmin: (
    email: string,
    password: string
  ) => {
    success: boolean;
    message?: string;
  };

  logoutAdmin: () => void;
}

// =====================================================
// CONTEXT
// =====================================================

const DineFlowContext = createContext<
  DineFlowContextType | undefined
>(undefined);

// =====================================================
// INITIAL MENU ITEMS
// =====================================================

const initialMenuItems: MenuItem[] = [
  {
    id: "m1",
    name: "Truffle Mushroom Risotto",
    category: "Mains",
    price: 24.99,
    description:
      "Arborio rice cooked with wild mushrooms, black truffle paste, parmesan, and fresh herbs.",
    image:
      "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80",
    available: true,
    rating: 4.9,
    prepTime: "20 mins",
    tags: ["Vegetarian", "Chef Special"],
    calories: "520 kcal",
  },

  {
    id: "m2",
    name: "Smoked Wagyu Burger",
    category: "Mains",
    price: 28.5,
    description:
      "100% Wagyu beef patty, aged cheddar, caramelised onions, truffle aioli on a toasted brioche bun.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    available: true,
    rating: 4.8,
    prepTime: "15 mins",
    tags: ["Popular", "Chef Special"],
    calories: "850 kcal",
  },

  {
    id: "m3",
    name: "Artisanal Burrata Salad",
    category: "Starters",
    price: 16.99,
    description:
      "Fresh Italian burrata, heirloom tomatoes, basil pesto, balsamic reduction, sourdough crostini.",
    image:
      "https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=600&q=80",
    available: true,
    rating: 4.7,
    prepTime: "10 mins",
    tags: ["Vegetarian", "Gluten-Free Option"],
    calories: "380 kcal",
  },

  {
    id: "m4",
    name: "Pan-Seared Atlantic Salmon",
    category: "Mains",
    price: 31,
    description:
      "Crispy skin salmon served over asparagus puree, roasted baby potatoes, and lemon dill butter sauce.",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    available: true,
    rating: 4.9,
    prepTime: "22 mins",
    tags: ["Gluten-Free", "Seafood"],
    calories: "610 kcal",
  },

  {
    id: "m5",
    name: "Crispy Calamari Fritti",
    category: "Starters",
    price: 14.5,
    description:
      "Tender squid light batter fried, served with roasted garlic aioli and fresh lemon wedges.",
    image:
      "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80",
    available: true,
    rating: 4.6,
    prepTime: "12 mins",
    tags: ["Seafood"],
    calories: "430 kcal",
  },

  {
    id: "m6",
    name: "Matcha Lava Cake",
    category: "Desserts",
    price: 12,
    description:
      "Warm Uji matcha molten cake with white chocolate center and black sesame gelato.",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    available: true,
    rating: 4.9,
    prepTime: "15 mins",
    tags: ["Sweet", "Chef Special"],
    calories: "490 kcal",
  },

  {
    id: "m7",
    name: "Charred Octopus Tentacles",
    category: "Starters",
    price: 19.5,
    description:
      "Spanish octopus, smoked paprika potato foam, chimichurri sauce, microgreens.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    available: false,
    rating: 4.8,
    prepTime: "18 mins",
    tags: ["Seafood"],
    calories: "340 kcal",
  },

  {
    id: "m8",
    name: "Craft Smoked Bourbon Old Fashioned",
    category: "Beverages",
    price: 15,
    description:
      "Small batch bourbon, Angostura bitters, orange peel infusion, smoked under woodchips.",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80",
    available: true,
    rating: 4.9,
    prepTime: "5 mins",
    tags: ["Signature Cocktail"],
    calories: "180 kcal",
  },

  {
    id: "m9",
    name: "Sparkling Hibiscus Yuzu Fizz",
    category: "Beverages",
    price: 8.5,
    description:
      "Organic hibiscus flower brew, fresh Japanese yuzu, sparkling soda, and mint leaves.",
    image:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    available: true,
    rating: 4.7,
    prepTime: "5 mins",
    tags: ["Mocktail", "Refreshing"],
    calories: "110 kcal",
  },
];

// =====================================================
// INITIAL ORDERS
// =====================================================

const initialOrders: Order[] = [
  {
    id: "ORD-8821",
    customerName: "Sarah Jenkins",
    customerPhone: "+1 (555) 234-5678",
    tableNumber: "T-04",
    orderType: "Dine-in",
    status: "PREPARING",

    items: [
      {
        id: "m1",
        name: "Truffle Mushroom Risotto",
        price: 24.99,
        quantity: 2,
      },
      {
        id: "m9",
        name: "Sparkling Hibiscus Yuzu Fizz",
        price: 8.5,
        quantity: 2,
      },
    ],

    subtotal: 66.98,
    tax: 6.7,
    total: 73.68,

    createdAt: new Date(
      Date.now() - 15 * 60000
    ).toISOString(),

    estimatedMinutes: 20,
  },

  {
    id: "ORD-8820",
    customerName: "Michael Chen",
    customerPhone: "+1 (555) 876-5432",
    tableNumber: "Takeaway",
    orderType: "Takeaway",
    status: "READY",

    items: [
      {
        id: "m2",
        name: "Smoked Wagyu Burger",
        price: 28.5,
        quantity: 1,
      },
      {
        id: "m5",
        name: "Crispy Calamari Fritti",
        price: 14.5,
        quantity: 1,
      },
      {
        id: "m8",
        name: "Craft Smoked Bourbon Old Fashioned",
        price: 15,
        quantity: 1,
      },
    ],

    subtotal: 58,
    tax: 5.8,
    total: 63.8,

    createdAt: new Date(
      Date.now() - 35 * 60000
    ).toISOString(),

    estimatedMinutes: 0,
  },

  {
    id: "ORD-8819",
    customerName: "Emma Watson",
    customerPhone: "+1 (555) 345-6789",
    tableNumber: "T-12",
    orderType: "Dine-in",
    status: "COMPLETED",

    items: [
      {
        id: "m4",
        name: "Pan-Seared Atlantic Salmon",
        price: 31,
        quantity: 2,
      },
      {
        id: "m6",
        name: "Matcha Lava Cake",
        price: 12,
        quantity: 2,
      },
    ],

    subtotal: 86,
    tax: 8.6,
    total: 94.6,

    createdAt: new Date(
      Date.now() - 60 * 60000
    ).toISOString(),

    estimatedMinutes: 0,
  },
];

// =====================================================
// INITIAL RESERVATIONS
// =====================================================

const today = new Date()
  .toISOString()
  .split("T")[0];

const tomorrow = new Date(
  Date.now() + 86400000
)
  .toISOString()
  .split("T")[0];

const initialReservations: Reservation[] = [
  {
    id: "RES-104",
    guestName: "David Miller",
    email: "david.m@example.com",
    phone: "+1 (555) 901-2345",
    date: today,
    time: "19:30",
    guests: 4,
    seatingArea: "VIP Lounge",
    specialNotes:
      "Anniversary dinner celebration. Window seat preferred.",
    status: "Confirmed",
  },

  {
    id: "RES-105",
    guestName: "Jessica Taylor",
    email: "jtaylor@example.com",
    phone: "+1 (555) 432-1098",
    date: today,
    time: "20:00",
    guests: 2,
    seatingArea: "Patio Outdoor",
    specialNotes: "Quiet corner table.",
    status: "Seated",
  },

  {
    id: "RES-106",
    guestName: "Robert Vance",
    email: "rvance@example.com",
    phone: "+1 (555) 765-4321",
    date: tomorrow,
    time: "18:00",
    guests: 6,
    seatingArea: "Main Hall",
    specialNotes:
      "High chair needed for 1 toddler.",
    status: "Confirmed",
  },
];

// =====================================================
// PROVIDER
// =====================================================

interface DineFlowProviderProps {
  children: ReactNode;
}

export const DineFlowProvider = ({
  children,
}: DineFlowProviderProps) => {
  // ===================================================
  // STATE
  // ===================================================

  const [menuItems, setMenuItems] =
    useState<MenuItem[]>(initialMenuItems);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [isCartOpen, setIsCartOpen] =
    useState<boolean>(false);

  const [orders, setOrders] =
    useState<Order[]>(initialOrders);

  const [reservations, setReservations] =
    useState<Reservation[]>(initialReservations);

  const [currentActiveOrderId, setCurrentActiveOrderId] =
    useState<string>("ORD-8821");

  const [adminAuth, setAdminAuth] =
    useState<AdminAuth>({
      isAuthenticated: false,
      user: null,
    });

  // ===================================================
  // CURRENT ACTIVE ORDER
  // ===================================================

  const currentActiveOrder =
    orders.find(
      (order) =>
        order.id === currentActiveOrderId
    ) ?? orders[0];

  // ===================================================
  // CART OPERATIONS
  // ===================================================

  const addToCart = (
    item: MenuItem,
    quantity: number = 1
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity:
                  cartItem.quantity + quantity,
              }
            : cartItem
        );
      }

      return [
        ...prev,
        {
          ...item,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (
    id: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity =
              item.quantity + delta;

            return newQuantity > 0
              ? {
                  ...item,
                  quantity: newQuantity,
                }
              : null;
          }

          return item;
        })
        .filter(
          (item): item is CartItem =>
            item !== null
        )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = (): CartTotal => {
    const subtotal = cart.reduce(
      (acc, item) =>
        acc + item.price * item.quantity,
      0
    );

    const tax = subtotal * 0.1;

    return {
      subtotal,
      tax,
      total: subtotal + tax,
    };
  };

  // ===================================================
  // MENU OPERATIONS
  // ===================================================

  const addMenuItem = (
    newItem: NewMenuItem
  ) => {
    const created: MenuItem = {
      ...newItem,
      id: `m_${Date.now()}`,
      rating: 5.0,
      available: true,
    };

    setMenuItems((prev) => [
      created,
      ...prev,
    ]);
  };

  const updateMenuItem = (
    updatedItem: MenuItem
  ) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === updatedItem.id
          ? updatedItem
          : item
      )
    );
  };

  const deleteMenuItem = (
    id: string
  ) => {
    setMenuItems((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  const toggleItemAvailability = (
    id: string
  ) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              available: !item.available,
            }
          : item
      )
    );
  };

  // ===================================================
  // ORDER OPERATIONS
  // ===================================================

  const placeOrder = (
    orderData: OrderData
  ): Order => {
    const {
      subtotal,
      tax,
      total,
    } = getCartTotal();

    const newOrder: Order = {
      id: `ORD-${Math.floor(
        1000 + Math.random() * 9000
      )}`,

      customerName:
        orderData.customerName ??
        "Guest Customer",

      customerPhone:
        orderData.customerPhone ??
        "N/A",

      tableNumber:
        orderData.tableNumber ??
        "Takeaway",

      orderType:
        orderData.orderType ??
        "Dine-in",

      notes:
        orderData.notes ?? "",

      paymentMethod:
        orderData.paymentMethod ??
        "Credit Card",

      status: "PLACED",

      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),

      subtotal,
      tax,
      total,

      createdAt:
        new Date().toISOString(),

      estimatedMinutes: 25,
    };

    setOrders((prev) => [
      newOrder,
      ...prev,
    ]);

    setCurrentActiveOrderId(
      newOrder.id
    );

    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
            }
          : order
      )
    );
  };

  // ===================================================
  // RESERVATION OPERATIONS
  // ===================================================

  const createReservation = (
    resData: ReservationData
  ): Reservation => {
    const newReservation: Reservation = {
      id: `RES-${Math.floor(
        100 + Math.random() * 900
      )}`,

      ...resData,

      status: "Confirmed",
    };

    setReservations((prev) => [
      newReservation,
      ...prev,
    ]);

    return newReservation;
  };

  const updateReservationStatus = (
    id: string,
    status: ReservationStatus
  ) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id
          ? {
              ...reservation,
              status,
            }
          : reservation
      )
    );
  };

  // ===================================================
  // ADMIN AUTH
  // ===================================================

  const loginAdmin = (
    email: string,
    password: string
  ) => {
    if (
      email === "admin@dineflow.com" &&
      password === "admin123"
    ) {
      const user: AdminUser = {
        name: "Executive Chef / Admin",
        email: "admin@dineflow.com",
        role: "Restaurant Administrator",
      };

      setAdminAuth({
        isAuthenticated: true,
        user,
      });

      return {
        success: true,
      };
    }

    return {
      success: false,
      message: "Invalid email or password.",
    };
  };

  const logoutAdmin = () => {
    setAdminAuth({
      isAuthenticated: false,
      user: null,
    });
  };

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const contextValue: DineFlowContextType = {
    // Menu
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,

    // Cart
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,

    // Orders
    orders,
    placeOrder,
    updateOrderStatus,
    currentActiveOrder,
    currentActiveOrderId,
    setCurrentActiveOrderId,

    // Reservations
    reservations,
    createReservation,
    updateReservationStatus,

    // Admin
    adminAuth,
    loginAdmin,
    logoutAdmin,
  };

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <DineFlowContext.Provider
      value={contextValue}
    >
      {children}
    </DineFlowContext.Provider>
  );
};

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useDineFlow =
  (): DineFlowContextType => {
    const context =
      useContext(DineFlowContext);

    if (!context) {
      throw new Error(
        "useDineFlow must be used within a DineFlowProvider"
      );
    }

    return context;
  };