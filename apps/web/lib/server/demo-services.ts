import { serviceHealthSeed } from "@/lib/demo-data";
import type { ApiResponse } from "@/lib/types";
import { createId, getStore } from "@/lib/server/demo-store";
import type {
  CartItem,
  NotificationLog,
  Order,
  OrderItem,
  Product,
  ServiceHealth,
  User,
} from "@/lib/types";

const tokenPrefix = "demo-token";

const ok = <T>(message: string, data?: T): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

const fail = (message: string): ApiResponse<never> => ({
  success: false,
  message,
});

const sanitizeUser = (user: User) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

const createToken = (user: User) =>
  `${tokenPrefix}.${Buffer.from(
    JSON.stringify({ userId: user.id, role: user.role, email: user.email })
  ).toString("base64url")}`;

const readToken = (header?: string | null) => {
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const rawToken = header.replace("Bearer ", "");
  if (!rawToken.startsWith(`${tokenPrefix}.`)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(rawToken.split(".")[1], "base64url").toString());
  } catch {
    return null;
  }
};

const getUserFromHeader = (header?: string | null) => {
  const payload = readToken(header);
  if (!payload?.userId) {
    return null;
  }

  return getStore().users.find((user) => user.id === payload.userId) ?? null;
};

const pushNotification = (orderId: string, recipient: string, message: string, type: NotificationLog["type"]) => {
  getStore().notifications.push({
    id: createId("notif"),
    orderId,
    type,
    status: "sent",
    recipient,
    message,
    createdAt: new Date().toISOString(),
  });
};

const buildOrderItems = (
  products: Product[],
  items: CartItem[]
): ApiResponse<OrderItem[]> => {
  const orderItems: OrderItem[] = [];

  for (const item of items) {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) {
      return fail(`Product ${item.productId} could not be found.`);
    }

    if (item.quantity < 1 || item.quantity > product.stock) {
      return fail(`Requested quantity for ${product.name} is not available.`);
    }

    orderItems.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
    });
  }

  return ok("Order items are valid.", orderItems);
};

export const registerUser = async (
  payload: { fullName: string; email: string; password: string }
): Promise<ApiResponse<{ token: string; user: ReturnType<typeof sanitizeUser> }>> => {
  const store = getStore();
  const email = payload.email.trim().toLowerCase();

  if (!payload.fullName.trim() || !email || payload.password.length < 6) {
    return fail("Please provide a full name, a valid email, and a password with at least 6 characters.");
  }

  if (store.users.some((user) => user.email === email)) {
    return fail("An account with that email already exists.");
  }

  const user: User = {
    id: createId("user"),
    fullName: payload.fullName.trim(),
    email,
    password: payload.password,
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);

  return ok("Registration successful.", {
    token: createToken(user),
    user: sanitizeUser(user),
  });
};

export const loginUser = async (
  payload: { email: string; password: string }
): Promise<ApiResponse<{ token: string; user: ReturnType<typeof sanitizeUser> }>> => {
  const email = payload.email.trim().toLowerCase();
  const user = getStore().users.find(
    (entry) => entry.email === email && entry.password === payload.password
  );

  if (!user) {
    return fail("Invalid email or password.");
  }

  return ok("Login successful.", {
    token: createToken(user),
    user: sanitizeUser(user),
  });
};

export const getCurrentUser = async (
  header?: string | null
): Promise<ApiResponse<ReturnType<typeof sanitizeUser>>> => {
  const user = getUserFromHeader(header);
  if (!user) {
    return fail("Authentication required.");
  }

  return ok("Current user resolved.", sanitizeUser(user));
};

export const listProducts = async (): Promise<ApiResponse<Product[]>> =>
  ok("Catalog ready.", getStore().products);

export const getProductById = async (id: string): Promise<ApiResponse<Product>> => {
  const product = getStore().products.find((entry) => entry.id === id);
  if (!product) {
    return fail("Product not found.");
  }

  return ok("Product loaded.", product);
};

