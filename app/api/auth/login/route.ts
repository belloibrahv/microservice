import { NextResponse } from "next/server";

import { loginUser } from "@/lib/server/demo-services";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await loginUser(body);

  return NextResponse.json(result, {
    status: result.success ? 200 : 401,
  });
}
