import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";

export const GetStarted: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, loginWithGoogle } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customKey, setCustomKey] = useState("");

  // If already logged in, redirect directly to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const destination = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
      // On browser redirect to Google, execution stops.
    } catch (err: any) {
      console.error("[GetStarted] Google OAuth error:", err);
      setErrorMsg(err?.message || "Failed to connect to Google OAuth. Please check Supabase configuration.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex flex-col items-center justify-center gap-3 text-[#6B635B]">
        <div className="flex items-center gap-1 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97736]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#181311]" />
        </div>
        <span className="w-7 h-7 border-2 border-[#181311] border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs text-[#9E948B]">Checking operator session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-[#191513]">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#D97736]/10 to-transparent blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Top Home Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B635B] hover:text-[#191513] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to VeraOS</span>
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#9E948B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D7A46] animate-pulse" />
            <span>Auth Live</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E8E4DC] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 sm:p-10 flex flex-col text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#D97736]" />
              <span className="w-3 h-3 rounded-full bg-[#181311]" />
            </div>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-[#191513]">
              Vera<span className="text-[#D97736]">OS</span>
            </span>
          </div>

          {/* Heading required by prompt */}
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#191513] tracking-tight">
            Welcome to VeraOS
          </h1>

          <p className="text-sm text-[#6B635B] mt-2.5 leading-relaxed">
            The verification layer for AI agents. Verify before you trust.
          </p>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mt-6 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-xs text-[#DC2626] text-left flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                error
              </span>
              <div className="flex-1 leading-relaxed">
                <span className="font-semibold block mb-0.5">Sign in error:</span>
                {errorMsg}
              </div>
            </div>
          )}

          {/* Primary Action Button required by prompt */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#181311] hover:bg-[#2A2422] active:scale-[0.99] text-white font-heading font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Redirecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* Inline Supabase Anon Key Setup Card when missing in environment */}
          {!isSupabaseConfigured && (
            <div className="mt-6 p-4 rounded-2xl bg-[#FFF8F0] border border-[#F3DFC9] text-left">
              <div className="flex items-center gap-2 text-[#C96A2B] font-heading font-bold text-xs uppercase tracking-wider mb-1.5">
                <span className="material-symbols-outlined text-[16px]">key</span>
                <span>Supabase Anon Key Setup</span>
              </div>
              <p className="text-xs text-[#6B635B] leading-relaxed mb-3">
                To connect real Google OAuth, enter your Supabase project's public <code className="bg-[#EAE5DE] px-1 py-0.5 rounded text-[11px] font-mono text-[#191513]">anon</code> key, or add <code className="bg-[#EAE5DE] px-1 py-0.5 rounded text-[11px] font-mono text-[#191513]">VITE_SUPABASE_ANON_KEY</code> to your Vercel Environment Variables.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value.trim())}
                  placeholder="Paste anon key (starts with eyJ...)"
                  className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded-xl text-xs text-[#191513] placeholder-[#9E948B] focus:outline-none focus:border-[#181311]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customKey.startsWith("eyJ") || customKey.length > 20) {
                      localStorage.setItem("VITE_SUPABASE_ANON_KEY", customKey);
                      window.location.reload();
                    } else {
                      setErrorMsg("Please enter a valid Supabase anon public key (JWT string starting with eyJ...).");
                    }
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#181311] hover:bg-[#2A2422] text-white text-xs font-semibold cursor-pointer transition-all"
                >
                  Save Key & Enable Google Auth
                </button>
              </div>
              <div className="mt-3 pt-2.5 border-t border-[#F3DFC9] text-[11px] text-[#9E948B] flex items-center justify-between">
                <span>Project: tybbujphwrxwpurigeil</span>
                <a
                  href="https://supabase.com/dashboard/project/tybbujphwrxwpurigeil/settings/api"
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-medium text-[#C96A2B] hover:text-[#A7541D]"
                >
                  Get API Key &rarr;
                </a>
              </div>
            </div>
          )}

          {/* Footer Notes */}
          <div className="mt-8 pt-6 border-t border-[#E8E4DC] flex flex-col gap-2 text-center text-xs text-[#9E948B]">
            <p>
              By signing in, you agree to the{" "}
              <Link to="/terms" className="underline hover:text-[#191513]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-[#191513]">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2 font-mono text-[10px] text-[#6B635B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D7A46]" />
              <span>Secured by Supabase Auth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
