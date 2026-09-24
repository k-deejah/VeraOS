import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { StellarWalletModal } from "../wallet/StellarWalletModal";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  const { user, logout, unlinkWallet } = useAuth();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState<"testnet" | "mainnet" | "futurenet">("testnet");

  const networkRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (networkRef.current && !networkRef.current.contains(e.target as Node)) {
        setNetworkMenuOpen(false);
      }
      if (walletRef.current && !walletRef.current.contains(e.target as Node)) {
        setWalletMenuOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Derive friendly page title
  const getPageTitle = () => {
    const p = location.pathname;
    if (p === "/dashboard") return "Overview";
    if (p === "/verifications") return "Verification runs";
    if (p.startsWith("/verify/new")) return "Check completed work";
    if (p.startsWith("/verify/processing")) return "Verification Processing";
    if (p.startsWith("/verify/")) return "Verification Detail";
    if (p.startsWith("/agents")) return "My agents";
    if (p === "/evidence") return "Evidence library";
    if (p === "/account") return "Account Settings";
    if (p === "/docs") return "Documentation";
    return "VeraOS";
  };

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <header className="h-16 bg-[#F7F5F0] border-b border-[#E8E4DC] px-4 sm:px-8 flex items-center justify-between z-30 sticky top-0 font-sans">
        {/* Left: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#E8E4DC] text-[#6B635B] hover:text-[#191513] cursor-pointer"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
          )}

          {/* Mobile brand (shown only on small screens) */}
          <Link to="/dashboard" className="lg:hidden flex items-center gap-2 mr-2">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97736]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#181311]" />
            </div>
            <span className="font-heading font-bold text-base text-[#191513]">
              Vera<span className="text-[#D97736]">OS</span>
            </span>
          </Link>

          {/* Desktop Title */}
          <div className="hidden sm:flex items-center gap-2.5">
            <span className="font-heading font-semibold text-base text-[#191513]">
              {getPageTitle()}
            </span>
          </div>
        </div>

        {/* Right Controls: Web3 Network, Wallet, Explorer & Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1. Web3 Network Selector Dropdown */}
          <div className="relative" ref={networkRef}>
            <button
              type="button"
              onClick={() => setNetworkMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E4DC] hover:border-[#181311] text-[#191513] text-xs font-heading font-medium transition-all cursor-pointer shadow-2xs"
              title="Stellar Network Status"
            >
              <span className="w-2 h-2 rounded-full bg-[#1D7A46] animate-pulse" />
              <span className="hidden md:inline font-mono">
                {activeNetwork === "testnet" ? "Stellar Testnet" : activeNetwork === "mainnet" ? "Stellar Mainnet" : "Soroban Futurenet"}
              </span>
              <span className="md:hidden font-mono">Testnet</span>
              <span className="material-symbols-outlined text-[16px] text-[#6B635B]">expand_more</span>
            </button>

            {networkMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#E8E4DC] shadow-xl p-3 z-50 flex flex-col gap-2 text-xs">
                <div className="pb-2 border-b border-[#E8E4DC]">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-[#191513]">Network & Consensus</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EAF5EE] text-[#1D7A46] border border-[#CDE5D5]">
                      Protocol 21
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B635B] mt-0.5">
                    Stellar Horizon & Soroban RPC consensus
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNetwork("testnet");
                      setNetworkMenuOpen(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      activeNetwork === "testnet" ? "bg-[#FAF8F5] border border-[#E8E4DC]" : "hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[#191513] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1D7A46]" />
                        <span>Stellar Testnet</span>
                      </div>
                      <div className="font-mono text-[10px] text-[#6B635B]">
                        horizon-testnet.stellar.org
                      </div>
                    </div>
                    {activeNetwork === "testnet" && (
                      <span className="material-symbols-outlined text-[16px] text-[#D97736]">check</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveNetwork("mainnet");
                      setNetworkMenuOpen(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      activeNetwork === "mainnet" ? "bg-[#FAF8F5] border border-[#E8E4DC]" : "hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[#191513] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Stellar Mainnet</span>
                      </div>
                      <div className="font-mono text-[10px] text-[#6B635B]">
                        horizon.stellar.org (Read-Only)
                      </div>
                    </div>
                    {activeNetwork === "mainnet" && (
                      <span className="material-symbols-outlined text-[16px] text-[#D97736]">check</span>
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-[#E8E4DC] flex items-center justify-between text-[11px] text-[#6B635B]">
                  <span>Latency: ~24ms</span>
                  <a
                    href="https://stellar.expert/explorer/testnet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D97736] hover:underline flex items-center gap-0.5"
                  >
                    <span>Explorer</span>
                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 2. Web3 Stellar Wallet Pill */}
          <div className="relative" ref={walletRef}>
            {user?.walletAddress ? (
              <button
                type="button"
                onClick={() => setWalletMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181311] hover:bg-[#2A2422] text-white text-xs font-mono font-medium transition-all cursor-pointer shadow-sm"
                title="Stellar Wallet Account"
              >
                <span className="material-symbols-outlined text-[14px] text-[#D97736]">
                  token
                </span>
                <span>
                  {user.walletAddress.slice(0, 4)}...{user.walletAddress.slice(-4)}
                </span>
                <span className="material-symbols-outlined text-[14px] text-[#9E948B]">
                  expand_more
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setWalletModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#181311] hover:bg-[#2A2422] text-white text-xs font-heading font-semibold transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[15px] text-[#D97736]">
                  account_balance_wallet
                </span>
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Wallet</span>
              </button>
            )}

            {/* Wallet Popover when connected */}
            {walletMenuOpen && user?.walletAddress && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#E8E4DC] shadow-xl p-3 z-50 flex flex-col gap-2 text-xs">
                <div className="pb-2 border-b border-[#E8E4DC]">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#6B635B]">
                    Connected Wallet
                  </span>
                  <div className="font-mono text-xs font-semibold text-[#191513] break-all mt-1 bg-[#FAF8F5] p-2 rounded-xl border border-[#E8E4DC]">
                    {user.walletAddress}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopyAddress(user.walletAddress!)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#191513] hover:bg-[#FAF8F5] transition-colors cursor-pointer text-left w-full"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#6B635B]">
                      {copied ? "check" : "content_copy"}
                    </span>
                    <span>{copied ? "Copied to clipboard!" : "Copy Public Key"}</span>
                  </button>

                  <a
                    href={`https://stellar.expert/explorer/testnet/account/${user.walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#191513] hover:bg-[#FAF8F5] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#6B635B]">
                      open_in_new
                    </span>
                    <span>View on Stellar Expert</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setWalletMenuOpen(false);
                      setWalletModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#191513] hover:bg-[#FAF8F5] transition-colors cursor-pointer text-left w-full"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#6B635B]">
                      swap_horiz
                    </span>
                    <span>Switch Wallet</span>
                  </button>

                  <div className="border-t border-[#E8E4DC] my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setWalletMenuOpen(false);
                      unlinkWallet();
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left w-full"
                  >
                    <span className="material-symbols-outlined text-[16px]">link_off</span>
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. User Account Avatar Menu */}
          <div className="relative" ref={accountRef}>
            <button
              type="button"
              onClick={() => setAccountMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 rounded-full bg-white hover:bg-[#F3EFEA] border border-[#E8E4DC] transition-colors cursor-pointer shadow-2xs"
              title="User Profile"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "Operator"}
                  className="w-8 h-8 rounded-full object-cover border border-[#E8E4DC]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#181311] text-[#F7F5F0] flex items-center justify-center font-heading font-medium text-xs">
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((p) => p[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : user?.email
                    ? user.email.slice(0, 2).toUpperCase()
                    : "OP"}
                </div>
              )}
              <span className="sr-only">Toggle user menu</span>
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E8E4DC] shadow-lg p-2 z-50 flex flex-col gap-1 text-xs">
                <div className="px-3 py-2 border-b border-[#E8E4DC] mb-1">
                  <p className="font-heading font-semibold text-[#191513] truncate">
                    {user?.name || "Operator"}
                  </p>
                  <p className="font-mono text-[10px] text-[#6B635B] truncate">
                    {user?.email || ""}
                  </p>
                </div>

                <Link
                  to="/account"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#191513] hover:bg-[#F7F5F0] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#6B635B]">
                    manage_accounts
                  </span>
                  <span>Account Settings</span>
                </Link>

                <Link
                  to="/docs"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#191513] hover:bg-[#F7F5F0] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#6B635B]">
                    description
                  </span>
                  <span>Documentation</span>
                </Link>

                <div className="border-t border-[#E8E4DC] my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left w-full"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Stellar Wallet Modal Trigger */}
      <StellarWalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </>
  );
};

