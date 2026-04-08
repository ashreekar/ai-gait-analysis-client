"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LiveDot } from "@/components/GaitUI";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  if (status === "loading") {
    return (
      <div
        style={{
          background: "var(--navy)",
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "2px solid var(--border)",
              borderTop: "2px solid var(--accent)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto",
            }}
          />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--navy)",
        minHeight: "100dvh",
        maxWidth: "var(--max-w)",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Mesh background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(ellipse 500px 400px at 100% 0%, rgba(232,67,147,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 400px 300px at 0% 70%, rgba(59,130,246,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 600px 400px at 50% 110%, rgba(17,34,64,0.9) 0%, transparent 70%)
          `,
        }}
      />

      {/* Animated gait lines decorative */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          right: "-10%",
          width: 340,
          height: 340,
          opacity: 0.06,
          pointerEvents: "none",
        }}
      >
        <svg viewBox="0 0 340 340" fill="none">
          {[0.9, 0.7, 0.5, 0.3].map((r, i) => (
            <circle
              key={i}
              cx="170"
              cy="170"
              r={170 * r}
              stroke="white"
              strokeWidth="1"
            />
          ))}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <line
              key={i}
              x1="170"
              y1="170"
              x2={170 + 170 * Math.cos((deg * Math.PI) / 180)}
              y2={170 + 170 * Math.sin((deg * Math.PI) / 180)}
              stroke="white"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 24px 40px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── Hero ── */}
        <div>
          {/* Status chip */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 20,
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
              marginBottom: 40,
            }}
          >
            <LiveDot />
            <span
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 11,
                color: "rgba(134,239,172,0.9)",
              }}
            >
              Post-Surgery Gait Rehabilitation
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 44,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              marginBottom: 16,
            }}
          >
            <span style={{ color: "var(--text)" }}>Smart</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #E84393, #c026d3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Gait
            </span>
            <br />
            <span style={{ color: "var(--text)" }}>Analysis</span>
          </h1>

          <p
            style={{
              fontSize: 15,
              color: "var(--text2)",
              lineHeight: 1.6,
              maxWidth: 300,
              marginBottom: 32,
            }}
          >
            Clinically validated rehabilitation monitoring for post-knee surgery
            patients. Real-time gait symmetry, pressure heatmaps, and discharge
            tracking.
          </p>

          {/* Feature chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            {[
              "16-sensor FSR insoles",
              "Real-time symmetry",
              "Fall risk scoring",
              "Discharge tracking",
            ].map((feat) => (
              <div
                key={feat}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)",
                  fontSize: 11,
                  color: "var(--text2)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {feat}
              </div>
            ))}
          </div>
        </div>

        {/* ── Login Card ── */}
        <div>
          {/* Stats strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 1,
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid var(--border)",
              marginBottom: 24,
            }}
          >
            {[
              { val: "10", label: "Charts" },
              { val: "12", label: "Formulas" },
              { val: "85%", label: "SI Target" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  padding: "12px 8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #E84393, #3B82F6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontFamily: "DM Mono, monospace",
                    fontSize: 9,
                    color: "var(--text3)",
                    marginTop: 2,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Patient Login
            </div>
            <div
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 11,
                color: "var(--text3)",
                marginBottom: 20,
              }}
            >
              Sign in to access your rehabilitation dashboard
            </div>

            {/* Google Sign In */}
            <button
              onClick={async () => {
                setLoading(true);
                await signIn("google", { callbackUrl: "/dashboard" });
              }}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 12,
                background: loading
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.92)",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 12,
                transition: "all 0.15s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span
                style={{
                  color: loading ? "var(--text3)" : "#1a1a1a",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                {loading ? "Signing in…" : "Continue with Google"}
              </span>
            </button>

            {/* Demo credentials */}
            <div
              style={{
                background: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: 10,
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: 10,
                  color: "#93c5fd",
                  marginBottom: 4,
                }}
              >
                Demo Access
              </div>
              <button
                onClick={() =>
                  signIn("credentials", {
                    email: "demo@gaitanalysis.app",
                    password: "demo123",
                    callbackUrl: "/dashboard",
                  })
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontFamily: "DM Mono, monospace",
                  fontSize: 11,
                  color: "rgba(147,197,253,0.8)",
                  textDecoration: "underline",
                }}
              >
                Sign in as demo patient →
              </button>
            </div>

            <div
              style={{
                marginTop: 14,
                fontSize: 10,
                color: "var(--text3)",
                fontFamily: "DM Mono, monospace",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              Research use only. For patient care, consult a qualified
              physiotherapist.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}