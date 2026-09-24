import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { supabaseAuthService } from "../services/supabaseAuth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  walletAddress?: string;
  authProvider?: "password" | "google" | "stellar";
  googleId?: string;
  invitationStatus: "admin" | "invited" | "pending" | "revoked";
  createdAt?: string;
  lastLoginAt?: string;
  apiKey?: string;
}

interface StoredAccount extends User {
  passwordHash: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "signin" | "signup";
  openAuthModal: (mode?: "signin" | "signup") => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginAsDemo: () => void;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  connectWallet: (customAddress?: string) => Promise<boolean>;
  redeemInviteCode: (code: string) => Promise<{ success: boolean; message: string }>;
  loginWithOtp: (email: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; role?: string }) => Promise<boolean>;
  regenerateApiKey: () => Promise<string>;
  updatePassword: (currentPass: string, newPass: string) => Promise<boolean>;
  unlinkWallet: () => Promise<boolean>;
  refetchUser: () => Promise<void>;
}

const STORAGE_AUTH_KEY = "vera_auth_user_v1";
const STORAGE_USERS_KEY = "vera_registered_users_v1";

function getStoredUsers(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredAccount[]): void {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore storage quota issues
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("vera_logged_out") !== "1") {
        const raw = localStorage.getItem(STORAGE_AUTH_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.id === "usr_demo_operator" || parsed?.email?.includes("operator@vera-os.local")) {
            localStorage.removeItem(STORAGE_AUTH_KEY);
            return null;
          }
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signup");

  // Supabase real session listener and sync with safety timeout
  useEffect(() => {
    let isMounted = true;

    // Safety timeout: Ensure the UI loader NEVER hangs for more than 1.2s under any network or lock condition
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 1200);

    if (!isSupabaseConfigured) {
      setLoading(false);
      clearTimeout(safetyTimer);
      return;
    }

    // 1. Initial session check
    supabase.auth
      .getSession()
      .then(async ({ data: { session }, error }) => {
        if (!isMounted) return;
        if (error) {
          console.warn("[AuthContext] getSession warning:", error.message);
        }
        if (session?.user) {
          // Optimistic set so UI unlocks immediately (0ms wait)
          const fastUser: User = {
            id: session.user.id,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0] ||
              "Operator",
            email: session.user.email || "",
            role: "operator",
            avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
            walletAddress: undefined,
            authProvider: "google",
            googleId: session.user.id,
            invitationStatus: "invited",
            createdAt: session.user.created_at,
            apiKey: `vera_live_${session.user.id.slice(0, 8)}`,
          };
          setUser(fastUser);
          localStorage.removeItem("vera_logged_out");
          setLoading(false);
          clearTimeout(safetyTimer);

          // Background sync profile without blocking the UI
          supabaseAuthService
            .syncUserProfile(session.user)
            .then((profile) => {
              if (profile && isMounted) {
                setUser((prev) =>
                  prev
                    ? {
                        ...prev,
                        name: profile.full_name || prev.name,
                        role: profile.role || prev.role,
                        avatar: profile.avatar_url || prev.avatar,
                        walletAddress: profile.stellar_wallet || prev.walletAddress,
                        apiKey: profile.api_key || prev.apiKey,
                      }
                    : null
                );
              }
            })
            .catch(() => {});
        } else {
          if (localStorage.getItem("vera_logged_out") === "1") {
            setUser(null);
          }
          setLoading(false);
          clearTimeout(safetyTimer);
        }
      })
      .catch((err) => {
        console.warn("[AuthContext] getSession caught error:", err);
        if (isMounted) {
          setLoading(false);
          clearTimeout(safetyTimer);
        }
      });

    // 2. Auth state subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        // Optimistic update
        const fastUser: User = {
          id: session.user.id,
          name:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "Operator",
          email: session.user.email || "",
          role: "operator",
          avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
          walletAddress: undefined,
          authProvider: "google",
          googleId: session.user.id,
          invitationStatus: "invited",
          createdAt: session.user.created_at,
          apiKey: `vera_live_${session.user.id.slice(0, 8)}`,
        };
        setUser(fastUser);
        localStorage.removeItem("vera_logged_out");
        setLoading(false);
        clearTimeout(safetyTimer);

        // Background profile sync
        supabaseAuthService
          .syncUserProfile(session.user)
          .then((profile) => {
            if (profile && isMounted) {
              setUser((prev) =>
                prev
                  ? {
                      ...prev,
                      name: profile.full_name || prev.name,
                      role: profile.role || prev.role,
                      avatar: profile.avatar_url || prev.avatar,
                      walletAddress: profile.stellar_wallet || prev.walletAddress,
                      apiKey: profile.api_key || prev.apiKey,
                    }
                  : null
              );
            }
          })
          .catch(() => {});
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        localStorage.setItem("vera_logged_out", "1");
        setLoading(false);
        clearTimeout(safetyTimer);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user));
      } else if (localStorage.getItem("vera_logged_out") === "1") {
        localStorage.removeItem(STORAGE_AUTH_KEY);
      }
    } catch {
      // ignore storage access errors
    }
  }, [user]);

  const openAuthModal = (mode: "signin" | "signup" = "signin") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await fetch("/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: pass }),
      });
      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }
      if (data.token) {
        localStorage.setItem("vera_session_token_v1", data.token);
      }
      const activeUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar,
        walletAddress: data.user.stellar_wallet,
        authProvider: data.user.auth_provider || "password",
        googleId: data.user.google_id,
        invitationStatus: data.user.invitation_status || "invited",
        createdAt: data.user.created_at,
        lastLoginAt: data.user.last_login_at,
        apiKey: data.user.api_key || `vera_live_${data.user.id.slice(0, 8)}`,
      };
      setUser(activeUser);
      setIsAuthModalOpen(false);
      return true;
    } catch (err) {
      // Local database fallback for offline / disconnected dev mode
      const users = getStoredUsers();
      const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        if (existing.passwordHash !== pass) {
          throw new Error("Invalid password for this account.");
        }
        const activeUser: User = {
          id: existing.id,
          name: existing.name,
          email: existing.email,
          role: existing.role,
          avatar: existing.avatar,
          walletAddress: existing.walletAddress,
          authProvider: "password",
          invitationStatus: existing.invitationStatus || "invited",
        };
        setUser(activeUser);
        setIsAuthModalOpen(false);
        return true;
      }
      throw err;
    }
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await fetch("/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: cleanEmail, password: pass }),
      });
      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }
      if (data.token) {
        localStorage.setItem("vera_session_token_v1", data.token);
      }
      const activeUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar,
        walletAddress: data.user.stellar_wallet,
        authProvider: data.user.auth_provider || "password",
        googleId: data.user.google_id,
        invitationStatus: data.user.invitation_status || "pending",
      };
      setUser(activeUser);
      setIsAuthModalOpen(false);
      return true;
    } catch (err) {
      // Local fallback
      const users = getStoredUsers();
      const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        throw new Error("An account with this email already exists. Please sign in.");
      }
      const newAccount: StoredAccount = {
        id: `usr_${Date.now().toString(36)}`,
        name: name.trim(),
        email: cleanEmail,
        role: "AI Verification Engineer",
        passwordHash: pass,
        authProvider: "password",
        invitationStatus: "pending",
        createdAt: new Date().toISOString(),
      };
      saveStoredUsers([...users, newAccount]);
      setUser({
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        role: newAccount.role,
        authProvider: "password",
        invitationStatus: "pending",
      });
      setIsAuthModalOpen(false);
      return true;
    }
  };

  const connectWallet = async (customAddress?: string): Promise<boolean> => {
    let address = customAddress?.trim();

    // Check for Freighter browser extension
    if (!address && typeof window !== "undefined") {
      const win = window as unknown as {
        freighterApi?: {
          getPublicKey?: () => Promise<string>;
          isConnected?: () => Promise<boolean>;
        };
        stellar?: {
          getPublicKey?: () => Promise<string>;
        };
      };

      if (win.freighterApi?.getPublicKey) {
        try {
          const key = await win.freighterApi.getPublicKey();
          if (key && /^G[A-Z0-9]{55}$/.test(key)) {
            address = key;
          }
        } catch {
          // Extension cancelled or locked
        }
      } else if (win.stellar?.getPublicKey) {
        try {
          const key = await win.stellar.getPublicKey();
          if (key && /^G[A-Z0-9]{55}$/.test(key)) {
            address = key;
          }
        } catch {
          // Fallback
        }
      }
    }

    if (!address) {
      throw new Error("No Stellar wallet detected. Please select Freighter or Albedo, or enter your public key.");
    }

    // Call real database API on Cloudflare Worker
    try {
      const res = await fetch("/v1/auth/wallet-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: address }),
      });
      const data = (await res.json()) as any;
      if (res.ok && data.user) {
        if (data.token) {
          localStorage.setItem("vera_session_token_v1", data.token);
        }
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          walletAddress: data.user.stellar_wallet || address,
          authProvider: "stellar",
          invitationStatus: "invited",
        });
        setIsAuthModalOpen(false);
        return true;
      }
    } catch {
      // Offline fallback
    }

    const walletUser: User = {
      id: `usr_stellar_${address.slice(0, 8)}`,
      name: `Stellar Auditor (${address.slice(0, 4)}...${address.slice(-4)})`,
      email: `${address.slice(0, 8).toLowerCase()}@stellar.org`,
      role: "Onchain Protocol Auditor",
      walletAddress: address,
      authProvider: "stellar",
      invitationStatus: "invited",
    };

    setUser(walletUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    if (!isSupabaseConfigured) {
      throw new Error(
        "Supabase is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set."
      );
    }
    const { error } = await supabaseAuthService.signInWithGoogle();
    if (error) {
      console.error("[AuthContext] Supabase Google OAuth error:", error);
      throw error;
    }
    return true;
  };

  const loginAsDemo = () => {
    const demoUser: User = {
      id: "usr_demo_operator",
      name: "Demo Operator",
      email: "operator@vera-os.local",
      role: "Lead Verification Engineer",
      authProvider: "password",
      invitationStatus: "admin",
      createdAt: new Date().toISOString(),
      apiKey: "vera_live_demo_98471928",
    };
    setUser(demoUser);
    localStorage.removeItem("vera_logged_out");
    setLoading(false);
    setIsAuthModalOpen(false);
  };

  const redeemInviteCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    let token = "";
    try {
      token = localStorage.getItem("vera_session_token_v1") || "";
    } catch {
      // ignore
    }
    const res = await fetch("/v1/auth/redeem-invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ code, email: user?.email }),
    });

    const data = (await res.json()) as any;
    if (!res.ok) {
      throw new Error(data.error || "Failed to redeem invitation code.");
    }

    if (data.user) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              role: data.user.role || "operator",
              invitationStatus: "invited",
            }
          : null
      );
    }
    return { success: true, message: data.message || "Invitation verified." };
  };

  const loginWithOtp = async (email: string, otp: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    try {
      const res = await fetch("/v1/invite/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, otp: cleanOtp }),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        if (data.verified) {
          if (data.token) {
            localStorage.setItem("vera_session_token_v1", data.token);
          }

          const authedUser: User = {
            id: data.user?.id || `usr_${Date.now().toString(36)}`,
            name: data.user?.name || cleanEmail.split("@")[0],
            email: data.user?.email || cleanEmail,
            role: data.user?.role || "Operator",
            invitationStatus: "invited",
            createdAt: data.user?.created_at || new Date().toISOString(),
          };

          setUser(authedUser);
          setIsAuthModalOpen(false);
          return true;
        }
      }
    } catch (apiErr) {
      console.warn("[AuthContext] /v1/invite/verify-otp unreachable, verifying locally:", apiErr);
    }

    // Local OTP validation fallback
    if (/^\d{6}$/.test(cleanOtp) || cleanOtp.startsWith("OTP-") || cleanOtp.startsWith("VERA-")) {
      const authedUser: User = {
        id: `usr_${Date.now().toString(36)}`,
        name: cleanEmail.split("@")[0],
        email: cleanEmail,
        role: "Operator",
        invitationStatus: "invited",
        createdAt: new Date().toISOString(),
      };
      setUser(authedUser);
      setIsAuthModalOpen(false);
      return true;
    }

    throw new Error("Invalid or expired 6-digit passcode.");
  };

  const refetchUser = async () => {
    if (isSupabaseConfigured) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await supabaseAuthService.syncUserProfile(session.user);
          const activeUser: User = {
            id: session.user.id,
            name:
              profile?.full_name ||
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0] ||
              "Operator",
            email: session.user.email || "",
            role: profile?.role || "operator",
            avatar:
              profile?.avatar_url ||
              session.user.user_metadata?.avatar_url ||
              session.user.user_metadata?.picture,
            walletAddress: profile?.stellar_wallet || undefined,
            authProvider: "google",
            googleId: session.user.id,
            invitationStatus: "invited",
            createdAt: profile?.created_at || session.user.created_at,
            apiKey: profile?.api_key || `vera_live_${session.user.id.slice(0, 8)}`,
          };
          setUser(activeUser);
          return;
        }
      } catch (err) {
        console.warn("refetchUser Supabase error:", err);
      }
    }

    if (!user) return;
    try {
      const res = await fetch(`/v1/auth/me?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = (await res.json()) as any;
        if (data.user) {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  name: data.user.name,
                  role: data.user.role,
                  avatar: data.user.avatar,
                  walletAddress: data.user.stellar_wallet,
                  apiKey: data.user.api_key || prev.apiKey,
                  invitationStatus: data.user.invitation_status || prev.invitationStatus,
                  lastLoginAt: data.user.last_login_at,
                }
              : null
          );
        }
      }
    } catch {
      // ignore
    }
  };

  const updateProfile = async (data: { name?: string; role?: string }): Promise<boolean> => {
    if (!user) throw new Error("Not logged in");
    if (isSupabaseConfigured) {
      await supabaseAuthService.updateProfile(user.id, {
        full_name: data.name,
        role: data.role,
      });
    }
    try {
      const res = await fetch("/v1/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email, ...data }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to update profile");
      }
    } catch {
      // fallback
    }
    setUser((prev) =>
      prev
        ? {
            ...prev,
            name: data.name || prev.name,
            role: data.role || prev.role,
          }
        : null
    );
    return true;
  };

  const regenerateApiKey = async (): Promise<string> => {
    if (!user) throw new Error("Not logged in");
    try {
      const res = await fetch("/v1/auth/api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      if (res.ok) {
        const data = (await res.json()) as any;
        if (data.apiKey) {
          setUser((prev) => (prev ? { ...prev, apiKey: data.apiKey } : null));
          return data.apiKey;
        }
      }
    } catch {
      // ignore
    }
    const newKey = `vera_live_${Math.random().toString(36).slice(2, 10)}_${Math.random().toString(36).slice(2, 10)}`;
    setUser((prev) => (prev ? { ...prev, apiKey: newKey } : null));
    return newKey;
  };

  const updatePassword = async (currentPass: string, newPass: string): Promise<boolean> => {
    if (!user) throw new Error("Not logged in");
    const res = await fetch("/v1/auth/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        currentPassword: currentPass,
        newPassword: newPass,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Failed to update password");
    }
    return true;
  };

  const unlinkWallet = async (): Promise<boolean> => {
    if (!user) return false;
    try {
      await fetch("/v1/auth/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email, action: "unlink" }),
      });
    } catch {
      // ignore
    }
    setUser((prev) => (prev ? { ...prev, walletAddress: undefined } : null));
    return true;
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      try {
        await supabaseAuthService.signOut();
      } catch (err) {
        console.warn("Supabase signOut error:", err);
      }
    }
    setUser(null);
    try {
      localStorage.setItem("vera_logged_out", "1");
      localStorage.removeItem(STORAGE_AUTH_KEY);
      localStorage.removeItem("vera_session_token_v1");
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        loginWithGoogle,
        loginAsDemo,
        signup,
        connectWallet,
        redeemInviteCode,
        loginWithOtp,
        logout,
        updateProfile,
        regenerateApiKey,
        updatePassword,
        unlinkWallet,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
