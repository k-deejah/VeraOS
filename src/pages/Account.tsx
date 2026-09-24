import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAgentContext } from "../context/AgentContext";
import { useVerificationsList } from "../hooks/useVerification";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";

export const Account: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    user,
    isAuthenticated,
    openAuthModal,
    updateProfile,
    regenerateApiKey,
    logout,
  } = useAuth();

  const { agents, testHandshake, disconnectAgent } = useAgentContext();
  const { verifications } = useVerificationsList();

  const [activeTab, setActiveTab] = useState<"profile" | "apikeys" | "agents" | "audit" | "danger">("profile");

  // Sync tab with URL
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (location.pathname === "/danger" || tabParam === "danger") {
      setActiveTab("danger");
    } else if (tabParam === "apikeys") {
      setActiveTab("apikeys");
    } else if (tabParam === "agents") {
      setActiveTab("agents");
    } else if (tabParam === "audit") {
      setActiveTab("audit");
    } else if (location.pathname === "/profile" || location.pathname === "/account") {
      if (!tabParam) setActiveTab("profile");
    }
  }, [location.pathname, searchParams]);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileRole, setProfileRole] = useState(user?.role || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // API Key State
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isRegenModalOpen, setIsRegenModalOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [apiKeyMsg, setApiKeyMsg] = useState<string | null>(null);

  // Agent Probe State
  const [probingAgentId, setProbingAgentId] = useState<string | null>(null);
  const [probeResults, setProbeResults] = useState<
    Record<string, { latencyMs: number; network: string; message: string }>
  >({});

  // Delete Account Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileRole(user.role);
    }
  }, [user]);

  const handleCopyKey = () => {
    if (!user?.apiKey) return;
    navigator.clipboard.writeText(user.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const ok = await updateProfile({ name: profileName, role: profileRole });
      if (ok) {
        setProfileMsg({ type: "success", text: "Profile details updated successfully." });
        setIsEditingProfile(false);
      } else {
        setProfileMsg({ type: "error", text: "Failed to update profile. Please try again." });
      }
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err?.message || "Error updating profile." });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleRegenerateKey = async () => {
    setIsRegenerating(true);
    setApiKeyMsg(null);
    try {
      const newKey = await regenerateApiKey();
      setIsRegenModalOpen(false);
      setShowApiKey(true);
      setApiKeyMsg(`New API key generated successfully (${newKey.slice(0, 14)}...). Old key has been revoked.`);
      setTimeout(() => setApiKeyMsg(null), 6000);
    } catch (err: any) {
      setApiKeyMsg("Failed to regenerate API key: " + (err?.message || "Unknown error"));
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleProbeAgent = async (agentId: string) => {
    setProbingAgentId(agentId);
    try {
      const res = await testHandshake(agentId);
      setProbeResults((prev) => ({
        ...prev,
        [agentId]: {
          latencyMs: res.latencyMs,
          network: res.network,
          message: res.message,
        },
      }));
    } catch (err: any) {
      setProbeResults((prev) => ({
        ...prev,
        [agentId]: {
          latencyMs: 0,
          network: "verification-rpc",
          message: "Probe failed: " + (err?.message || "Timeout"),
        },
      }));
    } finally {
      setProbingAgentId(null);
    }
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationText.trim().toLowerCase() !== "delete my account") return;
    logout();
    navigate("/");
  };

  const selectTab = (tab: "profile" | "apikeys" | "agents" | "audit" | "danger") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-6 py-12 px-4 font-sans">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FEF5EB] border border-[#FADCC4] flex items-center justify-center text-[#D97736]">
            <span className="material-symbols-outlined text-[36px]">manage_accounts</span>
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h2 className="font-heading text-xl sm:text-2xl text-[#191513] font-bold">
              Profile Access Required
            </h2>
            <p className="text-sm text-[#6B635B]">
              Sign in with your Google account to manage your profile, programmatic API keys, and connected agents.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-3 flex-wrap justify-center">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E8E4DC] text-[#191513] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Back to Landing Page</span>
            </Link>
            <Button
              variant="primary"
              size="md"
              onClick={() => openAuthModal("signin")}
              icon={<span className="material-symbols-outlined text-[18px]">login</span>}
            >
              Continue with Google
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col gap-6 font-sans pb-16">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#6B635B] flex-wrap">
        <Link to="/" className="hover:text-[#191513] transition-colors flex items-center gap-1 font-medium">
          <span className="material-symbols-outlined text-[14px]">home</span>
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link to="/dashboard" className="hover:text-[#191513] transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-[#191513] font-semibold">
          {activeTab === "danger" ? "Danger Zone" : "Profile & Operator Settings"}
        </span>
      </div>

      {/* Header Profile Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#E8E4DC] shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#181311] text-[#FFF8F0] flex items-center justify-center font-heading font-bold text-2xl shadow-xs">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#E8E4DC] shadow-xs flex items-center justify-center"
              title="Verified Google Account"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-[#191513] tracking-tight truncate">
                {user.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF5EE] text-[#1D7A46] border border-[#CDE5D5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D7A46] animate-pulse" />
                Google Authenticated
              </span>
            </div>

            <p className="font-mono text-xs text-[#6B635B] flex items-center gap-2 mt-1 truncate">
              <span className="truncate">{user.email}</span>
              <span className="text-[#D5CEC5]">•</span>
              <span className="text-[#D97736] font-medium">{user.role || "Operator"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsEditingProfile(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E8E4DC] text-[#191513] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E4DC] pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => selectTab("profile")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer",
            activeTab === "profile"
              ? "bg-[#181311] text-white shadow-xs"
              : "text-[#6B635B] hover:bg-white hover:text-[#191513] border border-transparent hover:border-[#E8E4DC]"
          )}
        >
          <span className="material-symbols-outlined text-[18px]">account_circle</span>
          <span>Google Profile</span>
        </button>

        <button
          type="button"
          onClick={() => selectTab("apikeys")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer",
            activeTab === "apikeys"
              ? "bg-[#181311] text-white shadow-xs"
              : "text-[#6B635B] hover:bg-white hover:text-[#191513] border border-transparent hover:border-[#E8E4DC]"
          )}
        >
          <span className="material-symbols-outlined text-[18px]">key</span>
          <span>API Keys &amp; CLI</span>
        </button>

        <button
          type="button"
          onClick={() => selectTab("agents")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer",
            activeTab === "agents"
              ? "bg-[#181311] text-white shadow-xs"
              : "text-[#6B635B] hover:bg-white hover:text-[#191513] border border-transparent hover:border-[#E8E4DC]"
          )}
        >
          <span className="material-symbols-outlined text-[18px]">smart_toy</span>
          <span>Connected Agents</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E8E4DC] font-mono text-[#191513]">
            {agents.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => selectTab("audit")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer",
            activeTab === "audit"
              ? "bg-[#181311] text-white shadow-xs"
              : "text-[#6B635B] hover:bg-white hover:text-[#191513] border border-transparent hover:border-[#E8E4DC]"
          )}
        >
          <span className="material-symbols-outlined text-[18px]">history</span>
          <span>Audit Log</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E8E4DC] font-mono text-[#191513]">
            {verifications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => selectTab("danger")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ml-auto",
            activeTab === "danger"
              ? "bg-[#DC2626] text-white shadow-xs"
              : "text-[#DC2626] hover:bg-[#FEF2F2] border border-transparent hover:border-[#FECACA]"
          )}
        >
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>Danger Zone</span>
        </button>
      </div>

      {/* Global Alerts */}
      {apiKeyMsg && (
        <div className="p-3.5 rounded-2xl bg-[#EAF5EE] border border-[#CDE5D5] text-[#1D7A46] font-mono text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{apiKeyMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: GOOGLE PROFILE DETAILS */}
      {/* ========================================================================= */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3.5">
                <div className="flex items-center gap-2 text-[#191513] font-bold text-base">
                  <span className="material-symbols-outlined text-[#D97736] text-[22px]">badge</span>
                  <span>Google Account Profile</span>
                </div>
                <span className="text-[11px] font-mono text-[#1D7A46] bg-[#EAF5EE] px-2 py-0.5 rounded-md border border-[#CDE5D5]">
                  OAuth 2.0 Active
                </span>
              </div>

              {profileMsg && (
                <div
                  className={cn(
                    "p-3 rounded-xl text-xs font-mono flex items-center gap-2",
                    profileMsg.type === "success"
                      ? "bg-[#EAF5EE] border border-[#CDE5D5] text-[#1D7A46]"
                      : "bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]"
                  )}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {profileMsg.type === "success" ? "check_circle" : "error"}
                  </span>
                  <span>{profileMsg.text}</span>
                </div>
              )}

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#191513]">Display Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                      className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-[#191513] text-sm focus:outline-none focus:border-[#181311]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#191513]">Role / Title</label>
                    <input
                      type="text"
                      value={profileRole}
                      onChange={(e) => setProfileRole(e.target.value)}
                      required
                      className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-[#191513] text-sm focus:outline-none focus:border-[#181311]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      loading={profileSaving}
                    >
                      Save Profile
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-[#6B635B] uppercase tracking-wider">
                      Operator Name
                    </span>
                    <span className="font-heading font-bold text-sm text-[#191513]">
                      {user.name}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-[#6B635B] uppercase tracking-wider">
                      Google Email
                    </span>
                    <span className="font-mono text-sm text-[#191513] truncate">
                      {user.email}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-[#6B635B] uppercase tracking-wider">
                      Assigned Role
                    </span>
                    <span className="text-sm font-semibold text-[#191513]">
                      {user.role || "Lead AI Verification Engineer"}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-[#6B635B] uppercase tracking-wider">
                      Authentication Provider
                    </span>
                    <span className="text-sm font-semibold text-[#1D7A46] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1D7A46]" />
                      Google Workspace OAuth
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col">
                <span className="text-[11px] font-semibold text-[#6B635B] uppercase tracking-wider">
                  Verified Tasks
                </span>
                <span className="font-heading font-extrabold text-2xl text-[#191513] mt-1">
                  {verifications.length}
                </span>
                <span className="text-[11px] text-[#1D7A46] font-mono mt-1">100% Attested</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col">
                <span className="text-[11px] font-semibold text-[#6B635B] uppercase tracking-wider">
                  Active Agents
                </span>
                <span className="font-heading font-extrabold text-2xl text-[#191513] mt-1">
                  {agents.length}
                </span>
                <span className="text-[11px] text-[#6B635B] font-mono mt-1">Ready</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col">
                <span className="text-[11px] font-semibold text-[#6B635B] uppercase tracking-wider">
                  Security Level
                </span>
                <span className="font-heading font-extrabold text-2xl text-[#191513] mt-1">
                  Enterprise
                </span>
                <span className="text-[11px] text-[#D97736] font-mono mt-1">Deterministic</span>
              </div>
            </div>
          </div>

          {/* Right Column: Google Security & Session Info */}
          <div className="flex flex-col gap-5">
            <div className="p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#191513] font-bold text-sm">
                <span className="material-symbols-outlined text-[#D97736] text-[20px]">security</span>
                <span>Session &amp; Security</span>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E4DC]">
                  <span className="text-[#6B635B]">Status:</span>
                  <span className="font-mono text-[#1D7A46] font-semibold">Authenticated</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E4DC]">
                  <span className="text-[#6B635B]">Session Token:</span>
                  <span className="font-mono text-[#191513]">Active (JWT)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E4DC]">
                  <span className="text-[#6B635B]">Consensus Quorum:</span>
                  <span className="font-mono text-[#191513]">Stellar Protocol 21</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B635B]">Telegram Bot:</span>
                  <span className="font-mono text-[#1D7A46]">Connected</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/docs"
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E8E4DC] text-xs font-semibold text-[#191513] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  <span>View Documentation</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: API KEYS & PROGRAMMATIC CLI ACCESS */}
      {/* ========================================================================= */}
      {activeTab === "apikeys" && (
        <div className="flex flex-col gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#191513]">
                  Operator Programmatic Key
                </h3>
                <p className="text-xs text-[#6B635B] mt-0.5">
                  Use this secret token to authenticate requests from your Python or TypeScript AI agents.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRegenModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E8E4DC] text-xs font-semibold text-[#191513] shadow-2xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span>Roll Key</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto font-mono text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1D7A46]" />
                <span className="text-[#191513] font-semibold tracking-wide">
                  {showApiKey ? user.apiKey || "vera_live_79a24f0c9182be34" : "••••••••••••••••••••••••••••••••••••••••"}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E8E4DC] text-xs text-[#191513] font-medium transition-colors cursor-pointer"
                >
                  {showApiKey ? "Hide" : "Reveal"}
                </button>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3 py-1.5 rounded-xl bg-[#181311] hover:bg-[#2A2422] text-xs text-white font-medium transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedKey ? "check" : "content_copy"}
                  </span>
                  <span>{copiedKey ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* SDK Code Snippet */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-semibold text-[#191513]">Quickstart with Python SDK</span>
              <pre className="p-4 rounded-2xl bg-[#181311] text-[#FFF8F0] font-mono text-xs leading-relaxed overflow-x-auto border border-[#2A2422]">
{`from vera import VeraClient

client = VeraClient(api_key="${user.apiKey || 'vera_live_79a24f0c9182be34'}")
verdict = client.verify_task(
    agent_id="agent_alpha",
    task="Process refund $240",
    claimed_output="Refund successful to card ending 4242",
    evidence=["refund_receipt.json"]
)
print("Verdict:", verdict.status)`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CONNECTED AGENTS */}
      {/* ========================================================================= */}
      {activeTab === "agents" && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#191513]">Registered Agents</h3>
              <p className="text-xs text-[#6B635B]">
                Active AI agents authorized to submit execution claims to your VeraOS workspace.
              </p>
            </div>
            <Link
              to="/connect-agent"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181311] hover:bg-[#2A2422] text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Connect New Agent</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((ag) => (
              <div
                key={ag.id}
                className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF5EB] border border-[#FADCC4] text-[#D97736] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#191513]">{ag.name}</h4>
                      <p className="font-mono text-[11px] text-[#6B635B]">{ag.endpoint || "agent://local"}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5EE] text-[#1D7A46] border border-[#CDE5D5]">
                    {ag.status || "CONNECTED"}
                  </span>
                </div>

                {probeResults[ag.id] && (
                  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs font-mono text-[#191513]">
                    {probeResults[ag.id].message} ({probeResults[ag.id].latencyMs}ms)
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#E8E4DC] text-xs">
                  <button
                    type="button"
                    onClick={() => handleProbeAgent(ag.id)}
                    disabled={probingAgentId === ag.id}
                    className="text-[#D97736] font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">sensors</span>
                    <span>{probingAgentId === ag.id ? "Probing..." : "Test Handshake"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => disconnectAgent(ag.id)}
                    className="text-[#DC2626] font-medium hover:underline cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AUDIT LOG */}
      {/* ========================================================================= */}
      {activeTab === "audit" && (
        <div className="p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#191513]">Cryptographic Audit Log</h3>
              <p className="text-xs text-[#6B635B]">
                Immutable record of tasks verified deterministically through your workspace.
              </p>
            </div>
            <Link
              to="/verifications"
              className="text-xs font-semibold text-[#181311] hover:underline"
            >
              View All Runs &rarr;
            </Link>
          </div>

          <div className="divide-y divide-[#E8E4DC]">
            {verifications.slice(0, 6).map((v) => (
              <div key={v.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 truncate">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full shrink-0",
                      v.status === "PASSED"
                        ? "bg-[#1D7A46]"
                        : v.status === "FAILED"
                        ? "bg-[#DC2626]"
                        : "bg-[#D97736]"
                    )}
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-[#191513] truncate">
                      {v.taskPrompt}
                    </p>
                    <p className="font-mono text-[10px] text-[#6B635B]">
                      Run VR-{v.displayId || v.id.slice(-6).toUpperCase()} • {v.workerName || "Autonomous Worker"}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/verify/${v.id}`}
                  className="text-xs font-semibold text-[#181311] hover:text-[#D97736] shrink-0"
                >
                  Inspect &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DANGER ZONE */}
      {/* ========================================================================= */}
      {activeTab === "danger" && (
        <div className="flex flex-col gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#FECACA] shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#FEE2E2] pb-4">
              <div className="flex items-center gap-2.5 text-[#DC2626] font-bold text-lg">
                <span className="material-symbols-outlined text-[26px]">warning</span>
                <span>Danger Zone &amp; Destructive Operations</span>
              </div>
              <span className="text-[11px] font-mono text-[#DC2626] bg-[#FEF2F2] px-2.5 py-0.5 rounded-full border border-[#FECACA]">
                Requires Authorization
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed">
              These actions directly affect your authentication sessions, cryptographic keys, and connected agent authorizations. Be certain before triggering these operations.
            </p>

            <div className="space-y-4">
              {/* Action 1: Sign out */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#191513]">
                    Terminate Active Browser Session
                  </h4>
                  <p className="text-xs text-[#6B635B] mt-0.5">
                    Clear local credentials and sign out from this browser session immediately.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E8E4DC] text-xs font-semibold text-[#191513] shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Sign Out
                </button>
              </div>

              {/* Action 2: Revoke API Keys */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#191513]">
                    Revoke All API Keys
                  </h4>
                  <p className="text-xs text-[#6B635B] mt-0.5">
                    Immediately revoke existing programmatic verification tokens. Agents will cease execution until re-authorized.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRegenModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E8E4DC] text-xs font-semibold text-[#D97736] shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Revoke &amp; Roll
                </button>
              </div>

              {/* Action 3: Delete Account */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#DC2626]">
                    Delete VeraOS Account &amp; Wipe Data
                  </h4>
                  <p className="text-xs text-[#6B635B] mt-0.5">
                    Permanently delete your profile, telemetry traces, and cryptographic authorizations. This action is irreversible.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Pager Footer */}
      <div className="pt-6 border-t border-[#E8E4DC] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#6B635B]">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="hover:text-[#191513] transition-colors"
          >
            ← Back to Overview
          </Link>
          <span>•</span>
          <Link
            to="/verifications"
            className="hover:text-[#191513] transition-colors"
          >
            Verification runs
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/docs"
            className="hover:text-[#191513] transition-colors"
          >
            Developer Documentation
          </Link>
          <span>•</span>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-[#191513] hover:underline font-semibold"
          >
            <span className="material-symbols-outlined text-[14px]">home</span>
            <span>Landing page</span>
          </Link>
        </div>
      </div>

      {/* Regenerate Key Confirmation Modal */}
      {isRegenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-2xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF5EB] border border-[#FADCC4] flex items-center justify-center text-[#D97736]">
              <span className="material-symbols-outlined text-[28px]">refresh</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-lg font-bold text-[#191513]">
                Roll API Key?
              </h3>
              <p className="text-xs text-[#6B635B] leading-relaxed">
                Regenerating will immediately revoke your existing key. Any autonomous agents or SDK scripts using the old key will fail until updated.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRegenModalOpen(false)}
                disabled={isRegenerating}
                className="px-4 py-2 rounded-xl bg-white border border-[#E8E4DC] text-xs font-semibold text-[#191513] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRegenerateKey}
                disabled={isRegenerating}
                className="px-4 py-2 rounded-xl bg-[#181311] hover:bg-[#2A2422] text-xs font-semibold text-white shadow-2xs"
              >
                {isRegenerating ? "Regenerating..." : "Yes, Roll Key"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-[#FECACA] shadow-2xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#DC2626]">
              <span className="material-symbols-outlined text-[28px]">delete_forever</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-lg font-bold text-[#DC2626]">
                Delete VeraOS Account
              </h3>
              <p className="text-xs text-[#6B635B] leading-relaxed">
                Type <strong className="text-[#DC2626] font-mono">delete my account</strong> to confirm deletion. All data will be permanently wiped.
              </p>
            </div>
            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="delete my account"
              className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-[#191513] font-mono text-xs focus:outline-none focus:border-[#DC2626]"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E8E4DC] text-xs font-semibold text-[#191513] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmationText.trim().toLowerCase() !== "delete my account"}
                className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-xs font-semibold text-white shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Account as Profile };
export default Account;
