"use client";
// app/auth/apple/callback/page.tsx
//
// Apple sends a POST (form_post mode) to your redirectUri.
// Next.js can't receive POSTs as a page route, so the common pattern is:
//   1. Create an API Route (see app/api/auth/apple/callback/route.ts) that receives the POST.
//   2. That API route redirects to this page, passing code + user as query params.
//
// This page then reads those params and forwards to your backend.

import { useEffect, useState } from "react";
import { sendCodeToBackend, type AppleUser, type BackendAuthResponse } from "@/lib/apple-auth";

type Status = "loading" | "success" | "error";

export default function AppleCallbackPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Completing sign in…");
  const [result, setResult] = useState<BackendAuthResponse | null>(null);

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      const userRaw = params.get("user"); // JSON string, present only on first login
      const error = params.get("error");

      // ── Error from Apple ───────────────────────────────────────────────────
      if (error) {
        setStatus("error");
        setMessage(
          error === "user_cancelled_authorize"
            ? "Sign in was cancelled."
            : `Apple returned an error: ${error}`
        );
        return;
      }

      // ── Validate code ──────────────────────────────────────────────────────
      if (!code) {
        setStatus("error");
        setMessage("No authorization code received from Apple.");
        return;
      }

      // ── Optional: verify state matches what we stored (CSRF) ───────────────
      const savedState = sessionStorage.getItem("apple_oauth_state");
      if (savedState && state && savedState !== state) {
        setStatus("error");
        setMessage("State mismatch — possible CSRF attack. Please try again.");
        return;
      }
      sessionStorage.removeItem("apple_oauth_state");

      // ── Parse user (only present on first sign-in) ─────────────────────────
      let user: AppleUser | null = null;
      if (userRaw) {
        try {
          user = JSON.parse(userRaw);
        } catch {
          console.warn("Failed to parse Apple user object:", userRaw);
        }
      }

      // ── Send to your backend ───────────────────────────────────────────────
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_AUTH_URL;
      if (!backendUrl) {
        setStatus("error");
        setMessage("NEXT_PUBLIC_BACKEND_AUTH_URL is not configured.");
        return;
      }

      try {
        setMessage("Verifying with server…");
        const data = await sendCodeToBackend(backendUrl, code, user, state ?? undefined);
        setResult(data);
        setStatus("success");
        setMessage("Signed in successfully!");

        // ── Redirect after success ─────────────────────────────────────────
        // Replace "/dashboard" with wherever authenticated users should land
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } catch (err: unknown) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Authentication failed.");
      }
    };

    run();
  }, []);

  return (
    <main className="page">
      <div className="card">
        {status === "loading" && <Spinner />}
        {status === "success" && <CheckIcon />}
        {status === "error" && <ErrorIcon />}

        <p className={`msg msg--${status}`}>{message}</p>

        {status === "error" && (
          <a href="/" className="retry">
            ← Try again
          </a>
        )}

        {/* Dev helper: show what the backend returned */}
        {process.env.NODE_ENV === "development" && result && (
          <pre className="debug">{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>

      <style jsx global>{`
        body {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f0e8;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
          margin: 0;
        }
      `}</style>
      <style jsx>{`
        .page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 24px;
        }
        .card {
          background: #fffdf9;
          border: 1px solid #e8e0d4;
          border-radius: 20px;
          padding: 48px 40px;
          max-width: 360px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.06);
          text-align: center;
        }
        .msg {
          font-size: 15px;
          font-weight: 400;
          line-height: 1.5;
        }
        .msg--loading { color: #6b5e4e; }
        .msg--success { color: #2d6a4f; }
        .msg--error   { color: #c0392b; }
        .retry {
          font-size: 13px;
          color: #6b5e4e;
          text-decoration: none;
          border-bottom: 1px solid #c8b99a;
          padding-bottom: 1px;
        }
        .retry:hover { color: #1a1510; }
        .debug {
          margin-top: 12px;
          background: #f0ebe3;
          border-radius: 8px;
          padding: 12px;
          font-size: 11px;
          text-align: left;
          width: 100%;
          overflow: auto;
          color: #4a3f33;
        }
      `}</style>
    </main>
  );
}

function Spinner() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <circle cx="16" cy="16" r="13" stroke="#e0d8cc" strokeWidth="3"/>
      <path d="M16 3a13 13 0 0 1 13 13" stroke="#2a2318" strokeWidth="3" strokeLinecap="round"
        style={{transformOrigin:"16px 16px",animation:"spin 0.9s linear infinite"}}/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="17" fill="#d4edda" stroke="#2d6a4f" strokeWidth="1.5"/>
      <path d="M10 18l6 6 10-12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="17" fill="#fde8e8" stroke="#c0392b" strokeWidth="1.5"/>
      <path d="M12 12l12 12M24 12L12 24" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}