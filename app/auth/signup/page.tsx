"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Triangle,
  Shield,
  Truck,
  Zap,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSocialSignUp = async (provider: 'google' | 'facebook') => {
    try {
      setSocialLoading(provider);
      setSubmitError("");
      
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: provider === 'facebook' ? {
            // Facebook specific parameters
            display: 'popup',
          } : undefined,
        },
      });

      if (error) {
        setSubmitError(error.message);
        setSocialLoading(null);
      }
      // No need to setSocialLoading false on success as the page will redirect
    } catch (err) {
      setSubmitError("Failed to sign up with " + provider);
      setSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) { setSubmitError("Please agree to the Terms of Service."); return; }
    if (form.password !== form.confirm) { setSubmitError("Passwords do not match."); return; }
    if (strength < 2) { setSubmitError("Please choose a stronger password."); return; }

    setSubmitting(true);
    setSubmitError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { 
            first_name: form.firstName, 
            last_name: form.lastName,
            full_name: `${form.firstName} ${form.lastName}`.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setSubmitError(error.message);
      } else {
        router.push(`/auth/verify?email=${encodeURIComponent(form.email)}`);
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const passwordStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"][strength];

  return (
    <div
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
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes drift1  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-30px)} }
        @keyframes drift2  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,40px)} }
        @keyframes pulse   { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
        @keyframes spin    { to { transform: rotate(360deg); } }

        .brand { font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; }
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
        .submit-btn:hover:not(:disabled) { background: #b45309; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(217,119,6,0.45); }
        .submit-btn:active:not(:disabled) { background: #92400e; transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

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
        .social-btn:hover:not(:disabled) { border-color: rgba(217,119,6,.4); background: #fffbf2; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .social-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .panel-card {
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(217,119,6,0.15);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(8px);
        }

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
      `}</style>

      {/* ── Left panel — branding ── */}
      <div
        style={{
          width: "45%",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
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
          <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "60%", height: "60%", borderRadius: "50%", background: "radial-gradient(ellipse, #ddd6fe 0%, transparent 70%)", filter: "blur(60px)", opacity: 0.6, animation: "drift1 18s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "55%", height: "55%", borderRadius: "50%", background: "radial-gradient(ellipse, #bfdbfe 0%, transparent 70%)", filter: "blur(70px)", opacity: 0.55, animation: "drift2 22s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: "40%", right: "5%", width: "35%", height: "35%", borderRadius: "50%", background: "radial-gradient(ellipse, #fde68a 0%, transparent 70%)", filter: "blur(60px)", opacity: 0.5 }} />
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
            {/* Subtext */}
            <p style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d97706", marginBottom: "16px", fontFamily: "'Outfit', sans-serif" }}>
              Join thousands of customers
            </p>

            {/* Headline */}
            <h2
              className="display"
              style={{ fontSize: "clamp(38px, 4.5vw, 56px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1.5px", color: "#1a1a2e", marginBottom: "24px" }}
            >
              Cool your space.<br />
              <span style={{ color: "#d97706" }}>Save energy.</span><br />
              Live better.
            </h2>

            {/* Description */}
            <p style={{ fontSize: "16px", color: "#6b7280", lineHeight: 1.7, maxWidth: "340px" }}>
              Create your Emeren account and get access to exclusive deals, order tracking, and expert AC support — all in one place.
            </p>

            {/* Perks */}
            <div style={{ marginTop: "36px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: <Zap size={18} color="#d97706" />, text: "Exclusive member discounts on every order" },
                { icon: <Truck size={18} color="#d97706" />, text: "Free Baliuag delivery on all units" },
                { icon: <Shield size={18} color="#d97706" />, text: "Warranty tracking and service requests" },
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {p.icon}
                  </div>
                  <span style={{ fontSize: "15px", color: "#374151", fontWeight: 500 }}>{p.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="panel-card">
            <div style={{ display: "flex", gap: "3px", marginBottom: "10px" }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: "#d97706", fontSize: "13px" }}>★</span>
              ))}
            </div>
            <p style={{ fontSize: "13px", color: "#4b5563", lineHeight: 1.6, marginBottom: "12px" }}>
              "Ordered a 1.5HP inverter unit on a Tuesday, it was installed by Thursday. Emeren made the whole process effortless."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #d97706, #fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#fff" }}>M</div>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#1a1a2e" }}>Maria S.</p>
                <p style={{ fontSize: "11px", color: "#9ca3af" }}>Quezon City</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div
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
        {/* Mobile logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }} className="flex lg:hidden">
          <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Triangle size={12} color="#fff" fill="#fff" />
          </span>
          <span className="brand" style={{ fontSize: "20px", fontWeight: 800, color: "#1a1a2e" }}>EMEREN</span>
        </div>

        <div style={{ width: "100%", maxWidth: "440px", animation: "fadeUp .5s ease both" }}>

          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <h1 className="display" style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 900, letterSpacing: "-1px", color: "#1a1a2e", marginBottom: "8px" }}>
              Create your account
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              Already have one?{" "}
              <Link href="/auth/signin" style={{ color: "#d97706", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
            </p>
          </div>

          {/* Social buttons */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <button 
              className="social-btn" 
              onClick={() => handleSocialSignUp('google')}
              disabled={!!socialLoading}
            >
              {socialLoading === 'google' ? (
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #4285F4", borderTopColor: "transparent", animation: "spin .7s linear infinite" }} />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
            </button>
            <button 
              className="social-btn"
              onClick={() => handleSocialSignUp('facebook')}
              disabled={!!socialLoading}
            >
              {socialLoading === 'facebook' ? (
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #1877F2", borderTopColor: "transparent", animation: "spin .7s linear infinite" }} />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )}
              {socialLoading === 'facebook' ? 'Connecting...' : 'Continue with Facebook'}
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
            <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>or sign up with email</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>First Name</label>
                <input className="input-field" type="text" name="firstName" placeholder="Juan" value={form.firstName} onChange={handleChange} onFocus={() => setFocused("firstName")} onBlur={() => setFocused(null)} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Last Name</label>
                <input className="input-field" type="text" name="lastName" placeholder="dela Cruz" value={form.lastName} onChange={handleChange} onFocus={() => setFocused("lastName")} onBlur={() => setFocused(null)} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Email Address</label>
              <input className="input-field" type="email" name="email" placeholder="juan@example.com" value={form.email} onChange={handleChange} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input className="input-field" type={showPassword ? "text" : "password"} name="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} style={{ paddingRight: "44px" }} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i <= strength ? strengthColor : "rgba(0,0,0,0.08)", transition: "background .3s" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: "11px", color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input className="input-field" type={showConfirm ? "text" : "password"} name="confirm" placeholder="Repeat your password" value={form.confirm} onChange={handleChange} onFocus={() => setFocused("confirm")} onBlur={() => setFocused(null)} style={{ paddingRight: "44px", borderColor: form.confirm && form.confirm !== form.password ? "#ef4444" : undefined }} />
                <button type="button" onClick={() => setShowConfirm((v) => !v)} style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center" }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>Passwords do not match</p>
              )}
              {form.confirm && form.confirm === form.password && (
                <p style={{ fontSize: "11px", color: "#22c55e", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Check size={11} /> Passwords match
                </p>
              )}
            </div>

            {/* Terms */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div className={`checkbox-custom ${form.agree ? "checked" : ""}`} onClick={() => setForm((prev) => ({ ...prev, agree: !prev.agree }))} style={{ marginTop: "1px" }}>
                {form.agree && <Check size={11} color="#fff" strokeWidth={3} />}
              </div>
              <span style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>
                I agree to Emeren's{" "}
                <Link href="/terms" style={{ color: "#d97706", fontWeight: 600, textDecoration: "none" }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" style={{ color: "#d97706", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</Link>
              </span>
            </div>

            {/* Submit error */}
            {submitError && (
              <div style={{ padding: "12px 14px", borderRadius: "12px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 500 }}>{submitError}</p>
              </div>
            )}

            {/* Submit */}
            <button className="submit-btn" type="submit" disabled={submitting || !!socialLoading} style={{ marginTop: "4px" }}>
              {submitting ? (
                <>
                  <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin .7s linear infinite" }} />
                  Creating account...
                </>
              ) : (
                <>Create Account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "24px" }}>
            By signing up, you'll receive updates and offers from Emeren.{" "}
            <Link href="/unsubscribe" style={{ color: "#9ca3af", textDecoration: "underline" }}>Unsubscribe anytime.</Link>
          </p>
        </div>
      </div>
    </div>
  );
}