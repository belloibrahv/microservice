import { NextResponse } from "next/server";

import { getNotificationsByOrder } from "@/lib/server/demo-services";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const result = await getNotificationsByOrder(
    request.headers.get("authorization"),
    orderId
  );

  return NextResponse.json(result, {
    status: result.success ? 200 : 404,
  });
}
