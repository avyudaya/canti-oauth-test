"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function CallbackContent() {
  const searchParams = useSearchParams();

  const code    = searchParams.get("code");
  const state   = searchParams.get("state");
  const error   = searchParams.get("error");
  const userRaw = searchParams.get("user");

  let user: { name?: { firstName?: string; lastName?: string }; email?: string } | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(decodeURIComponent(userRaw));
    } catch {
      // ignore
    }
  }

  const isError = !!error || !code;

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
        background: isError
          ? "radial-gradient(circle, rgba(248,113,113,0.05) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
        transition: "background 0.5s",
      }} />

      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        width: "100%",
        maxWidth: "620px",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: "2.5rem",
            marginBottom: "0.5rem",
          }}>
            {isError ? "✗" : "✓"}
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "1.75rem",
            fontWeight: 400,
            color: isError ? "var(--red)" : "var(--green)",
            letterSpacing: "-0.02em",
          }}>
            {isError ? "Authentication Failed" : "Authentication Successful"}
          </h1>
          <p style={{
            marginTop: "0.4rem",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            Apple OAuth Response
          </p>
        </div>

        {isError ? (
          <div style={{
            width: "100%",
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.3)",
            borderRadius: "12px",
            padding: "1.5rem",
          }}>
            <Field label="error" value={error || "No authorization code received"} isError />
          </div>
        ) : (
          <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}>
            {/* Authorization Code */}
            <Section title="Authorization Code" accent="var(--accent)">
              <Field label="code" value={code!} mono truncate />
              <Field label="state" value={state || ""} mono />
            </Section>

            {/* User Info - only on first login */}
            {user ? (
              <Section title="User Info" subtitle="Sent by Apple on first login only" accent="var(--green)">
                {user.name && (
                  <Field
                    label="name"
                    value={[user.name.firstName, user.name.lastName].filter(Boolean).join(" ") || "—"}
                  />
                )}
                {user.email && <Field label="email" value={user.email} />}
              </Section>
            ) : (
              <Section title="User Info" accent="var(--text-muted)">
                <p style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                }}>
                  No user object received. Apple only sends{" "}
                  <span style={{ color: "var(--accent)" }}>name</span> and{" "}
                  <span style={{ color: "var(--accent)" }}>email</span> on the{" "}
                  <strong style={{ color: "var(--text-dim)" }}>very first</strong> login.
                  After that, only the <span style={{ color: "var(--accent)" }}>code</span> is returned.
                  Use the code to exchange for tokens on your server.
                </p>
              </Section>
            )}

            {/* Raw JSON dump */}
            <Section title="Raw Payload" subtitle="Full data as received">
              <pre style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                color: "var(--text-dim)",
                background: "var(--bg)",
                borderRadius: "8px",
                padding: "1rem",
                overflow: "auto",
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}>
                {JSON.stringify({ code, state, user: user ?? "(not provided)" }, null, 2)}
              </pre>
            </Section>
          </div>
        )}

        <Link href="/" style={{
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          textDecoration: "none",
          letterSpacing: "0.05em",
          padding: "0.5rem 1rem",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          transition: "color 0.15s, border-color 0.15s",
        }}
          onMouseEnter={e => {
            (e.target as HTMLAnchorElement).style.color = "var(--text)";
            (e.target as HTMLAnchorElement).style.borderColor = "var(--text-dim)";
          }}
          onMouseLeave={e => {
            (e.target as HTMLAnchorElement).style.color = "var(--text-muted)";
            (e.target as HTMLAnchorElement).style.borderColor = "var(--border)";
          }}
        >
          ← Back to Sign In
        </Link>
      </div>
    </main>
  );
}

function Section({
  title,
  subtitle,
  accent = "var(--accent)",
  children,
}: {
  title: string;
  subtitle?: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      overflow: "hidden",
    }}>
      <div style={{
        padding: "0.75rem 1.25rem",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "baseline",
        gap: "0.75rem",
        background: "var(--surface-2)",
      }}>
        <span style={{
          fontSize: "0.65rem",
          fontWeight: 500,
          color: accent,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}>
          {title}
        </span>
        {subtitle && (
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
            {subtitle}
          </span>
        )}
      </div>
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono = false,
  truncate = false,
  isError = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  truncate?: boolean;
  isError?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      <span style={{
        fontSize: "0.65rem",
        color: "var(--text-muted)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}>
        {label}
      </span>
      <span style={{
        fontSize: mono ? "0.72rem" : "0.85rem",
        fontFamily: mono ? "'DM Mono', monospace" : undefined,
        color: isError ? "var(--red)" : "var(--text)",
        wordBreak: truncate ? "break-all" : "normal",
        lineHeight: 1.5,
      }}>
        {value}
      </span>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
        fontSize: "0.8rem",
        letterSpacing: "0.1em",
      }}>
        LOADING...
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}