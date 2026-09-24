import React from "react";
import { Link } from "react-router-dom";
import { GITHUB_REPO_URL } from "../config/env";

export const PrivacyPolicy: React.FC = () => {
  const tableOfContents = [
    { id: "overview", label: "01. Overview & Data Minimization" },
    { id: "google-auth", label: "02. Google OAuth 2.0 & Identity Data" },
    { id: "agent-telemetry", label: "03. Agent Payloads & Evidence Traces" },
    { id: "cryptographic", label: "04. Cryptographic Hashing & Zero-Knowledge" },
    { id: "subprocessors", label: "05. Subprocessors & Stellar Horizon Nodes" },
    { id: "gdpr", label: "06. GDPR, CCPA & Global Statutory Rights" },
    { id: "retention", label: "07. Retention & Danger Zone Account Erasure" },
    { id: "cookies", label: "08. Cookies & Local Session Storage" },
    { id: "security", label: "09. Zero-Trust Security Architecture" },
    { id: "contact", label: "10. Contact & Privacy Governance" },
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
            Privacy Notice • v0.2.0
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold">
          <Link to="/" className="text-[#6B635B] hover:text-[#191513] transition-colors">
            Home
          </Link>
          <Link
            to="/terms"
            className="text-[#6B635B] hover:text-[#191513] transition-colors"
          >
            Terms of Service
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
            <span className="material-symbols-outlined text-[#D97736] text-[18px]">privacy_tip</span>
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#191513]">
              Privacy Topics
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
            <span className="text-[#1D7A46]">Zero-Trust Cryptographic Storage</span>
          </div>
        </aside>

        {/* Legal Text Document (8 cols on lg) */}
        <main className="lg:col-span-8 bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-10 shadow-sm flex flex-col gap-8">
          {/* Header Section */}
          <div className="space-y-3 border-b border-[#E8E4DC] pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5EE] border border-[#CDE5D5] text-[#1D7A46] text-xs font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D7A46] animate-pulse" />
              <span>GDPR &amp; Global Privacy Notice</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#191513]">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#6B635B]">
              Effective Date: <strong className="text-[#191513]">September 20, 2026</strong> • Version 0.2.0
            </p>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs text-[#6B635B] leading-relaxed">
              At <strong>VeraOS</strong>, we operate the independent verification layer for autonomous AI agents. This Privacy Policy details what information we collect, how cryptographic verification payloads are processed, and how you can exercise full data sovereignty or wipe your account via the Danger Zone.
            </div>
          </div>

          {/* Key Privacy Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#191513] mb-1">
                <span className="material-symbols-outlined text-[18px] text-[#1D7A46]">lock</span>
                <span>Zero-Knowledge</span>
              </div>
              <p className="text-[11px] text-[#6B635B] leading-relaxed">
                Verification checks compare cryptographic hashes and consensus receipts without retaining raw secrets.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#191513] mb-1">
                <span className="material-symbols-outlined text-[18px] text-[#1D7A46]">shield_person</span>
                <span>Google OAuth</span>
              </div>
              <p className="text-[11px] text-[#6B635B] leading-relaxed">
                We only request basic identity (name, email, avatar). We never request access to Google Drive or private files.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#191513] mb-1">
                <span className="material-symbols-outlined text-[18px] text-[#1D7A46]">delete_forever</span>
                <span>Full Erasure</span>
              </div>
              <p className="text-[11px] text-[#6B635B] leading-relaxed">
                Permanent account deletion and key revocation are accessible at any time from your Danger Zone settings.
              </p>
            </div>
          </div>

          {/* Sections Body */}
          <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-[#4A433D]">
            {/* Section 01 */}
            <section id="overview" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">01.</span>
                <span>Overview &amp; Data Minimization Principle</span>
              </h2>
              <p>
                VeraOS operates under strict data minimization principles. We only collect telemetry, proof payloads, and identity attributes strictly required to perform deterministic task verification and maintain authorized session access.
              </p>
            </section>

            {/* Section 02 */}
            <section id="google-auth" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">02.</span>
                <span>Google OAuth 2.0 &amp; Identity Data</span>
              </h2>
              <p>
                When you authenticate via Google OAuth, Supabase Auth securely exchanges authorization tokens with Google. We store your verified email address, full name, profile avatar URL, and internal user identifier. We never store or inspect your Google account passwords.
              </p>
            </section>

            {/* Section 03 */}
            <section id="agent-telemetry" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">03.</span>
                <span>Agent Payloads &amp; Evidence Traces</span>
              </h2>
              <p>
                During verification, autonomous agents submit task prompts, claimed output strings, and cryptographic evidence hashes. These items are processed through our invariant solver to evaluate whether claims hold true. Sensitive metadata can be redacted or submitted in hashed form.
              </p>
            </section>

            {/* Section 04 */}
            <section id="cryptographic" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">04.</span>
                <span>Cryptographic Hashing &amp; Public Ledger Data</span>
              </h2>
              <p>
                Attestation proofs anchored to the Stellar public ledger contain cryptographic digest hashes and consensus signatures. Data broadcast to public blockchain networks is inherently permanent and cannot be modified or deleted by VeraOS.
              </p>
            </section>

            {/* Section 05 */}
            <section id="subprocessors" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">05.</span>
                <span>Subprocessors &amp; Stellar Horizon Nodes</span>
              </h2>
              <p>
                We utilize trusted infrastructure providers to deliver high availability:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Supabase Inc.</strong> — Authentication session tokens and relational persistence.</li>
                <li><strong>Stellar Development Foundation / Horizon Nodes</strong> — Public blockchain consensus queries.</li>
                <li><strong>Vercel Inc.</strong> — Global edge content delivery and static application hosting.</li>
              </ul>
            </section>

            {/* Section 06 */}
            <section id="gdpr" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">06.</span>
                <span>GDPR, CCPA &amp; Global Statutory Rights</span>
              </h2>
              <p>
                Regardless of your geographic location, you enjoy statutory rights including: the right to access your stored data, the right to rectification, the right to object to processing, the right to data portability, and the right to permanent erasure ("Right to Be Forgotten").
              </p>
            </section>

            {/* Section 07 */}
            <section id="retention" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">07.</span>
                <span>Retention &amp; Danger Zone Account Erasure</span>
              </h2>
              <p>
                You can immediately revoke API credentials or permanently delete your account and associated verification logs via the <strong>Danger Zone</strong> tab in your Profile settings. Upon confirmed deletion, your personal data is purged from active databases within 60 seconds.
              </p>
            </section>

            {/* Section 08 */}
            <section id="cookies" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">08.</span>
                <span>Cookies &amp; Local Session Storage</span>
              </h2>
              <p>
                We use strictly necessary browser storage (LocalStorage and secure session cookies) to preserve your authentication token and active network preferences. We do not use third-party tracking cookies or sell your personal information to advertising brokers.
              </p>
            </section>

            {/* Section 09 */}
            <section id="security" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">09.</span>
                <span>Zero-Trust Security Architecture</span>
              </h2>
              <p>
                All data in transit is encrypted using TLS 1.3. Programmatic API keys are stored hashed in our backend vaults. Only verified operators possessing the authorized cryptographic key can invoke private verification endpoints.
              </p>
            </section>

            {/* Section 10 */}
            <section id="contact" className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-[#191513] flex items-center gap-2">
                <span className="text-[#D97736] font-mono">10.</span>
                <span>Contact &amp; Privacy Governance</span>
              </h2>
              <p>
                For statutory inquiries, data export requests, or security disclosure reports, you may contact our privacy engineering team or open a cryptographic ticket via GitHub at{" "}
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#D97736] underline font-semibold"
                >
                  VeraOS Repository
                </a>.
              </p>
            </section>
          </div>

          {/* Quick Footer Links */}
          <div className="pt-6 border-t border-[#E8E4DC] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#6B635B]">
            <Link
              to="/terms"
              className="inline-flex items-center gap-1.5 text-[#191513] hover:text-[#D97736] transition-colors"
            >
              <span>← Terms of Service</span>
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

export default PrivacyPolicy;
