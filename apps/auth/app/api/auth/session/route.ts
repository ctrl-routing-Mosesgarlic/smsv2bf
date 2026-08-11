import { NextResponse } from "next/server";
import { getAccessToken, getSessionUserId } from "@/lib/api/cookies";

export async function GET(): Promise<NextResponse> {
  const accessToken = await getAccessToken();
  const userId = await getSessionUserId();

  return NextResponse.json(
    {
      ok: true,
      authenticated: !!accessToken,
      user_id: userId,
    },
    { status: 200 }
  );
}
