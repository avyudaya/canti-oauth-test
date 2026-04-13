// lib/apple-auth.ts
// Builds the Apple OAuth authorization URL and handles the redirect

export interface AppleAuthConfig {
  clientId: string;       // Your Apple Service ID (e.g. com.yourapp.service)
  redirectUri: string;    // Must exactly match what's registered in Apple Developer Console
  scope?: string;         // Default: "name email"
  responseType?: string;  // Default: "code"
  responseMode?: string;  // Must be "form_post" for scope=name email; "query" only works for code-only
  state?: string;         // Optional CSRF token
  nonce?: string;         // Optional replay-attack protection
}

/**
 * Generates a random state string for CSRF protection.
 */
export function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Builds the Apple OAuth URL and redirects the browser to Apple's login page.
 * Apple will POST back to redirectUri with: code, state, and (first login only) user JSON.
 */
export function initiateAppleSignIn(config: AppleAuthConfig): void {
  const {
    clientId,
    redirectUri,
    scope = "name email",
    responseType = "code",
    // Apple requires form_post when requesting name/email scope
    responseMode = "form_post",
    state = generateState(),
    nonce,
  } = config;

  // Persist state in sessionStorage so the callback page can verify it
  sessionStorage.setItem("apple_oauth_state", state);

  const params = new URLSearchParams({
    response_type: responseType,
    response_mode: responseMode,
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
  });

  if (nonce) params.set("nonce", nonce);

  const appleAuthUrl = `https://appleid.apple.com/auth/authorize?${params.toString()}`;
  window.location.href = appleAuthUrl;
}

/**
 * Sends the Apple authorization code (and optional user payload) to your backend.
 *
 * @param backendUrl  - Your backend endpoint, e.g. https://api.yourapp.com/auth/apple
 * @param code        - The authorization code returned by Apple
 * @param user        - The user object Apple returns ONLY on the very first sign-in
 *                      { name: { firstName, lastName }, email }
 * @param state       - The state param for CSRF verification (optional, do on backend too)
 */
export async function sendCodeToBackend(
  backendUrl: string,
  code: string,
  user?: AppleUser | null,
  state?: string
): Promise<BackendAuthResponse> {
  const body: Record<string, unknown> = { code };
  if (user) body.user = user;
  if (state) body.state = state;

  const response = await fetch(backendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // send cookies if your backend uses session cookies
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Backend auth failed (${response.status}): ${error}`);
  }

  return response.json();
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AppleUser {
  name?: {
    firstName?: string;
    lastName?: string;
  };
  email?: string;
}

export interface BackendAuthResponse {
  // Adjust these fields to match what your backend actually returns
  token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
  [key: string]: unknown;
}