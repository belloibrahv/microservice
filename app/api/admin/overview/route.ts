import { NextResponse } from "next/server";

import { getAdminOverview } from "@/lib/server/demo-services";

export async function GET(request: Request) {
  const result = await getAdminOverview(request.headers.get("authorization"));

  return NextResponse.json(result, {
    status: result.success ? 200 : 403,
  });
}
