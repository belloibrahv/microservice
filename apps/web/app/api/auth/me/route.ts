import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/server/demo-services";

export async function GET(request: Request) {
  const result = await getCurrentUser(request.headers.get("authorization"));

  return NextResponse.json(result, {
    status: result.success ? 200 : 401,
  });
}
