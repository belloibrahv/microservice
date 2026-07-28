import { NextResponse } from "next/server";

import { registerUser } from "@/lib/server/demo-services";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await registerUser(body);

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
