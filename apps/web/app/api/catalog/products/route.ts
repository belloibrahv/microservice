import { NextResponse } from "next/server";

import { listProducts } from "@/lib/server/demo-services";

export async function GET() {
  const result = await listProducts();
  return NextResponse.json(result);
}
