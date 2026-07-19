"use client"

import { useEffect, useRef, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

type Props = {
  opsToken: string
  caseId: Id<"cases">
}

const AGENT_LABELS: Record<string, string> = {
  intake: "Intake Agent",
  pricing: "Pricing Agent",
  document_understanding: "Document Understanding Agent",
  legal_research: "Legal Research Agent",
  strategy: "Strategy Agent",
  drafting: "Drafting Agent",
  review_critique: "Review & Critique Agent",
  counsel: "Counsel Gate",
}

const AGENT_SEALS: Record<string, string> = {
  intake: "IN",
  pricing: "PR",
  document_understanding: "DU",
  legal_research: "LR",
  strategy: "ST",
  drafting: "DR",
  review_critique: "RC",
  counsel: "CG",
}

function stampTime(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function CaseWorkspace({ opsToken, caseId }: Props) {
  const docs = useQuery(api.documentVersions.getWorkspaceForCase, { opsToken, caseId })
  const messages = useQuery(api.caseChat.listForCase, { opsToken, caseId })
  const saveVersion = useMutation(api.documentVersions.saveVersion)
  const approveAndDeliver = useMutation(api.documentVersions.approveAndDeliver)
  const rejectDraft = useMutation(api.documentVersions.rejectDraft)
  const postStaffMessage = useMutation(api.caseChat.postStaffMessage)
  const startCouncil = useMutation(api.councilData.startCouncilForCase)

  const [selectedDocId, setSelectedDocId] = useState<Id<"documents"> | null>(null)
  const [draftText, setDraftText] = useState("")
  const [loadedVersionKey, setLoadedVersionKey] = useState("")
  const [chatInput, setChatInput] = useState("")
  const [rejectNotes, setRejectNotes] = useState("")
  const [showReject, setShowReject] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  const selectedDoc =
    docs?.find((d) => d.documentId === selectedDocId) ?? docs?.[0] ?? null

  // Load editor content when the selected document (or a newer version) arrives.
  useEffect(() => {
    if (!selectedDoc) return
    const key = `${selectedDoc.documentId}:${selectedDoc.latestVersion}`
    if (key !== loadedVersionKey) {
      setDraftText(selectedDoc.latestContent)
      setLoadedVersionKey(key)
    }
  }, [selectedDoc, loadedVersionKey])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ block: "end" })
  }, [messages?.length])

  const run = async (fn: () => Promise<unknown>) => {
    setError("")
    setBusy(true)
    try {
      await fn()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed")
    } finally {
      setBusy(false)
    }
  }

  const dirty = selectedDoc !== null && draftText !== selectedDoc.latestContent

  return (
    <section className="mt-6 rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
        <div>
          <h2 className="font-display text-xl text-navy">Case workspace</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            AI drafts; a human approves. Nothing reaches the client without the gate below.
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void run(() => startCouncil({ opsToken, caseId }))}
          className="rounded border border-navy bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-40"
        >
          Convene AI council
        </button>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        {/* ── Left: document editor ─────────────────────────────── */}
        <div className="border-b border-gray-100 p-6 lg:border-b-0 lg:border-r">
          <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
            Document editor
          </h3>

          {!docs || docs.length === 0 ? (
            <p className="mt-6 rounded border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
              No drafts yet. Convene the AI council (paid cases) and the drafting
              agent will place v1 here.
            </p>
          ) : (
            <>
              {docs.length > 1 && (
                <label className="mt-3 block">
                  <span className="sr-only">Select document</span>
                  <select
                    value={selectedDoc?.documentId ?? ""}
                    onChange={(e) =>
                      setSelectedDocId(e.target.value as Id<"documents">)
                    }
                    className="w-full rounded border border-gray-200 px-3 py-2 text-sm"
                  >
                    {docs.map((d) => (
                      <option key={d.documentId} value={d.documentId}>
                        {d.fileName} (v{d.latestVersion})
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {selectedDoc && (
                <>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                    <span>
                      <span className="font-semibold text-navy">{selectedDoc.fileName}</span>{" "}
                      · v{selectedDoc.latestVersion} · last edit{" "}
                      {selectedDoc.lastEditedBy === "ai_drafting_agent"
                        ? "AI drafting agent"
                        : selectedDoc.lastEditedBy}{" "}
                      ({stampTime(selectedDoc.lastEditedAt)})
                    </span>
                    {selectedDoc.reviewDecision && (
                      <span
                        className={`rounded-full border px-2 py-0.5 font-semibold ${
                          selectedDoc.reviewDecision === "approved"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {selectedDoc.reviewDecision.replace(/_/g, " ")}
                      </span>
                    )}
                  </div>

                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    rows={22}
                    aria-label="Draft document content"
                    className="mt-3 w-full rounded border border-gray-200 bg-cream/50 px-4 py-3 font-mono text-xs leading-relaxed focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy || !dirty}
                      onClick={() =>
                        void run(async () => {
                          await saveVersion({
                            opsToken,
                            documentId: selectedDoc.documentId,
                            content: draftText,
                          })
                        })
                      }
                      className="rounded border border-navy px-4 py-2.5 text-sm font-semibold text-navy disabled:opacity-40"
                    >
                      Save as v{selectedDoc.latestVersion + 1}
                    </button>
                    <button
                      type="button"
                      disabled={busy || selectedDoc.status === "delivered"}
                      onClick={() =>
                        void run(async () => {
                          if (dirty) {
                            await saveVersion({
                              opsToken,
                              documentId: selectedDoc.documentId,
                              content: draftText,
                              changeNote: "Final edits before approval",
                            })
                          }
                          await approveAndDeliver({
                            opsToken,
                            caseId,
                            documentId: selectedDoc.documentId,
                          })
                        })
                      }
                      className="rounded border border-gold bg-gold/20 px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-gold/30 disabled:opacity-40"
                    >
                      ⚖ Approve &amp; deliver to client
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setShowReject((v) => !v)}
                      className="rounded border border-gray-300 px-4 py-2.5 text-sm text-gray-700 disabled:opacity-40"
                    >
                      Needs edits…
                    </button>
                  </div>

                  {showReject && (
                    <div className="mt-3 space-y-2 rounded border border-amber-200 bg-amber-50 p-3">
                      <label className="block text-xs font-semibold text-amber-800">
                        What needs to change before this can go out?
                        <textarea
                          value={rejectNotes}
                          onChange={(e) => setRejectNotes(e.target.value)}
                          rows={3}
                          className="mt-1 w-full rounded border border-amber-200 px-3 py-2 text-sm font-normal text-gray-800"
                        />
                      </label>
                      <button
                        type="button"
                        disabled={busy || !rejectNotes.trim()}
                        onClick={() =>
                          void run(async () => {
                            await rejectDraft({
                              opsToken,
                              caseId,
                              documentId: selectedDoc.documentId,
                              notes: rejectNotes.trim(),
                            })
                            setRejectNotes("")
                            setShowReject(false)
                          })
                        }
                        className="rounded border border-amber-600 bg-white px-3 py-2 text-sm font-semibold text-amber-800 disabled:opacity-40"
                      >
                        Record &quot;needs edits&quot;
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        {/* ── Right: secure chat / council ledger ───────────────── */}
        <div className="flex min-h-[24rem] flex-col p-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
            Secure case chat
          </h3>
          <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1" style={{ maxHeight: "34rem" }}>
            {messages === undefined && (
              <p className="py-8 text-center text-sm text-gray-500">Loading chat…</p>
            )}
            {messages?.length === 0 && (
              <p className="rounded border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                No activity yet. Council agents and your notes will appear here.
              </p>
            )}
            {messages?.map((msg) => {
              const isAgent = msg.authorType === "ai_agent"
              const seal = isAgent
                ? AGENT_SEALS[msg.agentType ?? ""] ?? "AI"
                : msg.authorId === "system"
                  ? "⚙"
                  : "OP"
              const name = isAgent
                ? AGENT_LABELS[msg.agentType ?? ""] ?? "AI agent"
                : msg.authorId === "system"
                  ? "System"
                  : "Operator"
              return (
                <article
                  key={msg.messageId}
                  className={`rounded-lg border p-3 ${
                    isAgent
                      ? "border-gray-200 bg-cream/60"
                      : "border-gold/40 bg-gold/5"
                  }`}
                >
                  <header className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px] font-bold ${
                        isAgent ? "bg-navy text-gold" : "bg-gold text-navy"
                      }`}
                    >
                      {seal}
                    </span>
                    <span className="font-display text-sm text-navy">{name}</span>
                    <span className="ml-auto text-[11px] text-gray-400">
                      {stampTime(msg.createdAt)}
                    </span>
                  </header>
                  <div className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-gray-800">
                    {msg.body}
                  </div>
                </article>
              )
            })}
            <div ref={chatEndRef} />
          </div>

          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              const body = chatInput.trim()
              if (!body) return
              setChatInput("")
              void run(() => postStaffMessage({ opsToken, caseId, body }))
            }}
          >
            <label className="flex-1">
              <span className="sr-only">Message the case file</span>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Add a note to the case file…"
                className="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
              />
            </label>
            <button
              type="submit"
              disabled={busy || !chatInput.trim()}
              className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-40"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
