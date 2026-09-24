import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GITHUB_REPO_URL, TELEGRAM_BOT_URL, TELEGRAM_BOT_HANDLE } from "../config/env";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = "bash", title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#2A2422] bg-[#181311] my-3">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2A2422] bg-[#140F0D]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97736]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          {title && <span className="font-mono text-xs text-[#A89F95] ml-2">{title}</span>}
        </div>
        <div className="flex items-center gap-2">
          {language && (
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#A89F95] px-1.5 py-0.5 rounded bg-white/5">
              {language}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] font-mono text-[#D97736] hover:text-[#FFA366] transition-colors cursor-pointer px-2 py-0.5 rounded bg-[#D97736]/10 hover:bg-[#D97736]/20"
          >
            <span className="material-symbols-outlined text-[14px]">
              {copied ? "check" : "content_copy"}
            </span>
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>
      <pre className="p-4 text-xs sm:text-sm font-mono text-[#F3E8DC] overflow-x-auto leading-relaxed whitespace-pre">
        {code}
      </pre>
    </div>
  );
};

export const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Interactive Playground State
  const [playgroundPreset, setPlaygroundPreset] = useState<"stellar" | "refund" | "dex">("stellar");

  const sections = [
    {
      group: "Foundations",
      items: [
        { id: "overview", label: "Overview & Architecture", icon: "verified" },
        { id: "quickstart", label: "5-Minute Quickstart", icon: "bolt" },
        { id: "architecture", label: "5-Stage Verification Machine", icon: "schema" },
      ],
    },
    {
      group: "Blockchain & Consensus",
      items: [
        { id: "stellar", label: "Stellar & Soroban Integration", icon: "toll" },
        { id: "invariants", label: "Deterministic Invariant Model", icon: "balance" },
      ],
    },
    {
      group: "Integrations & SDKs",
      items: [
        { id: "agents", label: "Agent Frameworks & SDKs", icon: "smart_toy" },
        { id: "telegram", label: "Telegram Bot Bridge", icon: "send" },
        { id: "api", label: "REST API Reference", icon: "code" },
      ],
    },
    {
      group: "Interactive & Evaluation",
      items: [
        { id: "playground", label: "Live API Playground", icon: "terminal" },
        { id: "standards", label: "Enterprise Security & Standards", icon: "verified_user" },
      ],
    },
  ];

  const allItems = sections.flatMap((g) => g.items);
  const currentIndex = allItems.findIndex((i) => i.id === activeSection);
  const prevDoc = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextDoc = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;
  const activeGroup = sections.find((g) => g.items.some((i) => i.id === activeSection));
  const activeItem = activeGroup?.items.find((i) => i.id === activeSection);

  const filteredSections = searchQuery.trim()
    ? sections
        .map((g) => ({
          ...g,
          items: g.items.filter(
            (i) =>
              i.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              i.id.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((g) => g.items.length > 0)
    : sections;

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 font-sans pb-20">
      {/* 1. Hero Documentation Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#181311] border border-[#2A2422] text-[#FFF8F0] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#D97736]/20 text-[#D97736] border border-[#D97736]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97736] animate-pulse" />
              <span>VeraOS v0.2.0 • Production Release</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span>Stellar Testnet Live</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <span>Telegram Bot Active</span>
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Vera<span className="text-[#D97736]">OS</span> Developer & Protocol Documentation
          </h1>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
            The independent verification layer for AI agents. Validate task completion, enforce cryptographic
            invariants, and audit Stellar Soroban transactions before work is trusted or settled.
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Landing Page</span>
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            <span>GitHub Repository</span>
            <span className="text-[10px]">↗</span>
          </a>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#2AABEE]/20 hover:bg-[#2AABEE]/30 border border-[#2AABEE]/40 text-xs font-semibold text-[#7DD4FF] transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            <span>{TELEGRAM_BOT_HANDLE}</span>
            <span className="text-[10px]">↗</span>
          </a>
          <Link
            to="/verify/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#D97736] hover:bg-[#B8621B] text-xs font-heading font-semibold text-white transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add_task</span>
            <span>Run Live Verification</span>
          </Link>
        </div>
      </div>

      {/* 2. Main Documentation Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Navigation Column (4 cols on lg) */}
        <aside className="lg:col-span-4 bg-white rounded-2xl border border-[#E8E4DC] p-5 shadow-sm sticky top-20 flex flex-col gap-5">
          {/* Doc Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9E948B] text-[16px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs text-[#191513] placeholder-[#9E948B] focus:outline-none focus:border-[#181311] transition-colors"
            />
          </div>

          {/* Navigation Groups */}
          <nav className="flex flex-col gap-4">
            {filteredSections.map((group) => (
              <div key={group.group} className="flex flex-col gap-1">
                <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#8C8479] px-2">
                  {group.group}
                </span>
                {group.items.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSection(sec.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                        isActive
                          ? "bg-[#181311] text-white font-semibold shadow-xs"
                          : "text-[#6B635B] hover:text-[#191513] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={`material-symbols-outlined text-[16px] ${isActive ? "text-[#D97736]" : "text-[#9E948B]"}`}>
                          {sec.icon}
                        </span>
                        <span className="truncate">{sec.label}</span>
                      </div>
                      {isActive && (
                        <span className="material-symbols-outlined text-[14px] text-[#D97736]">
                          chevron_right
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Docs Stats Banner */}
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-between text-xs font-mono text-[#6B635B]">
            <span>Version: 0.2.0</span>
            <span className="text-[#1D7A46] font-semibold">● Production Testnet</span>
          </div>
        </aside>

        {/* Right Content Area (8 cols on lg) */}
        <main className="lg:col-span-8 flex flex-col gap-6">
          {/* Document Header Breadcrumb & Quick Toolbar */}
          <div className="bg-white rounded-2xl border border-[#E8E4DC] px-5 py-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#6B635B] flex-wrap">
              <Link to="/docs" className="hover:text-[#191513] font-medium transition-colors">
                Docs
              </Link>
              <span>/</span>
              <span className="text-[#8C8479]">{activeGroup?.group || "Foundations"}</span>
              <span>/</span>
              <span className="text-[#191513] font-semibold">{activeItem?.label || "Overview"}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[#8C8479] font-mono text-[11px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                <span>~4 min read</span>
              </span>
              <span className="text-[#E8E4DC]">•</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShareCopied(true);
                  setTimeout(() => setShareCopied(false), 2000);
                }}
                className="text-[#D97736] hover:text-[#B8621B] font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {shareCopied ? "check" : "share"}
                </span>
                <span>{shareCopied ? "Link Copied" : "Share"}</span>
              </button>
            </div>
          </div>

          {/* SECTION: Overview & Protocol Architecture */}
          {activeSection === "overview" && (
            <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-9 shadow-sm flex flex-col gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D97736]">
                  Executive Summary & Protocol Overview
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#191513] tracking-tight mt-1">
                  Why Autonomous AI Needs VeraOS
                </h2>
                <p className="text-sm text-[#6B635B] mt-2 leading-relaxed">
                  Autonomous AI agents are shifting from passive chat assistants to autonomous economic actors executing
                  bounties, payments, smart contracts, and business workflows. But there is a fatal vulnerability in current
                  systems: <strong>blind trust of uncorroborated output</strong>.
                </p>
              </div>

              {/* The Problem vs Solution Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-[#DC2626] font-heading font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">warning</span>
                    <span>The Critical Flaw Today</span>
                  </div>
                  <p className="text-xs text-[#7F1D1D] leading-relaxed">
                    When an agent completes a task, host platforms simply accept the agent&apos;s generated text.
                    If an agent asserts: <em>&quot;Disbursed 5.00 USDC to user&quot;</em>, but actually transferred 0.50 USDC
                    or a fabricated hash, the host platform marks the task finished, leading to financial loss and protocol exploits.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#EAF5EE] border border-[#CDE5D5] flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-[#1D7A46] font-heading font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                    <span>The VeraOS Verification Layer</span>
                  </div>
                  <p className="text-xs text-[#14532D] leading-relaxed">
                    VeraOS intercepts agent claims before settlement. It extracts mathematical invariants from the original request,
                    queries authoritative on-chain RPC nodes (Stellar Horizon/Soroban), decodes raw ledger envelopes,
                    and computes deterministic mathematical verdicts.
                  </p>
                </div>
              </div>

              {/* Key Capabilities */}
              <div className="pt-4 border-t border-[#E8E4DC] flex flex-col gap-4">
                <h3 className="font-heading font-bold text-lg text-[#191513]">
                  Core Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-[#6B635B]">
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-1.5">
                    <span className="font-heading font-bold text-[#191513]">1. Deterministic Ground Truth</span>
                    <span>Zero LLM hallucinations in evaluation. Every check executes against public Stellar ledger RPC state.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-1.5">
                    <span className="font-heading font-bold text-[#191513]">2. Self-Healing Remediation Loop</span>
                    <span>When an invariant fails, Vera emits exact delta directives allowing the agent to remediate deficits automatically.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-1.5">
                    <span className="font-heading font-bold text-[#191513]">3. Multi-Channel Bridge</span>
                    <span>Integrates with Telegram bots, ElizaOS, REST webhooks, and Python/Node.js autonomous agent runtimes.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-1.5">
                    <span className="font-heading font-bold text-[#191513]">4. Immutable Evidence Trails</span>
                    <span>Produces cryptographic hashes, quorum attestation records, and direct Stellar Expert explorer receipts.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: 5-Minute Quickstart */}
          {activeSection === "quickstart" && (
            <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-9 shadow-sm flex flex-col gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D97736]">
                  Getting Started
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#191513] tracking-tight mt-1">
                  5-Minute Developer Quickstart
                </h2>
                <p className="text-sm text-[#6B635B] mt-2 leading-relaxed">
                  Start verifying autonomous agent claims in three simple steps.
                </p>
              </div>

              {/* Step 1 */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#181311] text-white flex items-center justify-center font-heading font-bold text-xs">
                    1
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#191513]">
                    Retrieve Your API Credentials
                  </h3>
                </div>
                <p className="text-xs text-[#6B635B] leading-relaxed">
                  Go to <Link to="/account" className="text-[#D97736] font-semibold underline">Account Settings</Link> to copy your operator API key. Include it as a Bearer token or <code className="font-mono bg-[#FAF8F5] px-1 py-0.5 rounded text-[#191513]">x-vera-key</code> header.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#181311] text-white flex items-center justify-center font-heading font-bold text-xs">
                    2
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#191513]">
                    Send Task Verification Request
                  </h3>
                </div>
                <p className="text-xs text-[#6B635B] leading-relaxed">
                  Whenever your AI agent finishes a task, dispatch the original prompt instruction alongside the agent&apos;s claimed output:
                </p>

                <CodeBlock
                  title="verification_dispatch.ts"
                  language="typescript"
                  code={`import { fetch } from "undici";

const response = await fetch("http://localhost:3000/v1/verify", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-vera-key": "vera_live_operator_key_here"
  },
  body: JSON.stringify({
    task: "Disburse 5.00 USDC compensation to payee address GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5.",
    worker: {
      id: "settlement-bot-v1",
      name: "Settlement Bot",
      output: "Payment processed. Sent 5.00 USDC. TxHash: 62256096f306726197208231b00e422628b0bb83e104dabed9a74da5186afbaf"
    }
  })
});

const result = await response.json();
console.log("Verdict:", result.status); // "PASSED" | "FAILED"
console.log("Evidence items:", result.attempts[0].evidence.length);`}
                />
              </div>

              {/* Step 3 */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#181311] text-white flex items-center justify-center font-heading font-bold text-xs">
                    3
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#191513]">
                    Handle Self-Healing Corrections
                  </h3>
                </div>
                <p className="text-xs text-[#6B635B] leading-relaxed">
                  If the verification fails (e.g. agent underpaid or hallucinated a receipt), VeraOS provides structured remediation directives with exact numbers:
                </p>

                <CodeBlock
                  title="remediation_handler.ts"
                  language="typescript"
                  code={`if (result.status === "FAILED") {
  const directive = result.attempts[0].remediationDirectives[0];
  console.warn("Discrepancy detected:", directive.reason);
  console.log("Required fix:", directive.action); // "EXECUTE_SUPPLEMENTAL_TRANSFER"
  console.log("Deficit amount:", directive.delta); // 4.5 USDC

  // Agent executes supplemental transfer and resubmits to Vera:
  // await fetch(\`/v1/verify/\${result.id}/resubmit\`, { ... });
}`}
                />
              </div>
            </div>
          )}

          {/* SECTION: 5-Stage Verification Machine */}
          {activeSection === "architecture" && (
            <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-9 shadow-sm flex flex-col gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D97736]">
                  Core Engine Architecture
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#191513] tracking-tight mt-1">
                  The 5-Stage Deterministic Pipeline
                </h2>
                <p className="text-sm text-[#6B635B] mt-2 leading-relaxed">
                  VeraOS does not use generic LLM prompting to grade work. It operates as an invariant state machine
                  decoupling worker assertions from verifiable physical consensus.
                </p>
              </div>

              {/* Visual Pipeline Flow */}
              <div className="p-5 rounded-2xl bg-[#181311] border border-[#2A2422] text-[#F3E8DC] font-mono text-xs overflow-x-auto">
                <div className="text-[#D97736] font-bold mb-2">// VeraOS Execution Flowchart</div>
                <div className="space-y-1 text-[#E0D8CE] whitespace-pre leading-relaxed">
{`[User Task Instruction] ──► Stage 1: Requirement Extractor ────► Declared Invariants (Amount, Asset, Recipient)
                                                                             │
[Worker Claim Output]  ──► Stage 2: Claim Hypothesis Extractor ──► Claim Hypotheses (TxHash, Recipient, Amount)
                                                                             │
[Stellar Horizon / RPC]──► Stage 3: Ground-Truth Engine        ──► Authoritative Ledger State (Decoded Envelope XDR)
                                                                             │
                                                           Stage 4: Mathematical Verdict Synthesizer
                                                                             │
                                                           ┌─────────────────┴─────────────────┐
                                                           ▼                                   ▼
                                                      [PASSED]                              [FAILED]
                                                    Audit Trail Verified               Stage 5: Remediation Directive
                                                                                               │
                                                                                       (Self-Correction Loop)`}
                </div>
              </div>

              {/* Stage Explanations */}
              <div className="flex flex-col divide-y divide-[#E8E4DC]">
                <div className="py-4 first:pt-0 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-[#FAF8F5] border border-[#E8E4DC] text-[#D97736]">
                      Stage 1
                    </span>
                    <h3 className="font-heading font-bold text-sm text-[#191513]">
                      Requirement Extractor
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B635B] leading-relaxed">
                    Transforms unconstrained natural language instructions into strict mathematical specifications: target asset (e.g. USDC, XLM), exact amounts, threshold limits, recipient public key (G-address), and acceptable slippage tolerances.
                  </p>
                </div>

                <div className="py-4 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-[#FAF8F5] border border-[#E8E4DC] text-[#D97736]">
                      Stage 2
                    </span>
                    <h3 className="font-heading font-bold text-sm text-[#191513]">
                      Claim Hypothesis Extractor
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B635B] leading-relaxed">
                    Parses the worker agent&apos;s output. In VeraOS, worker claims are explicitly categorized as <em>hypotheses to test</em>, never as ground truth.
                  </p>
                </div>

                <div className="py-4 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-[#FAF8F5] border border-[#E8E4DC] text-[#D97736]">
                      Stage 3
                    </span>
                    <h3 className="font-heading font-bold text-sm text-[#191513]">
                      Deterministic Ground-Truth Engine
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B635B] leading-relaxed">
                    Queries independent sources: Stellar Horizon RPC (<code className="font-mono text-[#191513]">https://horizon-testnet.stellar.org</code>), Soroban Smart Contract events, and immutable cryptographic receipts. Decodes Transaction Envelope XDR to inspect actual operations.
                  </p>
                </div>

                <div className="py-4 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-[#FAF8F5] border border-[#E8E4DC] text-[#D97736]">
                      Stage 4
                    </span>
                    <h3 className="font-heading font-bold text-sm text-[#191513]">
                      Mathematical Verdict Synthesizer
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B635B] leading-relaxed">
                    Evaluates invariants deterministically. For example, comparing <code className="font-mono text-[#191513]">observedAmount === requiredAmount</code>. Emits an immutable status (<code className="font-mono text-emerald-600">PASSED</code>, <code className="font-mono text-red-600">FAILED</code>, or <code className="font-mono text-amber-600">UNVERIFIED</code>) with exact numerical confidence.
                  </p>
                </div>

                <div className="py-4 last:pb-0 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-[#FAF8F5] border border-[#E8E4DC] text-[#D97736]">
                      Stage 5
                    </span>
                    <h3 className="font-heading font-bold text-sm text-[#191513]">
                      Remediation Directive Engine
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B635B] leading-relaxed">
                    When an invariant fails, computes the exact mathematical shortfall (e.g. <code className="font-mono text-red-600">-4.50 USDC</code>) and generates structured instruction directives so the autonomous agent can self-heal without manual human intervention.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: Stellar & Soroban Integration */}
          {activeSection === "stellar" && (
            <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-9 shadow-sm flex flex-col gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D97736]">
                  Onchain Infrastructure
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#191513] tracking-tight mt-1">
                  Stellar Horizon & Soroban Integration
                </h2>
                <p className="text-sm text-[#6B635B] mt-2 leading-relaxed">
                  Real, live Stellar blockchain artifacts validated on the public Testnet.
                </p>
              </div>

              {/* Live Testnet Explorer Showcase */}
              <div className="flex flex-col gap-4">
                <h3 className="font-heading font-bold text-base text-[#191513]">
                  Live Testnet Demonstration Transactions
                </h3>

                {/* Case 1: Deficit Exploit Flagged */}
                <div className="p-5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626] uppercase font-mono">
                      <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                      <span>Case 1: Deceptive Agent Deficit (Detected & Blocked)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-100 text-[#DC2626] font-semibold">
                      Claimed: 5.00 USDC • Actual: 0.50 USDC
                    </span>
                  </div>
                  <p className="text-xs text-[#7F1D1D] leading-relaxed">
                    The agent claimed it paid 5.00 USDC, but the actual transaction only sent 0.50 USDC. VeraOS caught the -$4.50 USDC discrepancy immediately:
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white border border-[#FECACA]">
                    <span className="font-mono text-xs text-[#191513] truncate">
                      tx: 108822f67b10e3ad38db576d60712939c1bdbe372c9d4729928d613605682759
                    </span>
                    <a
                      href="https://stellar.expert/explorer/testnet/tx/108822f67b10e3ad38db576d60712939c1bdbe372c9d4729928d613605682759"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#DC2626] hover:underline shrink-0"
                    >
                      <span>View on Stellar Expert</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>

                {/* Case 2: Full Remediation Confirmed */}
                <div className="p-5 rounded-2xl bg-[#EAF5EE] border border-[#CDE5D5] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1D7A46] uppercase font-mono">
                      <span className="w-2 h-2 rounded-full bg-[#1D7A46]" />
                      <span>Case 2: Remediated & Verified Transaction</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-100 text-[#1D7A46] font-semibold">
                      Full 5.00 USDC Satisfied
                    </span>
                  </div>
                  <p className="text-xs text-[#14532D] leading-relaxed">
                    Following Vera&apos;s remediation directive, the agent executed the supplemental transfer, resulting in full corroboration and settlement:
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white border border-[#CDE5D5]">
                    <span className="font-mono text-xs text-[#191513] truncate">
                      tx: 62256096f306726197208231b00e422628b0bb83e104dabed9a74da5186afbaf
                    </span>
                    <a
                      href="https://stellar.expert/explorer/testnet/tx/62256096f306726197208231b00e422628b0bb83e104dabed9a74da5186afbaf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D7A46] hover:underline shrink-0"
                    >
                      <span>View on Stellar Expert</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* How Vera Decodes Stellar XDR */}
              <div className="pt-2 flex flex-col gap-2">
                <h3 className="font-heading font-bold text-base text-[#191513]">
                  How VeraOS Decodes Stellar Envelopes
                </h3>
                <p className="text-xs text-[#6B635B] leading-relaxed">
                  Vera uses <code className="font-mono text-[#191513]">@stellar/stellar-sdk</code> to unpack envelope XDR payloads and verify operation integrity:
                </p>

                <CodeBlock
                  title="stellarRpcProvider.ts snippet"
                  language="typescript"
                  code={`import * as StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
const tx = await server.transactions().transaction(txHash).call();

// Decode Envelope XDR to inspect authentic ledger operations
const envelope = StellarSdk.xdr.TransactionEnvelope.fromXDR(tx.envelope_xdr, "base64");
const operations = tx.successful ? await tx.operations() : [];

// Check payment invariants
const paymentOp = operations.records.find((op) => op.type === "payment");
const verifiedAmount = parseFloat(paymentOp.amount);
const verifiedAsset = paymentOp.asset_code || "XLM";
const verifiedDestination = paymentOp.to;`}
                />
              </div>
            </div>
          )}

          {/* SECTION: Deterministic Invariant Model */}
          {activeSection === "invariants" && (
            <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-9 shadow-sm flex flex-col gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D97736]">
                  Verification Mathematics
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#191513] tracking-tight mt-1">
                  Deterministic Invariant Taxonomy
                </h2>
                <p className="text-sm text-[#6B635B] mt-2 leading-relaxed">
                  Every verification is evaluated against formal mathematical predicates. Invariant checks either pass with absolute mathematical proof or fail with exact deltas.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8E4DC] text-[#6B635B] font-mono uppercase text-[11px]">
                      <th className="py-3 px-3">Invariant Category</th>
                      <th className="py-3 px-3">Mathematical Predicate</th>
                      <th className="py-3 px-3">Example Domain</th>
                      <th className="py-3 px-3">Failure Directive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E4DC] text-[#191513]">
                    <tr>
                      <td className="py-3 px-3 font-semibold font-mono text-[#D97736]">Exact Asset Amount</td>
                      <td className="py-3 px-3 font-mono">observed == required</td>
                      <td className="py-3 px-3">Stellar USDC Transfer</td>
                      <td className="py-3 px-3 text-[#DC2626]">Supplemental payment directive</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold font-mono text-[#D97736]">Recipient Match</td>
                      <td className="py-3 px-3 font-mono">dest_key == expected_key</td>
                      <td className="py-3 px-3">Ed25519 G-Address</td>
                      <td className="py-3 px-3 text-[#DC2626]">Invalid destination rejection</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold font-mono text-[#D97736]">Slippage Tolerance</td>
                      <td className="py-3 px-3 font-mono">slippage &lt;= max_allowed</td>
                      <td className="py-3 px-3">Soroswap DEX Swap</td>
                      <td className="py-3 px-3 text-[#DC2626]">Parameter recalculation</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold font-mono text-[#D97736]">Non-Duplication</td>
                      <td className="py-3 px-3 font-mono">count(tx_receipt) == 1</td>
                      <td className="py-3 px-3">Payout Reconciler</td>
                      <td className="py-3 px-3 text-[#DC2626]">Double-spend flag</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold font-mono text-[#D97736]">Ledger Finality</td>
                      <td className="py-3 px-3 font-mono">tx.successful == true</td>
                      <td className="py-3 px-3">Horizon RPC Check</td>
                      <td className="py-3 px-3 text-[#DC2626]">Transaction resubmission</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: Agent Frameworks & SDKs */}
          {activeSection === "agents" && (
            <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-9 shadow-sm flex flex-col gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D97736]">
                  Developer SDKs & Frameworks
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#191513] tracking-tight mt-1">
                  Connect Any Autonomous Agent
                </h2>
                <p className="text-sm text-[#6B635B] mt-2 leading-relaxed">
                  VeraOS supports out-of-the-box integrations with ElizaOS, LangChain, CrewAI, AutoGen, and native Python / TypeScript async loops.
                </p>
              </div>

              {/* 1. ElizaOS Plugin */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#D97736]">smart_toy</span>
                  <h3 className="font-heading font-bold text-base text-[#191513]">
                    ElizaOS Agent Plugin
                  </h3>
                </div>
                <p className="text-xs text-[#6B635B]">
                  Wrap any ElizaOS agent action with automatic Vera verification:
                </p>

                <CodeBlock
                  title="eliza_agent_config.ts"
                  language="typescript"
                  code={`import { veraVerificationPlugin } from "@vera-os/plugin-eliza";

export const agentConfig = {
  name: "SettlementAgent",
  plugins: [
    veraVerificationPlugin({
      apiKey: process.env.VERA_API_KEY,
      endpoint: "http://localhost:3000/v1/verify",
      autoRemediate: true,
      channels: ["stellar", "api"]
    })
  ]
};`}
                />
              </div>

              {/* 2. Python Autonomous Worker */}
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-blue-500">code</span>
                  <h3 className="font-heading font-bold text-base text-[#191513]">
                    Python Autonomous Worker Loop
                  </h3>
                </div>
                <p className="text-xs text-[#6B635B]">
                  Dispatched using standard requests in Python:
                </p>

                <CodeBlock
                  title="agent_worker.py"
                  language="python"
                  code={`import requests

def submit_task_for_verification(task_prompt: str, agent_output: str, tx_hash: str = None):
    url = "http://localhost:3000/v1/verify"
    payload = {
        "task": task_prompt,
        "worker": {
            "id": "py-trader-01",
            "name": "Python Arbitrage Agent",
            "output": f"{agent_output} TxHash: {tx_hash}" if tx_hash else agent_output
        }
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=payload, headers=headers)
    verdict = response.json()
    
    if verdict.get("status") == "PASSED":
        print(f"Verified! Ledger confirmed.")
        return True
    else:
        print(f"Verification Failed! Invariants breached.")
        return False`}
                />
              </div>
            </div>
          )}

          {/* SECTION: Telegram Bot */}
          {activeSection === "telegram" && (
            <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-9 shadow-sm flex flex-col gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D97736]">
                  Telegram Bridge
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#191513] tracking-tight mt-1">
                  Official Telegram Bot: {TELEGRAM_BOT_HANDLE}
                </h2>
                <p className="text-sm text-[#6B635B] mt-2 leading-relaxed">
                  Connect Telegram customer support bots and conversational agents directly to VeraOS.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2AABEE]/15 text-[#2AABEE] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[22px]">send</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-[#191513]">
                      Launch Verified Bot
                    </h3>
                    <p className="text-xs text-[#6B635B]">
                      Open {TELEGRAM_BOT_HANDLE} to run inline checks or verify agent actions.
                    </p>
                  </div>
                </div>

                <a
                  href={TELEGRAM_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181311] hover:bg-[#2A2422] text-white text-xs font-heading font-semibold shadow-sm transition-all self-start sm:self-auto"
                >
                  <span>Open in Telegram</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>

              {/* Bot Command Table */}
              <div className="flex flex-col gap-3">
                <h3 className="font-heading font-bold text-base text-[#191513]">
                  Available Commands
                </h3>
                <div className="p-4 rounded-xl bg-[#181311] border border-[#2A2422] font-mono text-xs text-[#F3E8DC] space-y-2">
                  <div><span className="text-[#D97736]">/start</span> — Initialize operator session and get bot status</div>
                  <div><span className="text-[#D97736]">/verify</span> — Interactively initiate a new verification check</div>
                  <div><span className="text-[#D97736]">/status &lt;id&gt;</span> — Check real-time verdict and confidence score</div>
                  <div><span className="text-[#D97736]">/evidence &lt;id&gt;</span> — View onchain evidence & Stellar Expert explorer receipt</div>
                  <div><span className="text-[#D97736]">/correct &lt;id&gt;</span> — Review remediation directives and exact deltas</div>
                  <div><span className="text-[#D97736]">/resubmit &lt;id&gt;</span> — Resubmit supplemental proof or updated hash</div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: REST API Reference */}
          {activeSection === "api" && (
            <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-9 shadow-sm flex flex-col gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D97736]">
                  API Reference
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#191513] tracking-tight mt-1">
                  REST API Endpoints
                </h2>
                <p className="text-sm text-[#6B635B] mt-2 leading-relaxed">
                  Interact with VeraOS programmatically via JSON HTTP requests.
                </p>
              </div>

              {/* Endpoint 1: POST /v1/verify */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-[#1D7A46]">POST</span>
                  <span className="text-[#191513]">/v1/verify</span>
                  <span className="text-[#6B635B] font-normal">— Create verification run</span>
                </div>
                <p className="text-xs text-[#6B635B]">
                  Submits a task instruction and worker claim to the deterministic engine.
                </p>

                <CodeBlock
                  title="cURL"
                  language="bash"
                  code={`curl -X POST http://localhost:3000/v1/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "task": "Disburse 5.00 USDC to GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5.",
    "worker": {
      "id": "settlement-bot",
      "name": "Settlement Bot",
      "output": "Payment complete. Sent 5.00 USDC. TxHash: 62256096f306726197208231b00e422628b0bb83e104dabed9a74da5186afbaf"
    }
  }'`}
                />
              </div>

              {/* Endpoint 2: GET /v1/verify/:id */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-700">GET</span>
                  <span className="text-[#191513]">/v1/verify/:id</span>
                  <span className="text-[#6B635B] font-normal">— Fetch verification status</span>
                </div>
                <p className="text-xs text-[#6B635B]">
                  Returns the complete audit report, evaluated invariants, evidence items, and verdicts.
                </p>
              </div>

              {/* Endpoint 3: POST /v1/verify/:id/resubmit */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-[#1D7A46]">POST</span>
                  <span className="text-[#191513]">/v1/verify/:id/resubmit</span>
                  <span className="text-[#6B635B] font-normal">— Self-healing resubmission</span>
                </div>
                <p className="text-xs text-[#6B635B]">
                  Resubmits a supplemental proof or corrected worker output into the existing verification attempt chain.
                </p>
              </div>
            </div>
          )}

          {/* SECTION: Interactive API Playground */}
          {activeSection === "playground" && (
            <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-9 shadow-sm flex flex-col gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D97736]">
                  Interactive Testing Console
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#191513] tracking-tight mt-1">
                  Live API Request Playground
                </h2>
                <p className="text-sm text-[#6B635B] mt-2 leading-relaxed">
                  Select a test scenario to inspect request payloads and sample deterministic evaluation responses.
                </p>
              </div>

              {/* Preset Selector */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setPlaygroundPreset("stellar")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-medium transition-all cursor-pointer ${
                    playgroundPreset === "stellar"
                      ? "bg-[#181311] text-white font-semibold"
                      : "bg-[#FAF8F5] border border-[#E8E4DC] text-[#6B635B] hover:text-[#191513]"
                  }`}
                >
                  Stellar USDC Payment
                </button>
                <button
                  onClick={() => setPlaygroundPreset("refund")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-medium transition-all cursor-pointer ${
                    playgroundPreset === "refund"
                      ? "bg-[#181311] text-white font-semibold"
                      : "bg-[#FAF8F5] border border-[#E8E4DC] text-[#6B635B] hover:text-[#191513]"
                  }`}
                >
                  Customer Refund & Email
                </button>
                <button
                  onClick={() => setPlaygroundPreset("dex")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-medium transition-all cursor-pointer ${
                    playgroundPreset === "dex"
                      ? "bg-[#181311] text-white font-semibold"
                      : "bg-[#FAF8F5] border border-[#E8E4DC] text-[#6B635B] hover:text-[#191513]"
                  }`}
                >
                  Soroswap DEX Slippage
                </button>
              </div>

              {/* Code Playground View */}
              {playgroundPreset === "stellar" && (
                <div className="space-y-4">
                  <CodeBlock
                    title="Sample Request: POST /v1/verify"
                    language="json"
                    code={`{
  "task": "Disburse exactly 5.00 USDC compensation to payee address GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5.",
  "worker": {
    "id": "settlement-bot",
    "name": "Settlement Bot",
    "output": "Payment complete. Disbursed 5.00 USDC. TxHash: 62256096f306726197208231b00e422628b0bb83e104dabed9a74da5186afbaf"
  }
}`}
                  />

                  <CodeBlock
                    title="Sample Response (200 OK — VERIFIED)"
                    language="json"
                    code={`{
  "id": "vr_829e1fa0b",
  "displayId": "VR-1048",
  "status": "PASSED",
  "quorum": "Stellar Horizon Testnet Receipt + Deterministic Invariant Kernel",
  "latencyMs": 42,
  "attempts": [
    {
      "attemptNumber": 1,
      "status": "PASSED",
      "summary": "All verification invariants satisfied.",
      "invariants": [
        { "id": "inv_1", "name": "Payment Recipient Match", "status": "PASSED" },
        { "id": "inv_2", "name": "Disbursed Amount (5.00 USDC)", "status": "PASSED" },
        { "id": "inv_3", "name": "Stellar Ledger Finality (Horizon RPC)", "status": "PASSED" }
      ],
      "evidence": [
        {
          "id": "ev_stellar_01",
          "provider": "Stellar Horizon RPC",
          "status": "CONFIRMED",
          "data": {
            "txHash": "62256096f306726197208231b00e422628b0bb83e104dabed9a74da5186afbaf",
            "explorerUrl": "https://stellar.expert/explorer/testnet/tx/62256096f306726197208231b00e422628b0bb83e104dabed9a74da5186afbaf"
          }
        }
      ]
    }
  ]
}`}
                  />
                </div>
              )}

              {playgroundPreset === "refund" && (
                <div className="space-y-4">
                  <CodeBlock
                    title="Sample Request: Customer Refund Check"
                    language="json"
                    code={`{
  "task": "Process full refund of $240.00 for order #8812 due to damaged shipment and send receipt email.",
  "worker": {
    "id": "refund-bot",
    "name": "Refund Bot (Telegram)",
    "output": "Successfully refunded $240.00 to Visa ending in 4242 and sent receipt confirmation email."
  }
}`}
                  />
                </div>
              )}

              {playgroundPreset === "dex" && (
                <div className="space-y-4">
                  <CodeBlock
                    title="Sample Request: Soroswap Slippage Invariant"
                    language="json"
                    code={`{
  "task": "Swap 50 USDC for XLM on Soroswap with slippage <= 1% when XLM price < $0.12.",
  "worker": {
    "id": "dex-trader-01",
    "name": "Trading Bot Alpha",
    "output": "Swapped 50 USDC for 425 XLM on Soroswap at effective price $0.1176 (slippage 0.42%)."
  }
}`}
                  />
                </div>
              )}
            </div>
          )}

          {/* SECTION: Enterprise Security & Standards */}
          {activeSection === "standards" && (
            <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-9 shadow-sm flex flex-col gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D97736]">
                  Verification & Security Standards
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#191513] tracking-tight mt-1">
                  Enterprise Audit & Reliability Model
                </h2>
                <p className="text-sm text-[#6B635B] mt-2 leading-relaxed">
                  Security, integrity guarantees, and verification benchmarks for autonomous agent operations.
                </p>
              </div>

              {/* Benchmarks Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-2">
                  <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#191513]">
                    <span className="material-symbols-outlined text-[18px] text-[#D97736]">stars</span>
                    <span>1. Deterministic Verification</span>
                  </div>
                  <p className="text-xs text-[#6B635B] leading-relaxed">
                    Eliminates uncorroborated output risks in autonomous workflows. Bridges on-chain consensus with AI execution.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-2">
                  <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#191513]">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">link</span>
                    <span>2. Stellar Ledger Ground Truth</span>
                  </div>
                  <p className="text-xs text-[#6B635B] leading-relaxed">
                    Direct integration with Stellar Horizon RPC, Soroban smart contracts, Envelope XDR decoding, and immutable ledger finality.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-2">
                  <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#191513]">
                    <span className="material-symbols-outlined text-[18px] text-blue-600">sync_alt</span>
                    <span>3. Self-Healing Remediation</span>
                  </div>
                  <p className="text-xs text-[#6B635B] leading-relaxed">
                    Computes mathematical shortfalls and generates structured remediation directives so agents can correct deficits autonomously.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col gap-2">
                  <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#191513]">
                    <span className="material-symbols-outlined text-[18px] text-purple-600">devices</span>
                    <span>4. Production-Grade Reliability</span>
                  </div>
                  <p className="text-xs text-[#6B635B] leading-relaxed">
                    Enterprise dashboard, real-time Telegram bot bridge, authenticated operator access, and comprehensive developer documentation.
                  </p>
                </div>
              </div>

              {/* Live Testing Walkthrough */}
              <div className="p-5 rounded-2xl bg-[#181311] text-[#F3E8DC] border border-[#2A2422] flex flex-col gap-3">
                <span className="text-xs font-mono font-bold text-[#D97736] uppercase tracking-wider">
                  Live Verification Walkthrough
                </span>
                <ol className="list-decimal list-inside text-xs sm:text-sm space-y-2 leading-relaxed text-[#E0D8CE]">
                  <li>
                    Click <Link to="/verify/new" className="text-[#D97736] underline font-semibold">New Verification</Link> in the navigation.
                  </li>
                  <li>
                    Select or customize task parameters (or choose a test preset such as <strong>DeFi Settlement</strong>) to inspect the invariant pipeline.
                  </li>
                  <li>
                    Click <strong>Verify Result</strong> to observe the live deterministic evaluation, invariant checks, and ledger corroboration.
                  </li>
                  <li>
                    Inspect the resulting <Link to="/evidence" className="text-[#D97736] underline font-semibold">Evidence Details</Link> and verify the cryptographic proof receipt on the Stellar Expert explorer.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* Article Helpful Feedback Widget */}
          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-[#191513] font-semibold">
              <span className="material-symbols-outlined text-[18px] text-[#D97736]">thumb_up</span>
              <span>Was this documentation page helpful?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFeedback("yes")}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  feedback === "yes"
                    ? "bg-[#EAF5EE] border-[#CDE5D5] text-[#1D7A46]"
                    : "bg-white border-[#E8E4DC] text-[#6B635B] hover:text-[#191513] hover:bg-[#FAF8F5]"
                }`}
              >
                {feedback === "yes" ? "✓ Helpful" : "Yes"}
              </button>
              <button
                type="button"
                onClick={() => setFeedback("no")}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  feedback === "no"
                    ? "bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]"
                    : "bg-white border-[#E8E4DC] text-[#6B635B] hover:text-[#191513] hover:bg-[#FAF8F5]"
                }`}
              >
                {feedback === "no" ? "Thanks for feedback" : "Could improve"}
              </button>
            </div>
          </div>

          {/* Topic Pager (Previous / Next Section) */}
          <div className="pt-4 border-t border-[#E8E4DC] flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevDoc ? (
              <button
                type="button"
                onClick={() => {
                  setActiveSection(prevDoc.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E8E4DC] text-xs font-semibold text-[#181311] shadow-2xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Previous: {prevDoc.label}</span>
              </button>
            ) : (
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E8E4DC] text-xs font-semibold text-[#181311] shadow-2xs transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Back to Landing Page</span>
              </Link>
            )}

            {nextDoc ? (
              <button
                type="button"
                onClick={() => {
                  setActiveSection(nextDoc.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#181311] hover:bg-[#2A2422] text-xs font-semibold text-white shadow-sm transition-all cursor-pointer ml-auto"
              >
                <span>Next: {nextDoc.label}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            ) : (
              <Link
                to="/verify/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D97736] hover:bg-[#B8621B] text-xs font-semibold text-white shadow-sm transition-all ml-auto"
              >
                <span>Run Live Verification</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Docs;
