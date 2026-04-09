"use client";

import { buildAppleAuthUrl } from "@/lib/apple-oauth";

export default function HomePage() {
  function handleSignIn() {
    try {
      const url = buildAppleAuthUrl();
      window.location.href = url;
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Configuration error");
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* Glow */}
      <div style={{
        position: "fixed",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,167,106,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "3rem",
        maxWidth: "400px",
        width: "100%",
      }}>
        {/* Logo mark */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)",
            border: "1px solid #333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
          }}>
            
          </div>
          <div style={{ textAlign: "center" }}>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "2rem",
              fontWeight: 400,
              color: "var(--text)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}>
              Sign in
            </h1>
            <p style={{
              marginTop: "0.4rem",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              Apple OAuth · code + name + email
            </p>
          </div>
        </div>

        {/* Card */}
        <div style={{
          width: "100%",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}>
          <p style={{
            fontSize: "0.8rem",
            color: "var(--text-dim)",
            lineHeight: 1.7,
          }}>
            Clicking below will redirect you to Apple&apos;s sign-in page.
            After authenticating, the authorization <span style={{ color: "var(--accent)" }}>code</span>,{" "}
            <span style={{ color: "var(--accent)" }}>name</span>, and{" "}
            <span style={{ color: "var(--accent)" }}>email</span> will be displayed here.
          </p>

          {/* Apple button */}
          <button
            onClick={handleSignIn}
            style={{
              width: "100%",
              padding: "0.875rem 1.5rem",
              background: "var(--apple)",
              color: "#000",
              border: "none",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontFamily: "'DM Mono', monospace",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              transition: "background 0.15s, transform 0.1s",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.background = "var(--apple-hover)";
              (e.target as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.background = "var(--apple)";
              (e.target as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            <AppleLogo />
            Continue with Apple
          </button>
        </div>

        {/* Config hint */}
        <p style={{
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          textAlign: "center",
          lineHeight: 1.7,
        }}>
          Set <code style={{ color: "var(--accent)", fontSize: "0.65rem" }}>NEXT_PUBLIC_APPLE_CLIENT_ID</code> and{" "}
          <code style={{ color: "var(--accent)", fontSize: "0.65rem" }}>NEXT_PUBLIC_APPLE_REDIRECT_URI</code>
          {" "}in <code style={{ color: "var(--accent)", fontSize: "0.65rem" }}>.env.local</code>
        </p>
      </div>
    </main>
  );
}

function AppleLogo() {
  return (
    <svg width="17" height="17" viewBox="0 0 814 1000" fill="currentColor">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 442.9 41.2 128.2 172.3 86.4c36.3-12.7 79.3-17.9 120.7-17.9 151.2 0 187.4 79.8 239.3 79.8C536.6 148.3 588.7 80 735 80c11.7 0 51.5 2.6 86.9 23.5zm-146.5-89.1c.6.6 1.9 1.3 2.6 1.9V230c0 1.9 0 3.8-.6 5.8-46.8 15.5-101.7 15.5-101.7 15.5-20 0-40.2-2.6-60.3-7.1.6-3.2 1.3-6.4 2.6-10.2 17.9-54.9 65.2-100.5 119.9-123.3 6.4-2.6 24.9-9 37.5-9z"/>
    </svg>
  );
}