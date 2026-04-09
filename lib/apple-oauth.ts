/**
 * Builds the Apple OAuth authorization URL.
 *
 * Apple OAuth Docs:
 * https://developer.apple.com/documentation/sign_in_with_apple/request_an_authorization_to_the_sign_in_with_apple_server
 *
 * Required Apple Developer Setup:
 * 1. Create an App ID with "Sign In with Apple" enabled
 * 2. Create a Services ID (this is your client_id, e.g. com.yourapp.service)
 * 3. Register your redirect URI in the Services ID config
 * 4. Set NEXT_PUBLIC_APPLE_CLIENT_ID and NEXT_PUBLIC_APPLE_REDIRECT_URI in .env.local
 */

export function buildAppleAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error(
      "Missing NEXT_PUBLIC_APPLE_CLIENT_ID or NEXT_PUBLIC_APPLE_REDIRECT_URI in environment variables"
    );
  }

  // Apple requires a random state for CSRF protection
  const state = generateState();

  // Store state in sessionStorage so the callback page can verify it
  if (typeof window !== "undefined") {
    sessionStorage.setItem("apple_oauth_state", state);
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",         // returns authorization code to your redirect URI
    scope: "name email",           // request name + email from Apple
    response_mode: "form_post",    // Apple sends POST to redirect_uri with code & user JSON
    state,
  });

  return `https://appleid.apple.com/auth/authorize?${params.toString()}`;
}

function generateState(): string {
  const array = new Uint8Array(16);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for SSR (shouldn't normally be called server-side)
    for (let i = 0; i < array.length; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export interface AppleCallbackData {
  code: string;
  state: string;
  user?: {
    name?: { firstName?: string; lastName?: string };
    email?: string;
  };
  error?: string;
}

/**
 * Parses the Apple callback data from the URL search params.
 * Apple sends a POST with form data to the redirect URI, which Next.js
 * receives and we forward as query params to the frontend.
 */
export function parseCallbackParams(searchParams: URLSearchParams): AppleCallbackData | null {
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const userRaw = searchParams.get("user");

  if (error) {
    return { code: "", state: state || "", error };
  }

  if (!code || !state) return null;

  let user: AppleCallbackData["user"] | undefined;
  if (userRaw) {
    try {
      user = JSON.parse(decodeURIComponent(userRaw));
    } catch {
      // user JSON is optional and only sent on first login
    }
  }

  return { code, state, user };
}