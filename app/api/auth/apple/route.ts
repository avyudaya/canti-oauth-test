import { NextRequest, NextResponse } from "next/server";

/**
 * Apple sends a POST request to this endpoint with:
 *  - code:  the authorization code
 *  - state: the state you sent
 *  - user:  JSON string with name/email (ONLY on the very first login)
 *  - error: if something went wrong
 *
 * We redirect to the frontend /callback page with everything as query params
 * so the browser can display it.
 *
 * NOTE: response_mode=form_post means this MUST be a POST handler.
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const code = formData.get("code")?.toString() || "";
  const state = formData.get("state")?.toString() || "";
  const user = formData.get("user")?.toString() || "";
  const error = formData.get("error")?.toString() || "";

  const params = new URLSearchParams();
  if (code)  params.set("code", code);
  if (state) params.set("state", state);
  if (user)  params.set("user", encodeURIComponent(user));
  if (error) params.set("error", error);

  // Redirect to the frontend callback page
  return NextResponse.redirect(
    new URL(`/callback?${params.toString()}`, req.url)
  );
}

// Also handle GET (e.g. if someone navigates here directly)
export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL("/", req.url));
}