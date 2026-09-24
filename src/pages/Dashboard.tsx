import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVerificationsList } from "../hooks/useVerification";
import { useAuth } from "../context/AuthContext";
import { StellarWalletModal } from "../components/wallet/StellarWalletModal";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false);

  const { verifications, loading, refetch } = useVerificationsList(
    statusFilter,
    searchQuery
  );

  const totalCount = verifications.length;
  const passedCount = verifications.filter((v) => v.status === "PASSED").length;
  const failedCount = verifications.filter((v) => v.status === "FAILED").length;
  const unverifiableCount = verifications.filter((v) => v.status === "UNVERIFIED").length;

  const filterTabs = [
    { label: "All", value: "ALL" },
    { label: "Verified", value: "PASSED" },
    { label: "Failed", value: "FAILED" },
    { label: "Unverifiable", value: "UNVERIFIED" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#1D7A46] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B635B]">
              Stellar Testnet • Soroban Protocol 21
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#191513]">
            Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#6B635B] mt-0.5">
            Monitor autonomous AI agent execution & verify cryptographic proofs on-chain.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E8E4DC] hover:border-[#D5CEC5] text-[#191513] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#6B635B]">refresh</span>
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/verify/new")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181311] hover:bg-[#2A2422] text-white text-xs font-heading font-semibold shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Verification</span>
          </button>
        </div>
      </div>

      {/* Web3 Protocol & On-Chain Network Telemetry */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-3 rounded-2xl bg-white border border-[#E8E4DC] shadow-2xs">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#F0ECE1]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1D7A46] animate-pulse shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B635B]">
              Network
            </span>
            <span className="font-mono text-xs font-bold text-[#191513] truncate">
              Stellar Testnet
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#F0ECE1]">
          <span className="material-symbols-outlined text-[18px] text-[#D97736] shrink-0">
            lan
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B635B]">
              Horizon RPC
            </span>
            <span className="font-mono text-xs font-bold text-[#1D7A46] truncate flex items-center gap-1">
              <span>Operational</span>
              <span className="text-[10px] text-[#6B635B] font-normal">(24ms)</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#F0ECE1]">
          <span className="material-symbols-outlined text-[18px] text-[#D97736] shrink-0">
            layers
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B635B]">
              Consensus Ledger
            </span>
            <span className="font-mono text-xs font-bold text-[#191513] truncate">
              #54,892,104
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#F0ECE1]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[18px] text-[#D97736] shrink-0">
              account_balance_wallet
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B635B]">
                Stellar Wallet
              </span>
              <span className="font-mono text-xs font-bold text-[#191513] truncate">
                {user?.walletAddress
                  ? `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}`
                  : "Not Connected"}
              </span>
            </div>
          </div>
          {!user?.walletAddress ? (
            <button
              type="button"
              onClick={() => setWalletModalOpen(true)}
              className="text-[11px] font-heading font-semibold px-2.5 py-1 rounded-lg bg-[#181311] text-white hover:bg-[#2A2422] transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              Connect
            </button>
          ) : (
            <a
              href={`https://stellar.expert/explorer/testnet/account/${user.walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9E948B] hover:text-[#D97736] p-1 shrink-0"
              title="View on Stellar Expert"
            >
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          )}
        </div>
      </div>

      {/* High-level status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col justify-between">
          <span className="font-mono text-xs uppercase text-[#6B635B]">
            Total Verifications
          </span>
          <span className="font-heading text-2xl sm:text-3xl font-bold text-[#191513] mt-1">
            {totalCount}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#EAF5EE] border border-[#CDE5D5] shadow-sm flex flex-col justify-between">
          <span className="font-mono text-xs uppercase text-[#1D7A46]">
            Verified (Pass)
          </span>
          <span className="font-heading text-2xl sm:text-3xl font-bold text-[#1D7A46] mt-1">
            {passedCount}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] shadow-sm flex flex-col justify-between">
          <span className="font-mono text-xs uppercase text-[#DC2626]">
            Failed Checks
          </span>
          <span className="font-heading text-2xl sm:text-3xl font-bold text-[#DC2626] mt-1">
            {failedCount}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FEF5EB] border border-[#FADCC4] shadow-sm flex flex-col justify-between">
          <span className="font-mono text-xs uppercase text-[#B8621B]">
            Unverifiable
          </span>
          <span className="font-heading text-2xl sm:text-3xl font-bold text-[#B8621B] mt-1">
            {unverifiableCount}
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === tab.value
                  ? "bg-[#181311] text-white font-semibold"
                  : "text-[#6B635B] hover:text-[#191513] hover:bg-[#FAF8F5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9E948B] text-[16px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks or agents..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs text-[#191513] placeholder-[#9E948B] focus:outline-none focus:border-[#181311]"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-16 rounded-2xl bg-white border border-[#E8E4DC] flex flex-col items-center justify-center gap-3 text-[#6B635B]">
          <span className="w-8 h-8 border-2 border-[#181311] border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs">Loading verifications...</span>
        </div>
      ) : verifications.length === 0 ? (
        /* Empty State */
        <div className="p-12 sm:p-20 rounded-2xl bg-white border border-[#E8E4DC] flex flex-col items-center justify-center text-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF5EB] border border-[#FADCC4] flex items-center justify-center text-[#D97736]">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-[#191513]">
              No verifications yet
            </h3>
            <p className="text-xs sm:text-sm text-[#6B635B] max-w-sm mt-1.5 leading-relaxed">
              Create your first verification to check whether an AI agent actually completed its task.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/verify/new")}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#181311] hover:bg-[#2A2422] text-white text-xs font-heading font-semibold shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Verification</span>
          </button>
        </div>
      ) : (
        /* Real Verifications Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {verifications.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/verify/${item.id}`)}
              className="p-5 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#181311] transition-all flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-md"
            >
              <div>
                {/* Top Row: Display ID & Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-[#D97736]">
                    #{item.displayId}
                  </span>

                  {item.status === "PASSED" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF5EE] border border-[#CDE5D5] text-[#1D7A46] font-medium text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1D7A46]" />
                      <span>VERIFIED</span>
                    </span>
                  )}
                  {item.status === "FAILED" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] font-medium text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                      <span>FAILED</span>
                    </span>
                  )}
                  {item.status === "UNVERIFIED" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF5EB] border border-[#FADCC4] text-[#B8621B] font-medium text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B8621B]" />
                      <span>UNVERIFIABLE</span>
                    </span>
                  )}
                  {item.status === "RUNNING" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-medium text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                      <span>RUNNING</span>
                    </span>
                  )}
                </div>

                {/* Worker Agent */}
                <div className="flex items-center gap-2 mb-2 text-xs text-[#6B635B]">
                  <span className="material-symbols-outlined text-[16px] text-[#6B635B]">
                    smart_toy
                  </span>
                  <span className="font-heading font-semibold text-[#191513] truncate">
                    {item.workerName || item.workerId}
                  </span>
                </div>

                {/* Task Prompt Snippet */}
                <p className="text-xs text-[#6B635B] line-clamp-3 leading-relaxed mb-4">
                  {item.taskPrompt}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#E8E4DC] flex items-center justify-between text-xs text-[#6B635B]">
                <span className="font-mono text-[11px]">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-heading font-medium text-[#181311] group-hover:text-[#D97736] transition-colors">
                  <span>Inspect</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stellar Wallet Modal Trigger */}
      <StellarWalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </div>
  );
};
