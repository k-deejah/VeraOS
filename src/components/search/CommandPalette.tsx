import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useVerificationsList } from "../../hooks/useVerification";
import { useAgentContext } from "../../context/AgentContext";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  category: "Actions" | "Verifications" | "Agents" | "Evidence";
  title: string;
  subtitle: string;
  path: string;
  badge?: string;
}

const STATIC_ACTIONS: SearchItem[] = [
  {
    id: "action-new-verify",
    category: "Actions",
    title: "New Verification Check",
    subtitle: "Submit agent output and claims for independent verification",
    path: "/verify/new",
  },
  {
    id: "action-dashboard",
    category: "Actions",
    title: "Overview Dashboard",
    subtitle: "High-level metrics, verification runs and audit feed",
    path: "/dashboard",
  },
  {
    id: "action-agents",
    category: "Actions",
    title: "My Agents",
    subtitle: "Manage connected agents, channels and health status",
    path: "/agents",
  },
  {
    id: "action-connect-agent",
    category: "Actions",
    title: "Connect Agent",
    subtitle: "Add a new Telegram, REST API, or Webhook worker",
    path: "/connect-agent",
  },
  {
    id: "action-verifications",
    category: "Actions",
    title: "Verification Runs",
    subtitle: "Audit log of all evaluated tasks and cryptographic proofs",
    path: "/verifications",
  },
  {
    id: "action-evidence",
    category: "Actions",
    title: "Evidence Library",
    subtitle: "Inspect consensus receipts and invariant evaluation traces",
    path: "/evidence",
  },
  {
    id: "action-account",
    category: "Actions",
    title: "Account & API Keys",
    subtitle: "Manage operator profile, API keys and cryptographic credentials",
    path: "/account",
  },
  {
    id: "action-docs",
    category: "Actions",
    title: "Documentation",
    subtitle: "Architecture, invariant engine and integration guides",
    path: "/docs",
  },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { verifications } = useVerificationsList();
  const { agents } = useAgentContext();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const searchItems: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [...STATIC_ACTIONS];

    // Real verifications
    verifications.forEach((v) => {
      items.push({
        id: `v-${v.id}`,
        category: "Verifications",
        title: `Verification #${v.displayId} — ${v.workerName || "Agent"}`,
        subtitle: v.taskPrompt.slice(0, 80) + (v.taskPrompt.length > 80 ? "..." : ""),
        path: `/verify/${v.id}`,
        badge: v.status,
      });

      items.push({
        id: `ev-${v.id}`,
        category: "Evidence",
        title: `Evidence #${v.displayId} — ${v.workerName || "Agent"}`,
        subtitle: `Cryptographic trail for ${v.workerName || "Agent"} verification`,
        path: `/verify/${v.id}/evidence`,
      });
    });

    // Real agents
    agents.forEach((ag) => {
      items.push({
        id: `agent-${ag.id}`,
        category: "Agents",
        title: `${ag.name} (${ag.runtime || "Worker"})`,
        subtitle: `${ag.status} · ${ag.totalVerifications || 0} verifications · ${ag.endpoint || "agent://local"}`,
        path: "/agents",
        badge: ag.status,
      });
    });

    return items;
  }, [verifications, agents]);

  if (!isOpen) return null;

  const filtered = searchItems.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleSelect = (item: SearchItem) => {
    navigate(item.path);
    onClose();
  };

  const categories = Array.from(new Set(filtered.map((item) => item.category)));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl rounded-2xl bg-[#1F1B18] border border-white/10 shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150 font-sans">
        {/* Search Input Bar */}
        <div className="p-3.5 bg-[#2A2422] border-b border-white/5 flex items-center gap-3">
          <span className="material-symbols-outlined text-[#D97736] text-[22px]">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verifications, agents, telemetry traces, pages..."
            className="w-full bg-transparent text-sm text-[#F3E8DC] placeholder-[#9E948B] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#9E948B] hover:text-[#F3E8DC] text-xs px-1.5 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
          <span className="px-1.5 py-0.5 rounded bg-[#181311] font-mono text-[11px] text-[#9E948B] border border-white/5">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#9E948B] text-xs">
              No matching records found for &quot;{query}&quot;
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat} className="flex flex-col gap-1">
                <span className="px-2 font-mono text-[11px] text-[#9E948B] uppercase font-semibold">
                  {cat}
                </span>
                {filtered
                  .filter((item) => item.category === cat)
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="p-2.5 rounded-xl text-left hover:bg-[#2A2422] transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-[#F3E8DC] group-hover:text-[#D97736] transition-colors truncate">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-[#9E948B] truncate">
                          {item.subtitle}
                        </span>
                      </div>
                      {item.badge && (
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold shrink-0 ${
                            item.badge === "PASSED" || item.badge === "CONNECTED"
                              ? "bg-[#22c55e]/20 text-[#4ade80]"
                              : item.badge === "FAILED" || item.badge === "NOT_CONNECTED"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-white/10 text-[#9E948B]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-[#181311] border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#9E948B]">
          <div className="flex items-center gap-2">
            <span>Navigate: <kbd className="px-1 py-0.5 rounded bg-[#2A2422] text-[#F3E8DC]">↵</kbd></span>
            <span>Close: <kbd className="px-1 py-0.5 rounded bg-[#2A2422] text-[#F3E8DC]">ESC</kbd></span>
          </div>
          <span>VeraOS Global Search</span>
        </div>
      </div>
    </div>
  );
};
