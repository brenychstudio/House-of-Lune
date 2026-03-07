import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, message: "Missing required fields." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "Inquiry received." }, { status: 200 });
}
