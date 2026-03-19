"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Triangle,
  Shield,
  Zap,
  Package
} from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);

  const handleSocialSignIn = async (provider: "google" | "facebook") => {
    setSocialLoading(provider);
    setErrorMsg("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setStatus("error");
        setErrorMsg(error.message);
        setSocialLoading(null);
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
      setSocialLoading(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setStatus("error");
      setErrorMsg("Please enter your email and password.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setStatus("error");
        setErrorMsg(
          error.message === "Invalid login credentials"
            ? "Incorrect email or password. Please try again."
            : error.message
        );
      } else {
        router.push("/shop");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="page-wrapper"
      style={{
        minHeight: "100vh",
        background: "#f8f7f4",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        color: "#1a1a2e",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes drift1  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-30px)} }
        @keyframes drift2  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,40px)} }
        @keyframes pulse   { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
        @keyframes spin    { to { transform: rotate(360deg); } }

        .brand   { font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; }
        .display { font-family: 'Outfit', sans-serif; }

        .input-field {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1.5px solid rgba(0,0,0,0.1);
          background: #ffffff;
          font-size: 14px;
          color: #1a1a2e;
          font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .input-field:focus {
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217,119,6,0.1);
        }
        .input-field::placeholder { color: #9ca3af; }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #d97706;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background .15s, transform .15s, box-shadow .15s;
          box-shadow: 0 4px 16px rgba(217,119,6,0.35);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .submit-btn:hover { background: #b45309; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(217,119,6,0.45); }
        .submit-btn:active { background: #92400e; transform: translateY(0); }

        .social-btn {
          flex: 1;
          padding: 11px 16px;
          background: #fff;
          border: 1.5px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: border-color .2s, background .2s, box-shadow .2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .social-btn:hover { border-color: rgba(217,119,6,.4); background: #fffbf2; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

        .checkbox-custom {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1.5px solid rgba(0,0,0,0.2);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .checkbox-custom.checked {
          background: #d97706;
          border-color: #d97706;
        }

        .stat-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(217,119,6,0.15);
          border-radius: 14px;
          backdrop-filter: blur(8px);
        }

        /* ── Mobile responsive ── */
        @media (max-width: 767px) {
          .page-wrapper { flex-direction: column !important; }
          .left-panel { display: none !important; }
          .right-panel {
            padding: 36px 20px 48px !important;
            justify-content: flex-start !important;
          }
          .mobile-logo { display: flex !important; }
          .social-row { flex-direction: column !important; }
          .social-btn { width: 100% !important; }
          .form-card { max-width: 100% !important; width: 100% !important; }
        }

        @media (min-width: 768px) {
          .left-panel { display: flex !important; }
          .mobile-logo { display: none !important; }
        }
      `}</style>

      {/* ── Left panel — branding ── */}
      <div
        className="left-panel"
        style={{
          width: "45%",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 48px",
          background: "linear-gradient(160deg, #fffbf2 0%, #fef3c7 40%, #e0f2fe 100%)",
          borderRight: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Background blobs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "60%", height: "60%", borderRadius: "50%", background: "radial-gradient(ellipse, #ddd6fe 0%, transparent 70%)", filter: "blur(60px)", opacity: 0.6, animation: "drift1 18s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: "55%", height: "55%", borderRadius: "50%", background: "radial-gradient(ellipse, #bfdbfe 0%, transparent 70%)", filter: "blur(70px)", opacity: 0.55, animation: "drift2 22s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: "40%", left: "5%", width: "35%", height: "35%", borderRadius: "50%", background: "radial-gradient(ellipse, #fde68a 0%, transparent 70%)", filter: "blur(60px)", opacity: 0.5 }} />
          {[...Array(16)].map((_, i) => (
            <div key={i} style={{ position: "absolute", width: "3px", height: "3px", borderRadius: "50%", background: "#d97706", top: `${(i * 53 + 11) % 90}%`, left: `${(i * 67 + 7) % 90}%`, opacity: 0.15, animation: `pulse ${3 + (i % 4)}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>

        {/* Center content */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "24px", width: "100%", maxWidth: "380px" }}>

          {/* Logo */}
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <span style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(217,119,6,0.3)" }}>
              <Triangle size={14} color="#fff" fill="#fff" />
            </span>
            <span className="brand" style={{ fontSize: "22px", fontWeight: 800, color: "#1a1a2e" }}>EMEREN</span>
          </Link>

          <div>
          <p style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d97706", marginBottom: "16px", fontFamily: "'Outfit', sans-serif" }}>
            Your account. Your comfort.
          </p>
          <h2
            className="display panel-headline"
            style={{ fontSize: "clamp(38px, 4.5vw, 56px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1.5px", color: "#1a1a2e", marginBottom: "24px" }}
          >
            Everything you<br />
            need is waiting<br />
            <span style={{ color: "#d97706" }}>inside.</span>
          </h2>
          <p style={{ fontSize: "16px", color: "#6b7280", lineHeight: 1.7, maxWidth: "340px" }}>
            Track your orders, manage warranties, book service appointments, and browse exclusive member deals.
          </p>

          {/* Stats */}
          <div style={{ marginTop: "36px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { icon: <Package size={18} color="#d97706" />, label: "Order tracking", value: "Real-time updates" },
              { icon: <Shield size={18} color="#d97706" />, label: "Warranty hub", value: "All your units, one place" },
              { icon: <Zap size={18} color="#d97706" />, label: "Member deals", value: "Up to 15% off" },
            ].map((s, i) => (
              <div key={i} className="stat-pill">
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
                  <p style={{ fontSize: "15px", color: "#1a1a2e", fontWeight: 600 }}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div
        className="right-panel"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          overflowY: "auto",
        }}
      >
        {/* Mobile logo — shown only on mobile */}
        <div className="mobile-logo" style={{ alignItems: "center", gap: "8px", marginBottom: "28px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Triangle size={12} color="#fff" fill="#fff" />
            </span>
            <span className="brand" style={{ fontSize: "20px", fontWeight: 800, color: "#1a1a2e" }}>EMEREN</span>
          </Link>
        </div>

        <div className="form-card" style={{ width: "100%", maxWidth: "420px", animation: "fadeUp .5s ease both" }}>

          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <h1
              className="display"
              style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 900, letterSpacing: "-1px", color: "#1a1a2e", marginBottom: "8px" }}
            >
              Welcome back
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              Don't have an account?{" "}
              <Link href="/auth/signup" style={{ color: "#d97706", fontWeight: 600, textDecoration: "none" }}>
                Sign up free
              </Link>
            </p>
          </div>

          {/* Social buttons */}
          <div className="social-row" style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <button className="social-btn" onClick={() => handleSocialSignIn("google")} disabled={socialLoading !== null} type="button">
              {socialLoading === "google" ? (
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid rgba(0,0,0,0.15)", borderTopColor: "#4285F4", animation: "spin .7s linear infinite" }} />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continue with Google
            </button>
            <button className="social-btn" onClick={() => handleSocialSignIn("facebook")} disabled={socialLoading !== null} type="button">
              {socialLoading === "facebook" ? (
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid rgba(0,0,0,0.15)", borderTopColor: "#1877F2", animation: "spin .7s linear infinite" }} />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )}
              Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
            <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>or sign in with email</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                Email Address
              </label>
              <input
                className="input-field"
                type="email"
                name="email"
                placeholder="juan@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>Password</label>
                <Link href="/auth/forgot-password" style={{ fontSize: "12px", color: "#d97706", fontWeight: 600, textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                className={`checkbox-custom ${form.remember ? "checked" : ""}`}
                onClick={() => setForm((prev) => ({ ...prev, remember: !prev.remember }))}
              >
                {form.remember && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>Remember me for 30 days</span>
            </div>

            {/* Error message */}
            {status === "error" && errorMsg && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 14px", borderRadius: "12px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 500 }}>{errorMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              className="submit-btn"
              type="submit"
              disabled={status === "loading"}
              style={{ marginTop: "4px", opacity: status === "loading" ? 0.7 : 1, cursor: status === "loading" ? "not-allowed" : "pointer" }}
            >
              {status === "loading" ? (
                <>
                  <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin .7s linear infinite" }} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "24px" }}>
            Protected by Emeren security.{" "}
            <Link href="/privacy" style={{ color: "#9ca3af", textDecoration: "underline" }}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>


    </div>
  );
}