// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f0e8",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
    }}>
      <div style={{
        background: "#fffdf9",
        border: "1px solid #e8e0d4",
        borderRadius: 20,
        padding: "48px 40px",
        maxWidth: 400,
        textAlign: "center"
      }}>
        <p style={{ fontSize: 32, marginBottom: 16 }}>👋</p>
        <h1 style={{ fontWeight: 400, color: "#1a1510", marginBottom: 8 }}>
          You&apos;re signed in!
        </h1>
        <p style={{ color: "#8a7d6a", fontSize: 14 }}>
          Replace this page with your real dashboard.
        </p>
      </div>
    </main>
  );
}