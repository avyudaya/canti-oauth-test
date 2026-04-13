"use client";

import AppleSignInButton from "@/components/AppleSignInButton";

export default function HomePage() {
  return (
    <main className="container">
      <div className="card">
        <div className="logo-mark">⬡</div>
        <h1>Welcome back</h1>
        <p className="subtitle">Sign in to continue to your account</p>

        <div className="divider" />

        <AppleSignInButton />

        <p className="disclaimer">
          By signing in, you agree to our{" "}
          <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </p>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f0e8;
          background-image:
            radial-gradient(circle at 20% 20%, #e8ddd0 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, #ddd5c8 0%, transparent 50%);
          font-family: 'DM Sans', sans-serif;
        }

        .container {
          width: 100%;
          padding: 24px;
          display: flex;
          justify-content: center;
        }

        .card {
          background: #fffdf9;
          border: 1px solid #e8e0d4;
          border-radius: 20px;
          padding: 48px 40px;
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          box-shadow:
            0 1px 2px rgba(0,0,0,0.04),
            0 8px 32px rgba(0,0,0,0.06);
        }

        .logo-mark {
          font-size: 32px;
          color: #2a2318;
          line-height: 1;
          margin-bottom: 4px;
        }

        h1 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 28px;
          font-weight: 300;
          color: #1a1510;
          letter-spacing: -0.02em;
          text-align: center;
        }

        .subtitle {
          font-size: 14px;
          color: #8a7d6a;
          font-weight: 300;
          text-align: center;
          line-height: 1.5;
        }

        .divider {
          width: 40px;
          height: 1px;
          background: #e0d8cc;
          margin: 4px 0;
        }

        .disclaimer {
          font-size: 11.5px;
          color: #a89880;
          text-align: center;
          line-height: 1.6;
          max-width: 260px;
        }

        .disclaimer a {
          color: #6b5e4e;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .disclaimer a:hover {
          color: #2a2318;
        }
      `}</style>
    </main>
  );
}