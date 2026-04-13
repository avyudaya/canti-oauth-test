// app/api/auth/apple/callback/route.ts
//
// Apple uses "form_post" response_mode, meaning it POSTs the result directly
// to your redirect_uri — NOT a browser redirect with query params.
//
// This API route:
//   1. Receives the POST from Apple
//   2. Extracts code, state, and user (only on first sign-in)
//   3. Redirects the browser to the callback UI page with those values as query params
//
// Why redirect to a UI page instead of calling the backend here?
//   - So the browser (not the server) can access cookies / localStorage
//   - So you can show loading/error UI naturally
//   - If you prefer server-side only, you can call your backend here directly
//     and set an HttpOnly cookie, then redirect to /dashboard.

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let code: string | null = null;
  let state: string | null = null;
  let user: string | null = null;
  let error: string | null = null;

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    code  = params.get("code");
    state = params.get("state");
    user  = params.get("user");   // JSON string, only on first login
    error = params.get("error");
  } else if (contentType.includes("application/json")) {
    const json = await req.json();
    code  = json.code  ?? null;
    state = json.state ?? null;
    user  = json.user ? JSON.stringify(json.user) : null;
    error = json.error ?? null;
  } else {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
  }

  // Build redirect URL to the frontend callback page
  const callbackUrl = new URL("/auth/apple/callback", req.nextUrl.origin);

  if (error) {
    callbackUrl.searchParams.set("error", error);
    return NextResponse.redirect(callbackUrl, { status: 302 });
  }

  if (!code) {
    callbackUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(callbackUrl, { status: 302 });
  }

  callbackUrl.searchParams.set("code", code);
  if (state) callbackUrl.searchParams.set("state", state);
  if (user)  callbackUrl.searchParams.set("user", user);

  return NextResponse.redirect(callbackUrl, { status: 302 });
}

// Apple occasionally sends a GET (e.g. during domain association checks)
export async function GET() {
  return NextResponse.json({ ok: true });
}