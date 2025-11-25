// app/api/waitlist/route.ts
import { NextResponse } from "next/server";

type Body = {
  email?: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const email = body.email?.trim();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  // For now: log to server; later, insert into DB or send to an email service.
  console.log("[FlowCanary waitlist] New signup:", email);

  return NextResponse.json({ ok: true });
}
