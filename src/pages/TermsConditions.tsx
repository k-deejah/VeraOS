import React from "react";
import { Link } from "react-router-dom";
import { GITHUB_REPO_URL } from "../config/env";

export const TermsConditions: React.FC = () => {
  const tableOfContents = [
    { id: "acceptance", label: "01. Acceptance & Scope of Agreement" },
    { id: "verification", label: "02. Deterministic Verification & Invariant Proofs" },
    { id: "stellar", label: "03. Stellar Network & Soroban Contracts" },
    { id: "delegation", label: "04. Autonomous Agent Delegation & Telemetry" },
    { id: "access", label: "05. Gated Access, Telegram Bot & Invite Tokens" },
    { id: "verdicts", label: "06. Verification Outcomes: PASS, FAIL & Discrepancies" },
    { id: "prohibited", label: "07. Prohibited Exploits & Invariant Tampering" },
    { id: "ip", label: "08. Intellectual Property & Proof Rights" },
    { id: "disclaimer", label: "09. Disclaimer of Warranties & Financial Advisory" },
    { id: "liability", label: "10. Limitation of Liability & Termination" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#191513] flex flex-col font-sans selection:bg-[#D97736]/20 selection:text-[#181311]">
      {/* Top Sticky Navigation Header */}
      <header className="h-16 border-b border-[#E8E4DC] bg-white/90 backdrop-blur-md sticky top-0 z-30 px-6 sm:px-10 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97736]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#181311]" />
            </div>
            <span className="font-heading font-extrabold text-lg tracking-tight text-[#191513]">
              Vera<span className="text-[#D97736]">OS</span>
            </span>
          </Link>
          <span className="hidden sm:inline-flex text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#6B635B] border border-[#E8E4DC]">
            Terms of Service • v0.2.0
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold">
          <Link to="/" className="text-[#6B635B] hover:text-[#191513] transition-colors">
            Home
          </Link>
          <Link
            to="/privacy"
            className="text-[#6B635B] hover:text-[#191513] transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/docs"
            className="hidden sm:inline-block text-[#6B635B] hover:text-[#191513] transition-colors"
          >
            Docs
          </Link>
          <Link
            to="/get-started"
            className="px-3.5 py-1.5 rounded-xl bg-[#181311] hover:bg-[#2A2422] text-white transition-all shadow-2xs"
          >
            Launch App
          </Link>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Table of Contents (Desktop) */}
        <aside className="hidden lg:block lg:col-span-4 bg-white rounded-2xl border border-[#E8E4DC] p-5 shadow-sm sticky top-22">
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#E8E4DC]">
            <span className="material-symbols-outlined text-[#D97736] text-[18px]">toc</span>
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#191513]">
              Table of Contents
            </span>
          </div>

          <nav className="flex flex-col gap-1 text-xs">
            {tableOfContents.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-2.5 py-1.5 rounded-lg text-[#6B635B] hover:text-[#191513] hover:bg-[#FAF8F5] transition-colors text-left font-medium truncate"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-6 pt-4 border-t border-[#E8E4DC] text-[11px] font-mono text-[#8C8479] flex flex-col gap-1">
            <span>Last Updated: September 2026</span>
            <span className="text-[#1D7A46]">Deterministic Verification Protocol</span>
          </div>
        </aside>

        {/* Legal Text Document (8 cols on lg) */}
        <main className="lg:col-span-8 bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-10 shadow-sm flex flex-col gap-8">
          {/* Header Section */}
          <div className="space-y-3 border-b border-[#E8E4DC] pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF5EB] border border-[#FADCC4] text-[#D97736] text-xs font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97736] animate-pulse" />
              <span>Master Protocol Agreement</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#191513]">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs sm:text-sm text-[#6B635B]">
              Effective Date: <strong className="text-[#191513]">September 20, 2026</strong> • Version 0.2.0
            </p>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs text-[#6B635B] leading-relaxed">
              Please review these Terms &amp; Conditions carefully before deploying AI agents or validating execution payloads on <strong>VeraOS</strong>. By accessing our platform, connecting an agent, or authenticating via Google OAuth, you agree to be legally bound by these terms.
            </div>
          </div>

          {/* Key Feature Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#191513] mb-1">
                <span className="material-symbols-outlined text-[18px] text-[#D97736]">verified_user</span>
                <span>Deterministic</span>
              </div>
              <p className="text-[11px] text-[#6B635B] leading-relaxed">
                Verification audits execution payloads against verifiable onchain invariants and consensus rules.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#191513] mb-1">
                <span className="material-symbols-outlined text-[18px] text-[#D97736]">vpn_key</span>
                <span>Gated Auth</span>
              </div>
              <p className="text-[11px] text-[#6B635B] leading-relaxed">
                Agent interaction requires valid API keys and cryptographic handshake validation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#191513] mb-1">
                <span className="material-symbols-outlined text-[18px] text-[#D97736]">balance</span>
                <span>No Advisory</span>
              </div>
              <p className="text-[11px] text-[#6B635B] leading-relaxed">
                Attestations certify deterministic computational state, not financial or investment advice.
              </p>
            </div>
          </div>

          {/* Sections Body */}
          <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-[#4A433D]">
            {/* Section 01 */}
            <section id="acceptance" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">01.</span>
                <span>Acceptance &amp; Scope of Agreement</span>
              </h2>
              <p>
                These Terms govern your use of VeraOS services, APIs, SDKs, smart contracts, and interfaces. By creating a workspace, registering an agent, or connecting via Google OAuth, you confirm that you are at least 18 years old and have the authority to bind yourself or your organization to this agreement.
              </p>
            </section>

            {/* Section 02 */}
            <section id="verification" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">02.</span>
                <span>Deterministic Verification &amp; Invariant Proofs</span>
              </h2>
              <p>
                VeraOS performs multi-stage deterministic verification of autonomous task execution claims. Verification involves five distinct pipeline stages: Task &amp; Claim Parsing, Invariant Formulation, Multi-Source Evidence Gathering, Consensus Evaluation, and Cryptographic Attestation Generation. The platform does not guarantee outcomes of external systems outside verifiable boundaries.
              </p>
            </section>

            {/* Section 03 */}
            <section id="stellar" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">03.</span>
                <span>Stellar Network &amp; Soroban Smart Contracts</span>
              </h2>
              <p>
                Certain verification proofs may be anchored to or queried from the Stellar network (including Soroban smart contracts). You acknowledge that public ledger transactions are immutable, publicly visible, and subject to native protocol transaction fees (base reserves and gas).
              </p>
            </section>

            {/* Section 04 */}
            <section id="delegation" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">04.</span>
                <span>Autonomous Agent Delegation &amp; Telemetry</span>
              </h2>
              <p>
                When connecting an AI agent to VeraOS via Webhook, REST API, or Telegram bot, you remain solely responsible for the agent's actions, prompts, claimed execution traces, and financial disbursements. VeraOS acts exclusively as an independent verification layer.
              </p>
            </section>

            {/* Section 05 */}
            <section id="access" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">05.</span>
                <span>Gated Access &amp; Invite Tokens</span>
              </h2>
              <p>
                Access to telegram bot bridges or private API quotas requires an authenticated operator session or approved invitation token. VeraOS reserves the right to rate-limit or revoke access tokens that exhibit anomalous request patterns or spam.
              </p>
            </section>

            {/* Section 06 */}
            <section id="verdicts" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">06.</span>
                <span>Verification Verdicts: PASS, FAIL &amp; Discrepancies</span>
              </h2>
              <p>
                Verification verdicts are produced deterministically based on collected evidence. A <strong>PASS</strong> indicates all invariants were satisfied. A <strong>FAIL</strong> or discrepancy indicates that observed evidence contradicts claimed parameters. You may utilize the built-in remediation loop to supply supplemental proof.
              </p>
            </section>

            {/* Section 07 */}
            <section id="prohibited" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">07.</span>
                <span>Prohibited Exploits &amp; Invariant Tampering</span>
              </h2>
              <p>
                Users agree not to forge cryptographic evidence, submit fraudulent transaction receipts, replay expired verification hashes, or attempt denial-of-service attacks against consensus nodes or API gateways.
              </p>
            </section>

            {/* Section 08 */}
            <section id="ip" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">08.</span>
                <span>Intellectual Property &amp; Proof Rights</span>
              </h2>
              <p>
                You retain ownership of all agent outputs, proprietary models, and business logic. VeraOS owns the verification engine, invariant compiler, and user interface. Cryptographic attestations generated for your runs may be freely exported by you for audit purposes.
              </p>
            </section>

            {/* Section 09 */}
            <section id="disclaimer" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">09.</span>
                <span>Disclaimer of Warranties &amp; Financial Advisory</span>
              </h2>
              <p>
                VERAOS IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND. VERAOS DOES NOT OFFER FINANCIAL, LEGAL, OR TAX ADVICE. VERIFICATION OF BLOCKCHAIN SETTLEMENT ATTESTS ONLY TO TRANSACTION STATE COMPLETION ACCORDING TO DECLARED INVARIANTS.
              </p>
            </section>

            {/* Section 10 */}
            <section id="liability" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">10.</span>
                <span>Limitation of Liability &amp; Termination</span>
              </h2>
              <p>
                IN NO EVENT SHALL VERAOS BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL LOSSES RESULTING FROM AUTONOMOUS AGENT MISCONFIGURATION, UNAUTHORIZED WALLET SIGNING, OR ORACLE OUTAGES. EITHER PARTY MAY TERMINATE THIS AGREEMENT AT ANY TIME VIA THE DANGER ZONE SETTINGS.
              </p>
            </section>
          </div>

          {/* Quick Footer Links */}
          <div className="pt-6 border-t border-[#E8E4DC] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#6B635B]">
            <Link
              to="/privacy"
              className="inline-flex items-center gap-1.5 text-[#191513] hover:text-[#D97736] transition-colors"
            >
              <span>Next: Privacy Policy</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/docs" className="hover:text-[#191513] transition-colors">
                Documentation
              </Link>
              <span>•</span>
              <Link to="/" className="hover:text-[#191513] transition-colors">
                Return Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TermsConditions;
