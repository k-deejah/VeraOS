import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useVerification, useVerificationsList } from "../hooks/useVerification";
import { EvidenceStatus } from "../types/evidence";

interface SourceItem {
  id: string;
  name: string;
  origin: string;
  timestamp: string;
  badge: string;
  status: EvidenceStatus;
  hash: string;
  snippet: string;
  supports: string;
  explorerUrl?: string;
}

export const EvidenceExplorer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { verifications, loading: listLoading } = useVerificationsList();
  const [selectedRunId, setSelectedRunId] = useState<string | undefined>(id);

  useEffect(() => {
    if (id) {
      setSelectedRunId(id);
    } else if (verifications.length > 0 && !selectedRunId) {
      setSelectedRunId(verifications[0].id);
    }
  }, [id, verifications, selectedRunId]);

  const activeId = id || selectedRunId;
  const { verification, loading: verificationLoading } = useVerification(activeId);

  const latestAttempt = verification?.attempts?.[verification.attempts.length - 1];
  const rawEvidence = latestAttempt?.evidence || [];

  // Format real evidence items from backend record
  const sources: SourceItem[] = rawEvidence.map((ev, idx) => {
    const dataObj = (ev.data as Record<string, unknown>) || {};
    const txHash = typeof dataObj.txHash === "string" ? dataObj.txHash : undefined;
    const explorerUrl = typeof dataObj.explorerUrl === "string" ? dataObj.explorerUrl : undefined;
    const claim = typeof dataObj.claim === "string" ? dataObj.claim : ev.proofType;

    return {
      id: ev.id || `evidence-${idx + 1}`,
      name: ev.title || ev.provider || `Evidence #${idx + 1}`,
      origin: ev.provider || "Vera Deterministic Kernel",
      timestamp: ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : "recently",
      badge: ev.status === "CONFIRMED" ? "Confirmed" : ev.status === "REJECTED" ? "Discrepancy" : "Collected",
      status: ev.status,
      hash: txHash ? `tx: ${txHash.slice(0, 10)}...${txHash.slice(-8)}` : `id: ${ev.id}`,
      snippet: JSON.stringify(dataObj, null, 2),
      supports: claim,
      explorerUrl,
    };
  });

  const [selectedSourceId, setSelectedSourceId] = useState<string>("");

  useEffect(() => {
    if (sources.length > 0 && (!selectedSourceId || !sources.some((s) => s.id === selectedSourceId))) {
      setSelectedSourceId(sources[0].id);
    }
  }, [sources, selectedSourceId]);

  const selectedSource = sources.find((s) => s.id === selectedSourceId) || sources[0];

  const runId = verification?.displayId
    ? `Run VR-${verification.displayId}`
    : activeId
    ? `Run VR-${activeId.slice(-6).toUpperCase()}`
    : "Evidence Library";

  const isLoading = (verificationLoading && !!activeId) || (listLoading && !activeId);

  if (isLoading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3 text-[#6B635B] max-w-4xl mx-auto">
        <span className="w-8 h-8 border-2 border-[#181311] border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs">Loading evidence records...</span>
      </div>
    );
  }

  // If user has zero verifications overall
  if (!activeId && verifications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 font-sans pb-16">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#181311]">
            Evidence library
          </h1>
          <p className="text-xs sm:text-sm text-[#6B635B] mt-1">
            Trace every verification finding back to raw cryptographic evidence and consensus receipts.
          </p>
        </div>

        <div className="p-12 sm:p-20 rounded-2xl bg-white border border-[#E8E4DC] flex flex-col items-center justify-center text-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF5EB] border border-[#FADCC4] flex items-center justify-center text-[#D97736]">
            <span className="material-symbols-outlined text-[24px]">folder_open</span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-[#191513]">
              No evidence records found
            </h3>
            <p className="text-xs sm:text-sm text-[#6B635B] max-w-sm mt-1.5 leading-relaxed">
              Cryptographic evidence and consensus receipts are automatically collected when verification runs are executed.
            </p>
          </div>
          <Link
            to="/verify/new"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#181311] hover:bg-[#2A2422] text-white text-xs font-heading font-semibold shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Run a verification</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 font-sans pb-16">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[#6B635B]">
          <Link to="/verifications" className="hover:text-[#181311] transition-colors">
            Verifications
          </Link>
          <span>/</span>
          {activeId ? (
            <Link
              to={`/verify/${activeId}`}
              className="hover:text-[#181311] transition-colors font-mono"
            >
              {runId}
            </Link>
          ) : (
            <span className="font-mono">Evidence</span>
          )}
          <span>/</span>
          <span className="text-[#181311]">Evidence details</span>
        </div>

        {activeId && (
          <Link
            to={`/verify/${activeId}`}
            className="text-xs font-semibold text-[#181311] hover:underline self-start sm:self-auto"
          >
            ← Back to check result
          </Link>
        )}
      </div>

      {/* Title & Run Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#181311]">
            Evidence details
          </h1>
          <p className="text-xs sm:text-sm text-[#6B635B] mt-1">
            Trace every finding back to the raw cryptographic evidence and consensus providers.
          </p>
        </div>

        {/* Verification Run Selector for /evidence view */}
        {verifications.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[#6B635B] whitespace-nowrap">
              Run:
            </label>
            <select
              value={activeId}
              onChange={(e) => {
                const targetId = e.target.value;
                setSelectedRunId(targetId);
                navigate(`/verify/${targetId}/evidence`);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E4DC] text-xs font-mono text-[#191513] focus:outline-none focus:border-[#181311] shadow-2xs"
            >
              {verifications.map((v) => (
                <option key={v.id} value={v.id}>
                  #{v.displayId} — {v.workerName || "Agent"} ({v.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Card 1: Sources reviewed */}
      <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-base sm:text-lg text-[#181311]">
            Sources reviewed
          </h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F3EFEA] text-[#6B635B] border border-[#E8E4DC]">
            • {sources.length} {sources.length === 1 ? "source" : "sources"}
          </span>
        </div>

        {sources.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6B635B] flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#9E948B]">fact_check</span>
            <span>No independent evidence items were collected for this verification run.</span>
            {activeId && (
              <Link
                to={`/verify/${activeId}`}
                className="text-xs font-semibold text-[#181311] hover:underline mt-1"
              >
                View verification run details →
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#E8E4DC]">
            {sources.map((source) => {
              const isSelected = source.id === selectedSource?.id;
              return (
                <button
                  key={source.id}
                  onClick={() => setSelectedSourceId(source.id)}
                  className={`flex items-center justify-between py-3.5 first:pt-0 last:pb-0 text-left transition-colors cursor-pointer rounded-lg px-2 -mx-2 ${
                    isSelected ? "bg-[#FAF8F5]" : "hover:bg-[#FAF8F5]/50"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm text-[#181311]">
                      {source.name}
                    </div>
                    <div className="text-xs text-[#6B635B] mt-0.5 font-mono">
                      {source.origin} • {source.timestamp}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {source.status === "CONFIRMED" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EAF5EE] text-[#1D7A46] border border-[#CDE5D5]">
                        • Confirmed
                      </span>
                    ) : source.status === "REJECTED" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FEF5EB] text-[#B8621B] border border-[#FADCC4]">
                        • Discrepancy
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F3EFEA] text-[#6B635B] border border-[#E8E4DC]">
                        • Collected
                      </span>
                    )}
                    {isSelected && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#181311] text-white">
                        Selected
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Card 2: Selected Source Viewer */}
      {selectedSource && (
        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-[#181311]">
                {selectedSource.name}
              </h3>
              <p className="font-mono text-xs text-[#6B635B] mt-0.5">
                {selectedSource.hash}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedSource.explorerUrl && (
                <a
                  href={selectedSource.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white border border-[#E8E4DC] text-xs font-semibold text-[#181311] hover:bg-[#FAF8F5] transition-colors"
                >
                  <span>Stellar Expert</span>
                  <span className="text-[10px]">↗</span>
                </a>
              )}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                  selectedSource.status === "CONFIRMED"
                    ? "bg-[#EAF5EE] text-[#1D7A46] border-[#CDE5D5]"
                    : selectedSource.status === "REJECTED"
                    ? "bg-[#FEF5EB] text-[#B8621B] border-[#FADCC4]"
                    : "bg-[#F3EFEA] text-[#6B635B] border-[#E8E4DC]"
                }`}
              >
                • {selectedSource.badge}
              </span>
            </div>
          </div>

          {/* Code Terminal */}
          <div className="bg-[#181311] rounded-xl p-4 sm:p-5 my-4 overflow-x-auto border border-[#2A2422]">
            <pre className="font-mono text-xs sm:text-sm text-[#F3E8DC] leading-relaxed whitespace-pre">
              {selectedSource.snippet}
            </pre>
          </div>

          {/* THIS SOURCE SUPPORTS */}
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B635B] mb-2">
              THIS SOURCE SUPPORTS
            </div>
            <div className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                  selectedSource.status === "CONFIRMED"
                    ? "bg-[#EAF5EE] text-[#1D7A46] border-[#CDE5D5]"
                    : "bg-[#FEF5EB] text-[#B8621B] border-[#FADCC4]"
                }`}
              >
                {selectedSource.status === "CONFIRMED" ? "✓" : "!"}
              </div>
              <span className="text-sm font-medium text-[#181311] font-mono">
                {selectedSource.supports}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Card 3: Evidence trail */}
      {verification && (
        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-sm flex flex-col gap-3">
          <h3 className="font-heading font-bold text-base sm:text-lg text-[#181311]">
            Evidence trail
          </h3>
          <div className="flex items-center gap-2.5 flex-wrap pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F3EFEA] text-[#6B635B] border border-[#E8E4DC]">
              • Quorum: {verification.quorum || "Deterministic Kernel"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F3EFEA] text-[#6B635B] border border-[#E8E4DC]">
              • Latency: {verification.latencyMs ? `${verification.latencyMs}ms` : "Fast execution"}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                verification.status === "PASSED"
                  ? "bg-[#EAF5EE] text-[#1D7A46] border-[#CDE5D5]"
                  : verification.status === "FAILED"
                  ? "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
                  : "bg-[#FEF5EB] text-[#B8621B] border-[#FADCC4]"
              }`}
            >
              • Verdict: {verification.status}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceExplorer;
