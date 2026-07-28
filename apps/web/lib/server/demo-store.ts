import { productsSeed } from "@/lib/demo-data";
import type { NotificationLog, Order, Payment, Product, User } from "@/lib/types";

type DemoStore = {
  users: User[];
  products: Product[];
  orders: Order[];
  payments: Payment[];
  notifications: NotificationLog[];
};

declare global {
  var __MICROSERVICES_DEMO_STORE__: DemoStore | undefined;
}

const adminUser: User = {
  id: "user-admin",
  fullName: "Demo Operations Admin",
  email: "admin@retail-demo.cloud",
  password: "Admin@12345",
  role: "admin",
  createdAt: new Date().toISOString(),
};

const baseStore = (): DemoStore => ({
  users: [adminUser],
  products: productsSeed.map((product) => ({ ...product })),
  orders: [],
  payments: [],
  notifications: [],
});

export const getStore = () => {
  if (!globalThis.__MICROSERVICES_DEMO_STORE__) {
    globalThis.__MICROSERVICES_DEMO_STORE__ = baseStore();
  }

  return globalThis.__MICROSERVICES_DEMO_STORE__;
};

export const createId = (prefix: string) =>
  `${prefix}-${crypto.randomUUID().split("-")[0]}`;
