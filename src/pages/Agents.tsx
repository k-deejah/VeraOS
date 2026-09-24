import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAgentContext } from "../context/AgentContext";
import { Agent } from "../types/agent";

interface AgentItem {
  id: string;
  name: string;
  channel: "Telegram" | "API" | "Webhook";
  role: string;
  status: "Healthy" | "Review settings" | "Paused";
  verifiedCount: number;
  passRate: string;
  endpoint: string;
  lastActive: string;
}

function getAgentChannel(ag: Agent): "Telegram" | "API" | "Webhook" {
  const ep = (ag.endpoint || "").toLowerCase();
  const rt = (ag.runtime || "").toLowerCase();
  if (ep.includes("t.me") || rt.includes("telegram")) return "Telegram";
  if (
    rt.includes("webhook") ||
    ep.includes("webhook") ||
    ep.includes("event") ||
    ep.includes("disburse")
  ) {
    return "Webhook";
  }
  return "API";
}

function getAgentStatusLabel(ag: Agent): "Healthy" | "Review settings" | "Paused" {
  if (ag.status === "CONNECTED") return "Healthy";
  if (ag.status === "IDLE") return "Review settings";
  return "Paused";
}

export const Agents: React.FC = () => {
  const navigate = useNavigate();
  const { agents, loading } = useAgentContext();
  const [filterChannel, setFilterChannel] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const connectedCount = agents.filter((a) => a.status === "CONNECTED").length;
  const totalVerifiedTasks = agents.reduce((acc, a) => acc + (a.totalVerifications || 0), 0);
  const avgPassRate =
    agents.length > 0
      ? (
          agents.reduce((acc, a) => acc + (a.passRate ?? 100), 0) / agents.length
        ).toFixed(1) + "%"
      : "100%";
  const flaggedDiscrepancies = agents.reduce((acc, a) => {
    const failed = Math.round((a.totalVerifications || 0) * (1 - (a.passRate ?? 100) / 100));
    return acc + Math.max(0, failed);
  }, 0);

  const mappedAgents: AgentItem[] = agents.map((ag) => {
    const channel = getAgentChannel(ag);
    return {
      id: ag.id,
      name: ag.name,
      channel,
      role: `${channel} • ${ag.runtime || ag.model || "Autonomous Loop"}`,
      status: getAgentStatusLabel(ag),
      verifiedCount: ag.totalVerifications || 0,
      passRate: typeof ag.passRate === "number" ? `${ag.passRate.toFixed(1)}%` : "100%",
      endpoint: ag.endpoint || "agent://local",
      lastActive: ag.lastActive || "Recently",
    };
  });

  const filteredAgents = mappedAgents.filter((ag) => {
    const matchesFilter = filterChannel === "All" || ag.channel === filterChannel;
    const matchesSearch =
      ag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ag.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ag.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col gap-6 font-sans">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#191513]">
            My agents
          </h1>
          <p className="text-xs sm:text-sm text-[#6B635B] mt-1">
            Manage connected AI workers, review verification rates, and monitor channel health.
          </p>
        </div>

        <Link
          to="/connect-agent"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181311] hover:bg-[#2A2422] text-white font-heading font-semibold text-xs sm:text-sm shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Connect agent</span>
        </Link>
      </div>

      {/* 2. Four Horizontal Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Connected agents */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm">
          <p className="text-xs font-semibold text-[#6B635B] uppercase tracking-wider">
            Connected agents
          </p>
          <p className="font-heading font-extrabold text-3xl sm:text-4xl text-[#191513] mt-2">
            {connectedCount}
          </p>
          <span className="inline-block mt-2 font-mono text-[11px] text-[#1D7A46]">
            {agents.length} registered
          </span>
        </div>

        {/* Metric 2: Tasks verified */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm">
          <p className="text-xs font-semibold text-[#6B635B] uppercase tracking-wider">
            Tasks verified
          </p>
          <p className="font-heading font-extrabold text-3xl sm:text-4xl text-[#191513] mt-2">
            {totalVerifiedTasks}
          </p>
          <span className="inline-block mt-2 font-mono text-[11px] text-[#6B635B]">
            Across all channels
          </span>
        </div>

        {/* Metric 3: Pass rate */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm">
          <p className="text-xs font-semibold text-[#6B635B] uppercase tracking-wider">
            Pass rate
          </p>
          <p className="font-heading font-extrabold text-3xl sm:text-4xl text-[#191513] mt-2">
            {avgPassRate}
          </p>
          <span className="inline-block mt-2 font-mono text-[11px] text-[#1D7A46]">
            Audited average
          </span>
        </div>

        {/* Metric 4: Flagged discrepancies */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm">
          <p className="text-xs font-semibold text-[#6B635B] uppercase tracking-wider">
            Flagged discrepancies
          </p>
          <p className="font-heading font-extrabold text-3xl sm:text-4xl text-[#B8621B] mt-2">
            {flaggedDiscrepancies}
          </p>
          <span className="inline-block mt-2 font-mono text-[11px] text-[#B8621B]">
            Require review
          </span>
        </div>
      </div>

      {/* 3. Main Connected Agents Card / Table */}
      <div className="rounded-2xl bg-white border border-[#E8E4DC] shadow-sm overflow-hidden">
        {/* Card Filter & Search Bar */}
        <div className="p-5 border-b border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-base text-[#191513]">
              Connected agents
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] text-[#6B635B]">
              {filteredAgents.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs font-medium">
              {["All", "Telegram", "API", "Webhook"].map((channel) => (
                <button
                  key={channel}
                  type="button"
                  onClick={() => setFilterChannel(channel)}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterChannel === channel
                      ? "bg-white text-[#191513] font-semibold shadow-2xs"
                      : "text-[#6B635B] hover:text-[#191513]"
                  }`}
                >
                  {channel}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#9E948B] text-[16px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter agents..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs text-[#191513] placeholder-[#9E948B] focus:outline-none focus:border-[#181311]"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-[#6B635B]">
            <span className="w-8 h-8 border-2 border-[#181311] border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs">Loading agents...</span>
          </div>
        ) : agents.length === 0 ? (
          <div className="p-12 sm:p-20 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF5EB] border border-[#FADCC4] flex items-center justify-center text-[#D97736]">
              <span className="material-symbols-outlined text-[24px]">smart_toy</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-[#191513]">
                No agents connected yet
              </h3>
              <p className="text-xs sm:text-sm text-[#6B635B] max-w-sm mt-1.5 leading-relaxed">
                Connect your AI agent via Telegram, REST API, or Webhook to start verifying output integrity against independent proofs.
              </p>
            </div>
            <Link
              to="/connect-agent"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#181311] hover:bg-[#2A2422] text-white text-xs font-heading font-semibold shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Connect an agent</span>
            </Link>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6B635B]">
            No agents match your filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-[#E8E4DC]">
            {filteredAgents.map((ag) => (
              <div
                key={ag.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5]/80 transition-colors"
              >
                {/* Left: Avatar & Identity */}
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F3EFEA] border border-[#E8E4DC] text-[#191513] flex items-center justify-center font-heading font-bold text-sm shrink-0">
                    {ag.channel === "Telegram" ? (
                      <span className="material-symbols-outlined text-[20px] text-[#2AABEE]">
                        send
                      </span>
                    ) : ag.channel === "API" ? (
                      <span className="material-symbols-outlined text-[20px] text-[#D97736]">
                        api
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[20px] text-[#6B635B]">
                        webhook
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-sm text-[#191513]">
                        {ag.name}
                      </h3>
                      {ag.status === "Healthy" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF5EE] border border-[#CDE5D5] text-[#1D7A46] font-medium text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1D7A46]" />
                          <span>Healthy</span>
                        </span>
                      )}
                      {ag.status === "Review settings" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF5EB] border border-[#FADCC4] text-[#B8621B] font-medium text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B8621B]" />
                          <span>Review settings</span>
                        </span>
                      )}
                      {ag.status === "Paused" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F3EFEA] border border-[#E8E4DC] text-[#6B635B] font-medium text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6B635B]" />
                          <span>Paused</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#6B635B] mt-0.5 font-sans">
                      {ag.role}
                    </p>
                  </div>
                </div>

                {/* Right: Stats & Actions */}
                <div className="flex items-center gap-6 sm:self-center self-end">
                  <div className="text-right hidden md:block">
                    <p className="font-heading font-semibold text-xs text-[#191513]">
                      {ag.verifiedCount} verified
                    </p>
                    <p className="font-mono text-[11px] text-[#1D7A46]">
                      {ag.passRate} pass rate
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/verifications"
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E4DC] hover:border-[#181311] text-xs font-semibold text-[#191513] transition-colors"
                    >
                      View runs
                    </Link>
                    <button
                      type="button"
                      onClick={() => navigate("/connect-agent")}
                      className="p-1.5 rounded-xl text-[#6B635B] hover:text-[#191513] hover:bg-white border border-transparent hover:border-[#E8E4DC] transition-colors cursor-pointer"
                      title="Agent Settings"
                    >
                      <span className="material-symbols-outlined text-[18px]">settings</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Agents;
