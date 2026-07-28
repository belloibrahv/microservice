import { describe, expect, it } from "vitest";

import { createOrder, listProducts, loginUser, registerUser } from "@/lib/server/demo-services";

describe("demo services", () => {
  it("lists seeded products", async () => {
    const result = await listProducts();

    expect(result.success).toBe(true);
    expect(result.data?.length).toBeGreaterThan(0);
  });

  it("registers and logs in a user", async () => {
    const registration = await registerUser({
      fullName: "Test User",
      email: `user-${Date.now()}@mail.com`,
      password: "password123",
    });

    expect(registration.success).toBe(true);
    if (!registration.success || !registration.data) {
      throw new Error("Registration failed unexpectedly.");
    }

    expect(registration.data.token).toBeTruthy();

    const login = await loginUser({
      email: registration.data.user.email,
      password: "password123",
    });

    expect(login.success).toBe(true);
    if (!login.success || !login.data) {
      throw new Error("Login failed unexpectedly.");
    }

    expect(login.data.user.role).toBe("customer");
  });

  it("creates an order for an authenticated user", async () => {
    const email = `order-${Date.now()}@mail.com`;
    const registration = await registerUser({
      fullName: "Order User",
      email,
      password: "password123",
    });

    if (!registration.success || !registration.data) {
      throw new Error("Registration failed unexpectedly.");
    }

    const token = registration.data.token;
    expect(token).toBeTruthy();

    const products = await listProducts();
    if (!products.success || !products.data?.length) {
      throw new Error("Product seed data is missing.");
    }

    const firstProduct = products.data[0];
    expect(firstProduct).toBeTruthy();

    const order = await createOrder(`Bearer ${token}`, {
      items: [{ productId: firstProduct.id, quantity: 1 }],
    });

    expect(order.success).toBe(true);
    if (!order.success || !order.data) {
      throw new Error("Order creation failed unexpectedly.");
    }

    expect(order.data.items).toHaveLength(1);
    expect(["confirmed", "failed"]).toContain(order.data.status);
  });
});
