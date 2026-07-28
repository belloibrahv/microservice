import { NextResponse } from "next/server";

import { getProductById } from "@/lib/server/demo-services";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getProductById(id);

  return NextResponse.json(result, {
    status: result.success ? 200 : 404,
  });
}
