import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

interface StellarWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnected?: (address: string) => void;
}

export const StellarWalletModal: React.FC<StellarWalletModalProps> = ({
  isOpen,
  onClose,
  onWalletConnected,
}) => {
  const { user, connectWallet } = useAuth();

  const [activeTab, setActiveTab] = useState<"freighter" | "albedo" | "manual">("freighter");
  const [manualKey, setManualKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateStellarAddress = (key: string): boolean => {
    return /^G[A-Z0-9]{55}$/.test(key.trim());
  };

  const handleConnectFreighter = async () => {
    setIsConnecting(true);
    setErrorMsg(null);
    try {
      const win = window as any;
      let pubKey: string | null = null;

      if (win.freighterApi?.getPublicKey) {
        pubKey = await win.freighterApi.getPublicKey();
      } else if (win.stellar?.getPublicKey) {
        pubKey = await win.stellar.getPublicKey();
      }

      if (pubKey && validateStellarAddress(pubKey)) {
        await connectWallet(pubKey);
        setSuccessMsg(`Connected: ${pubKey.slice(0, 6)}...${pubKey.slice(-6)}`);
        onWalletConnected?.(pubKey);
        setTimeout(onClose, 1200);
      } else {
        // Prompt for extension
        setErrorMsg("Freighter extension was not detected or was locked. Please ensure Freighter is installed or enter your public key manually.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Freighter connection failed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectAlbedo = async () => {
    setIsConnecting(true);
    setErrorMsg(null);
    try {
      // Albedo web intent
      const albedoUrl = `https://albedo.link/confirm?intent=public_key&callback=${encodeURIComponent(window.location.href)}`;
      const popup = window.open(albedoUrl, "albedo_login", "width=500,height=600");
      if (!popup) {
        setErrorMsg("Please allow popups to connect via Albedo.");
      } else {
        setSuccessMsg("Complete authentication in the Albedo popup window.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Albedo connection failed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const clean = manualKey.trim();

    if (!validateStellarAddress(clean)) {
      setErrorMsg("Invalid Stellar public key. Must start with 'G' and be exactly 56 characters.");
      return;
    }

    setIsConnecting(true);
    try {
      await connectWallet(clean);
      setSuccessMsg(`Wallet linked: ${clean.slice(0, 6)}...${clean.slice(-6)}`);
      onWalletConnected?.(clean);
      setTimeout(onClose, 1200);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to link Stellar wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-[#181311] border border-[#2A2320] shadow-2xl p-6 flex flex-col gap-5 z-10 text-left text-[#FFF8F0]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2A2320]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#26201D] border border-[#D97736]/30 flex items-center justify-center text-[#D97736]">
              <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white tracking-tight">
                Connect Stellar Wallet
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D7A46] animate-pulse" />
                <p className="text-xs text-[#9E948B]">Stellar Testnet & Soroban RPC</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#9E948B] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Current Linked Wallet if any */}
        {user?.walletAddress && (
          <div className="p-3.5 rounded-2xl bg-[#201A18] border border-[#352B27] flex items-center justify-between">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#9E948B]">Connected Address</span>
              <span className="font-mono text-xs text-[#D97736] truncate">
                {user.walletAddress}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1D7A46]/20 text-[#4ADE80] border border-[#1D7A46]/40 shrink-0">
              Active
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-[#201A18] border border-[#2A2320] text-xs font-heading font-medium">
          <button
            onClick={() => { setActiveTab("freighter"); setErrorMsg(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "freighter" ? "bg-[#D97736] text-white font-semibold shadow-sm" : "text-[#9E948B] hover:text-white"
            }`}
          >
            Freighter
          </button>
          <button
            onClick={() => { setActiveTab("albedo"); setErrorMsg(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "albedo" ? "bg-[#D97736] text-white font-semibold shadow-sm" : "text-[#9E948B] hover:text-white"
            }`}
          >
            Albedo
          </button>
          <button
            onClick={() => { setActiveTab("manual"); setErrorMsg(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "manual" ? "bg-[#D97736] text-white font-semibold shadow-sm" : "text-[#9E948B] hover:text-white"
            }`}
          >
            Stellar Key
          </button>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-red-400 shrink-0">error</span>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-400 shrink-0">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Freighter */}
        {activeTab === "freighter" && (
          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-2xl bg-[#201A18] border border-[#2A2320] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2D2421] border border-[#3D322E] flex items-center justify-center text-[#D97736] shrink-0 font-bold font-mono text-sm">
                F
              </div>
              <div className="text-xs text-[#9E948B] leading-relaxed">
                Connect directly via the official <strong className="text-white">Freighter Wallet Extension</strong> to authenticate transactions and anchor verifiable proofs.
              </div>
            </div>
            <button
              type="button"
              onClick={handleConnectFreighter}
              disabled={isConnecting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#D97736] hover:bg-[#C26527] disabled:opacity-50 text-white font-heading font-semibold text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Freighter...</span>
                </>
              ) : (
                <span>Authorize Freighter Extension</span>
              )}
            </button>
            <span className="text-[11px] text-center text-[#9E948B]">
              Don&apos;t have Freighter? <a href="https://www.freighter.app/" target="_blank" rel="noreferrer" className="text-[#D97736] hover:underline">Install extension ↗</a>
            </span>
          </div>
        )}

        {/* Tab 2: Albedo */}
        {activeTab === "albedo" && (
          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-2xl bg-[#201A18] border border-[#2A2320] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2D2421] border border-[#3D322E] flex items-center justify-center text-[#D97736] shrink-0 font-bold font-mono text-sm">
                A
              </div>
              <div className="text-xs text-[#9E948B] leading-relaxed">
                <strong className="text-white">Albedo</strong> enables secure Stellar web authentication in a popup window without requiring browser extensions.
              </div>
            </div>
            <button
              type="button"
              onClick={handleConnectAlbedo}
              disabled={isConnecting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#D97736] hover:bg-[#C26527] disabled:opacity-50 text-white font-heading font-semibold text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Waiting for Albedo...</span>
                </>
              ) : (
                <span>Launch Albedo Web Connector</span>
              )}
            </button>
          </div>
        )}

        {/* Tab 3: Manual Public Key */}
        {activeTab === "manual" && (
          <form onSubmit={handleConnectManual} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white">
                Stellar Public Address (Ed25519)
              </label>
              <input
                type="text"
                value={manualKey}
                onChange={(e) => setManualKey(e.target.value)}
                placeholder="G..."
                className="w-full p-2.5 rounded-xl bg-[#201A18] border border-[#352B27] font-mono text-xs text-white placeholder:text-[#6B635B] focus:outline-none focus:border-[#D97736]"
              />
              <span className="text-[10px] text-[#9E948B]">
                Enter any testnet or mainnet Stellar public key starting with &apos;G&apos;
              </span>
            </div>
            <button
              type="submit"
              disabled={isConnecting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#D97736] hover:bg-[#C26527] disabled:opacity-50 text-white font-heading font-semibold text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Address...</span>
                </>
              ) : (
                <span>Verify & Link Stellar Key</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