export const createOrder = async (
  header: string | null,
  payload: { items: CartItem[] }
): Promise<ApiResponse<Order>> => {
  const store = getStore();
  const user = getUserFromHeader(header);
  if (!user) {
    return fail("Please sign in before placing an order.");
  }

  if (!payload.items.length) {
    return fail("Your cart is empty.");
  }

  const validatedItems = buildOrderItems(store.products, payload.items);
  if (!validatedItems.success || !validatedItems.data) {
    return fail(validatedItems.message);
  }

  const totalAmount = validatedItems.data.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const order: Order = {
    id: createId("order"),
    userId: user.id,
    status: "pending",
    totalAmount,
    items: validatedItems.data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    eventTrail: [
      "Gateway validated token and routed request to Order Service.",
      "Order Service persisted a pending order and published OrderPlaced.",
      "Notification Service sent order received confirmation.",
      "Payment Service started asynchronous payment evaluation.",
    ],
  };

  store.orders.unshift(order);
  pushNotification(order.id, user.email, "Your order has been received and is pending payment confirmation.", "order_received");

  const paymentSucceeded = totalAmount <= 250000;
  const paymentStatus = paymentSucceeded ? "success" : "failed";
  store.payments.unshift({
    id: createId("payment"),
    orderId: order.id,
    provider: "DemoPay",
    status: paymentStatus,
    reference: createId("payref"),
    amount: totalAmount,
    createdAt: new Date().toISOString(),
  });

  order.status = paymentSucceeded ? "confirmed" : "failed";
  order.updatedAt = new Date().toISOString();
  order.eventTrail.push(
    paymentSucceeded
      ? "Payment Service emitted PaymentSucceeded and Order Service confirmed the order."
      : "Payment Service emitted PaymentFailed and Order Service marked the order as failed."
  );

  pushNotification(
    order.id,
    user.email,
    paymentSucceeded
      ? "Payment successful. Your order is now confirmed."
      : "Payment could not be completed. Please review your order and try again.",
    "payment_update"
  );

  if (paymentSucceeded) {
    for (const item of order.items) {
      const product = store.products.find((entry) => entry.id === item.productId);
      if (product) {
        product.stock -= item.quantity;
      }
    }
  }

  return ok("Order created successfully.", order);
};

export const listOrders = async (header: string | null): Promise<ApiResponse<Order[]>> => {
  const user = getUserFromHeader(header);
  if (!user) {
    return fail("Authentication required.");
  }

  return ok(
    "Orders loaded.",
    getStore().orders.filter((order) => order.userId === user.id)
  );
};

export const getOrderById = async (
  header: string | null,
  id: string
): Promise<ApiResponse<Order>> => {
  const user = getUserFromHeader(header);
  if (!user) {
    return fail("Authentication required.");
  }

  const order = getStore().orders.find((entry) => entry.id === id && entry.userId === user.id);
  if (!order) {
    return fail("Order not found.");
  }

  return ok("Order loaded.", order);
};

export const getNotificationsByOrder = async (
  header: string | null,
  orderId: string
): Promise<ApiResponse<NotificationLog[]>> => {
  const user = getUserFromHeader(header);
  if (!user) {
    return fail("Authentication required.");
  }

  const order = getStore().orders.find((entry) => entry.id === orderId && entry.userId === user.id);
  if (!order) {
    return fail("Order not found.");
  }

  return ok(
    "Notification history loaded.",
    getStore().notifications.filter((entry) => entry.orderId === orderId)
  );
};

export const getAdminOverview = async (
  header: string | null
): Promise<
  ApiResponse<{
    serviceHealth: ServiceHealth[];
    totals: {
      users: number;
      products: number;
      orders: number;
      notifications: number;
    };
    recentOrders: Order[];
  }>
> => {
  const user = getUserFromHeader(header);
  if (!user || user.role !== "admin") {
    return fail("Admin access is required.");
  }

  return ok("Admin overview ready.", {
    serviceHealth: serviceHealthSeed as ServiceHealth[],
    totals: {
      users: getStore().users.length,
      products: getStore().products.length,
      orders: getStore().orders.length,
      notifications: getStore().notifications.length,
    },
    recentOrders: getStore().orders.slice(0, 5),
  });
};
