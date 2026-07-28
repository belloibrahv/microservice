import { NextResponse } from "next/server";

import { createOrder, listOrders } from "@/lib/server/demo-services";

export async function GET(request: Request) {
  const result = await listOrders(request.headers.get("authorization"));

  return NextResponse.json(result, {
    status: result.success ? 200 : 401,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createOrder(request.headers.get("authorization"), body);

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
