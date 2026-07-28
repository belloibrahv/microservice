import { NextResponse } from "next/server";

import { getOrderById } from "@/lib/server/demo-services";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getOrderById(request.headers.get("authorization"), id);

  return NextResponse.json(result, {
    status: result.success ? 200 : 404,
  });
}
