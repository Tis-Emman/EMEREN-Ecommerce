"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Triangle,
  ArrowRight,
  MailCheck,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState(["", "", "", "", "", "", "", ""]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInput = (index: number, value: string) => {
    // Handle paste of full code
    if (value.length === 8 && /^\d{8}$/.test(value)) {
      const digits = value.split("");
      setCode(digits);
      inputRefs.current[7]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setErrorMsg("");

    if (digit && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 8 filled
    if (digit && newCode.every((d) => d !== "") && index === 7) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (code[index] === "" && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 8);
    if (pasted.length === 8) {
      setCode(pasted.split(""));
      inputRefs.current[7]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (otp?: string) => {
    const finalCode = otp ?? code.join("");
    if (finalCode.length !== 8) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: finalCode,
        type: "email",
      });

      if (error) {
        setStatus("error");
        setErrorMsg(
          error.message === "Token has expired or is invalid"
            ? "Invalid or expired code. Please try again or request a new one."
            : error.message,
        );
        setCode(["", "", "", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setStatus("success");
        setTimeout(() => router.push("/"), 2000);
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setErrorMsg("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (!error) {
        setResendCooldown(60);
        setCode(["", "", "", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setErrorMsg("Failed to resend. Please try again.");
      }
    } catch {
      setErrorMsg("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const filled = code.filter(Boolean).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f7f4",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        color: "#1a1a2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse    { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
        @keyframes drift1   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-30px)} }
        @keyframes drift2   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,40px)} }
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes successPop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes shake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }

        .brand   { font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; }
        .display { font-family: 'Outfit', sans-serif; }

        .otp-input {
          width: 44px;
          height: 52px;
          border-radius: 12px;
          border: 2px solid rgba(0,0,0,0.1);
          background: #fff;
          font-size: 20px;
          font-weight: 800;
          color: #1a1a2e;
          text-align: center;
          outline: none;
          transition: border-color .2s, box-shadow .2s, transform .15s;
          font-family: 'Outfit', sans-serif;
          caret-color: transparent;
        }
        .otp-input:focus {
          border-color: #d97706;
          box-shadow: 0 0 0 4px rgba(217,119,6,0.12);
          transform: translateY(-2px);
        }
        .otp-input.filled {
          border-color: rgba(217,119,6,0.4);
          background: rgba(217,119,6,0.04);
        }
        .otp-input.error {
          border-color: #ef4444;
          background: rgba(239,68,68,0.04);
          animation: shake .4s ease;
        }
        .otp-input.success {
          border-color: #22c55e;
          background: rgba(34,197,94,0.06);
        }
        .otp-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .verify-btn {
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
          transition: background .15s, transform .15s, box-shadow .15s, opacity .15s;
          box-shadow: 0 4px 16px rgba(217,119,6,0.35);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .verify-btn:hover:not(:disabled) { background: #b45309; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(217,119,6,0.45); }
        .verify-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .resend-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #d97706;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: opacity .2s;
        }
        .resend-btn:disabled { opacity: 0.4; cursor: not-allowed; color: #9ca3af; }
        .resend-btn:hover:not(:disabled) { opacity: 0.75; }
      `}</style>

      {/* Background blobs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "45%",
            height: "45%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, #ddd6fe 0%, transparent 70%)",
            filter: "blur(70px)",
            opacity: 0.5,
            animation: "drift1 18s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-5%",
            width: "40%",
            height: "40%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, #bfdbfe 0%, transparent 70%)",
            filter: "blur(70px)",
            opacity: 0.45,
            animation: "drift2 22s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "10%",
            width: "30%",
            height: "30%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, #fde68a 0%, transparent 70%)",
            filter: "blur(60px)",
            opacity: 0.4,
          }}
        />
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "3px",
              height: "3px",
              borderRadius: "50%",
              background: "#d97706",
              top: `${(i * 53 + 11) % 90}%`,
              left: `${(i * 67 + 7) % 90}%`,
              opacity: 0.12,
              animation: `pulse ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          position: "relative",
          zIndex: 1,
          animation: "fadeUp .5s ease both",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "36px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "9px",
                background: "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(217,119,6,0.3)",
              }}
            >
              <Triangle size={14} color="#fff" fill="#fff" />
            </span>
            <span
              className="brand"
              style={{ fontSize: "22px", fontWeight: 800, color: "#1a1a2e" }}
            >
              EMEREN
            </span>
          </Link>
        </div>

        {/* Main card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            border: "1px solid rgba(0,0,0,0.07)",
            padding: "40px 28px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          }}
        >
          {status === "success" ? (
            /* ── Success state ── */
            <div
              style={{ textAlign: "center", animation: "fadeUp .4s ease both" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "rgba(34,197,94,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "successPop .5s ease both",
                  }}
                >
                  <CheckCircle size={38} color="#22c55e" />
                </div>
              </div>
              <h2
                className="display"
                style={{
                  fontSize: "26px",
                  fontWeight: 900,
                  color: "#1a1a2e",
                  marginBottom: "10px",
                  letterSpacing: "-0.5px",
                }}
              >
                Account verified!
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                Your email has been confirmed. Redirecting you now...
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "3px solid #d97706",
                    borderTopColor: "transparent",
                    animation: "spin .8s linear infinite",
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              {/* Icon */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "18px",
                    background: "rgba(217,119,6,0.08)",
                    border: "1px solid rgba(217,119,6,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MailCheck size={30} color="#d97706" />
                </div>
              </div>

              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <h1
                  className="display"
                  style={{
                    fontSize: "clamp(22px, 4vw, 28px)",
                    fontWeight: 900,
                    letterSpacing: "-0.5px",
                    color: "#1a1a2e",
                    marginBottom: "10px",
                  }}
                >
                  Check your email
                </h1>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    lineHeight: 1.6,
                  }}
                >
                  We sent an 8-digit verification code to
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#1a1a2e",
                    marginTop: "4px",
                  }}
                >
                  {email || "your email address"}
                </p>
              </div>

              {/* OTP inputs */}
              <div
                style={{
                  display: "flex",
                  gap: "7px",
                  justifyContent: "center",
                  marginBottom: "28px",
                }}
                onPaste={handlePaste}
              >
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    className={`otp-input ${status === "error" ? "error" : ""} ${digit ? "filled" : ""}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={digit}
                    disabled={status === "loading"}
                    onChange={(e) => handleInput(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onFocus={(e) => e.target.select()}
                  />
                ))}
              </div>

              {/* Progress dots */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "6px",
                  marginBottom: "24px",
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: i < filled ? "#d97706" : "rgba(0,0,0,0.1)",
                      transition: "background .2s",
                    }}
                  />
                ))}
              </div>

              {/* Error message */}
              {status === "error" && errorMsg && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    background: "rgba(239,68,68,0.06)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    marginBottom: "20px",
                    animation: "fadeUp .3s ease both",
                  }}
                >
                  <XCircle
                    size={16}
                    color="#ef4444"
                    style={{ flexShrink: 0 }}
                  />
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#ef4444",
                      fontWeight: 500,
                    }}
                  >
                    {errorMsg}
                  </p>
                </div>
              )}

              {/* Verify button */}
              <button
                className="verify-btn"
                onClick={() => handleVerify()}
                disabled={filled < 8 || status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        border: "2.5px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        animation: "spin .7s linear infinite",
                      }}
                    />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Email <ArrowRight size={15} />
                  </>
                )}
              </button>

              {/* Resend */}
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#9ca3af",
                    marginBottom: "8px",
                  }}
                >
                  Didn't receive the code?
                </p>
                <button
                  className="resend-btn"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || resending}
                >
                  <RefreshCw
                    size={13}
                    style={{
                      animation: resending
                        ? "spin .7s linear infinite"
                        : "none",
                    }}
                  />
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : resending
                      ? "Sending..."
                      : "Resend code"}
                </button>
              </div>

              {/* Back to signup */}
              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <Link
                  href="/auth/signup"
                  style={{
                    fontSize: "13px",
                    color: "#9ca3af",
                    textDecoration: "none",
                    transition: "color .2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#374151")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#9ca3af")
                  }
                >
                  ← Back to sign up
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Tip */}
        {status !== "success" && (
          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#9ca3af",
              marginTop: "20px",
              lineHeight: 1.6,
            }}
          >
            The code expires in{" "}
            <span style={{ fontWeight: 700 }}>10 minutes</span>. Check your spam
            folder if you don't see it.
          </p>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense> 
  );
}