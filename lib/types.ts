export type UserRole = "customer" | "admin";

export type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  accent: string;
  leadTime: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type OrderStatus =
  | "pending"
  | "payment_processing"
  | "confirmed"
  | "failed";

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  eventTrail: string[];
};

export type Payment = {
  id: string;
  orderId: string;
  provider: string;
  status: "success" | "failed";
  reference: string;
  amount: number;
  createdAt: string;
};

export type NotificationLog = {
  id: string;
  orderId: string;
  type: "order_received" | "payment_update";
  status: "sent";
  message: string;
  recipient: string;
  createdAt: string;
};

export type ServiceHealth = {
  name: string;
  status: "healthy" | "degraded";
  replicas: number;
  latencyMs: number;
  summary: string;
};

export type TeamMember = {
  name: string;
  role: string;
  matricNumber?: string;
  imageUrl: string;
  specialty: string;
};

export type ResearchMetric = {
  label: string;
  value: string;
  detail: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};
