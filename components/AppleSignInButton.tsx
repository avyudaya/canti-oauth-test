"use client";
// components/AppleSignInButton.tsx

import { initiateAppleSignIn } from "@/lib/apple-auth";

interface Props {
  className?: string;
}

export default function AppleSignInButton({ className }: Props) {
  const handleClick = () => {
    const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      console.error(
        "Missing NEXT_PUBLIC_APPLE_CLIENT_ID or NEXT_PUBLIC_APPLE_REDIRECT_URI in .env.local"
      );
      return;
    }

    initiateAppleSignIn({
      clientId,
      redirectUri,
      scope: "name email",
      responseType: "code",
      responseMode: "form_post", // Required for name+email scope
    });
  };

  return (
    <button onClick={handleClick} className={`apple-btn ${className ?? ""}`}>
      <AppleLogo />
      <span>Sign in with Apple</span>

      <style jsx>{`
        .apple-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 15px;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
          white-space: nowrap;
          min-width: 200px;
          justify-content: center;
          letter-spacing: -0.01em;
        }
        .apple-btn:hover {
          background: #1a1a1a;
        }
        .apple-btn:active {
          transform: scale(0.98);
          background: #333;
        }
      `}</style>
    </button>
  );
}

function AppleLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 814 1000"
      fill="currentColor"
    >
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.6 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.1 0 108.6-49 191.4-49 30.8 0 108.2 2.6 168.1 79.1zm-112.6-246.7c31.8-39.5 54.2-94.5 54.2-149.5 0-7.7-.6-15.5-2-22.5-51.5 1.9-112.8 34.5-149.6 79.5-28.2 33.8-55.8 88.8-55.8 144.6 0 8.3 1.3 16.6 2 19.2 3.3.6 8.3 1.3 13.3 1.3 46.1 0 99.3-31.3 138-72.6z" />
    </svg>
  );
}