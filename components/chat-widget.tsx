"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { useMutation } from "convex/react"
import {
  CheckCircle2,
  ChevronDown,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
  X,
  FileText,
  Globe,
  Loader2,
  Paperclip,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { LANGUAGES, type Locale } from "@/lib/i18n/languages"
import { CASE_TYPES, EMPTY_INTAKE, type IntakeFormData } from "@/lib/chat/types"
import { US_STATES } from "@/lib/chat/us-states"
import { isIntakeValid, SUPPORT_EMAIL } from "@/lib/chat/intake"
import { intakeFormToPayload } from "@/lib/chat/intake-structured"
import { prefillIntakeFromChat } from "@/lib/chat/intake-from-chat"
import { formatUsdFromCents } from "@/lib/pricing/ca-eviction"
import { getChatUiStrings, getWelcomeMessage } from "@/lib/chat/ui-strings"
import { stripMarkdownForChat } from "@/lib/chat/sanitize-response"
import { OPEN_CHAT_EVENT, type OpenChatEventDetail } from "@/lib/chat/open-chat"
import { SUPPORT_MAILTO, SITE_BRAND_NAME } from "@/lib/site-config"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

const CHAT_LOCALE_KEY = "ask-ai-legal-chat-locale"
const CHAT_STARTED_KEY = "ask-ai-legal-chat-started"
const MAX_INTAKE_FILES = 5
const MAX_INTAKE_FILE_BYTES = 10 * 1024 * 1024
const ALLOWED_INTAKE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
])

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("")
}

/** Strip footer-style lines from AI text — shown once in chat composer, not in bubbles */
function stripAssistantFooterLines(text: string): string {
  const bodyLines: string[] = []

  for (const line of text.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed) {
      bodyLines.push("")
      continue
    }

    const isFooterLine =
      trimmed.startsWith("📧") ||
      trimmed.startsWith("⚠️") ||
      /support@askailegal\.com/i.test(trimmed) ||
      /not legal advice|not a law firm|कानूनी सलाह नहीं|कानूनी फर्म नहीं/i.test(trimmed) ||
      /ईमेल|email.*support|विस्तृत सहायता या कोट/i.test(trimmed)

    if (!isFooterLine) {
      bodyLines.push(trimmed)
    }
  }

  return bodyLines.join("\n").trim()
}

function formatAssistantText(text: string): string {
  return stripMarkdownForChat(stripAssistantFooterLines(text))
}

function ChatThinkingLoader({ label }: { label: string }) {
  return (
    <div className="chat-thinking animate-fade-up motion-reduce:animate-none" role="status" aria-live="polite">
      <div className="flex items-center gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-gold animate-chat-dot-bounce motion-reduce:animate-none"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <span className="text-xs font-medium tracking-wide text-gold-light/90">{label}</span>
    </div>
  )
}

function UserMessageBubble({ text, animate }: { text: string; animate: boolean }) {
  return (
    <div className={`chat-user-pill ${animate ? "animate-fade-up motion-reduce:animate-none" : ""}`}>
      <p className="whitespace-pre-wrap">{text}</p>
    </div>
  )
}

function AssistantMessageBubble({
  text,
  animate,
  isStreaming,
}: {
  text: string
  animate: boolean
  isStreaming?: boolean
}) {
  const body = formatAssistantText(text)

  return (
    <div
      className={`chat-ai-card ${animate ? "animate-fade-up motion-reduce:animate-none" : ""} ${
        isStreaming ? "animate-neon-pulse motion-reduce:animate-none" : ""
      }`}
    >
      <div className="chat-ai-card__inner">
        <div className="chat-ai-card__header">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold animate-neon-pulse motion-reduce:animate-none" aria-hidden />
          <span className="chat-ai-card__brand">
            {SITE_BRAND_NAME} · Assistant
          </span>
        </div>

        <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
          {body || text}
        </p>
      </div>
    </div>
  )
}

type Tab = "chat" | "quote"

export function ChatWidget() {
  const { locale: siteLocale, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>("chat")
  const [chatLocale, setChatLocale] = useState<Locale | null>(null)
  const [languageConfirmed, setLanguageConfirmed] = useState(false)
  const [input, setInput] = useState("")
  const [intake, setIntake] = useState<IntakeFormData>(EMPTY_INTAKE)
  const [intakeError, setIntakeError] = useState("")
  const [intakeSubmitting, setIntakeSubmitting] = useState(false)
  const [intakeSuccess, setIntakeSuccess] = useState<{
    caseReference: string
    serviceLine: string
    attorneyLow: string
    attorneyHigh: string
    ourPrice: string
    isCustomQuote: boolean
  } | null>(null)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const createFromIntake = useMutation(api.cases.createFromIntake)
  const generateForCase = useMutation(api.estimates.generateForCase)
  const requestIntakeNotifications = useMutation(api.cases.requestIntakeNotifications)
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl)
  const attachIntakeDocument = useMutation(api.documents.attachIntakeDocument)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const localeRef = useRef<Locale>(siteLocale)
  const animatedMessageIdsRef = useRef<Set<string>>(new Set())

  const activeLocale = chatLocale ?? siteLocale
  const ui = getChatUiStrings(activeLocale)

  localeRef.current = activeLocale

  useEffect(() => {
    const saved = localStorage.getItem(CHAT_LOCALE_KEY) as Locale | null
    const started = localStorage.getItem(CHAT_STARTED_KEY) === "1"
    if (saved && LANGUAGES.some((l) => l.value === saved)) {
      setChatLocale(saved)
      setLanguageConfirmed(started)
    }
  }, [])

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages: chatMessages, body }) => ({
          body: {
            ...(body ?? {}),
            locale: localeRef.current,
            messages: chatMessages,
          },
        }),
      }),
    []
  )

  const { messages, sendMessage, status, setMessages, error, clearError } = useChat({
    id: "ask-ai-legal-chat",
    transport,
  })

  const isLoading = status === "submitted" || status === "streaming"

  const newlyVisibleMessageIds = useMemo(() => {
    const fresh = new Set<string>()
    for (const message of messages) {
      if (!animatedMessageIdsRef.current.has(message.id)) {
        fresh.add(message.id)
      }
    }
    return fresh
  }, [messages])

  useEffect(() => {
    for (const id of newlyVisibleMessageIds) {
      animatedMessageIdsRef.current.add(id)
    }
  }, [newlyVisibleMessageIds])

  const seedWelcome = useCallback(
    (locale: Locale) => {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          parts: [{ type: "text", text: getWelcomeMessage(locale) }],
        },
      ])
    },
    [setMessages]
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading, error])

  useEffect(() => {
    if (!languageConfirmed || !chatLocale || messages.length > 0) return
    seedWelcome(chatLocale)
  }, [languageConfirmed, chatLocale, messages.length, seedWelcome])

  const confirmLanguage = (locale: Locale) => {
    setChatLocale(locale)
    setIntake((prev) => ({ ...prev, preferredLanguage: locale }))
    localStorage.setItem(CHAT_LOCALE_KEY, locale)
    localStorage.setItem(CHAT_STARTED_KEY, "1")
    setLanguageConfirmed(true)
    setLangMenuOpen(false)

    const match = LANGUAGES.find((l) => l.value === locale)
    if (match) setLanguage(match)

    seedWelcome(locale)
  }

  const handleOpen = () => {
    setOpen(true)
    if (languageConfirmed && messages.length === 0 && chatLocale) {
      seedWelcome(chatLocale)
    }
  }

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault?.()
    const text = input.trim()
    if (!text || isLoading || !languageConfirmed) return
    setInput("")
    clearError()
    try {
      await sendMessage({ text })
    } catch {
      // useChat sets error state; keep input recovery silent
    }
  }

  const switchToQuoteTab = () => {
    setTab("quote")
    setIntake((prev) => {
      const patch = prefillIntakeFromChat(messages, prev)
      if (Object.keys(patch).length === 0) return prev
      return { ...prev, ...patch }
    })
  }

  useEffect(() => {
    const handleOpenEvent = (event: Event) => {
      const detail = (event as CustomEvent<OpenChatEventDetail>).detail
      handleOpen()
      if (detail?.tab === "quote" && languageConfirmed) {
        switchToQuoteTab()
      }
    }
    window.addEventListener(OPEN_CHAT_EVENT, handleOpenEvent)
    return () => window.removeEventListener(OPEN_CHAT_EVENT, handleOpenEvent)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageConfirmed, chatLocale])

  const handleIntakeFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return
    const incoming = Array.from(fileList)
    const combined = [...pendingFiles, ...incoming]
    if (combined.length > MAX_INTAKE_FILES) {
      setIntakeError(ui.uploadFilesTooMany)
      return
    }
    for (const file of incoming) {
      if (file.size > MAX_INTAKE_FILE_BYTES) {
        setIntakeError(ui.uploadFilesTooLarge)
        return
      }
      if (file.type && !ALLOWED_INTAKE_TYPES.has(file.type)) {
        setIntakeError("PDF, JPG, or PNG only.")
        return
      }
    }
    setIntakeError("")
    setPendingFiles(combined)
    setIntake((prev) => ({ ...prev, hasDocuments: "yes" }))
  }

  const uploadIntakeFiles = async (caseId: Id<"cases">, files: File[]) => {
    for (const file of files) {
      const uploadUrl = await generateUploadUrl({})
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      })
      if (!response.ok) {
        throw new Error(`Upload failed for ${file.name}`)
      }
      const { storageId } = (await response.json()) as { storageId: Id<"_storage"> }
      await attachIntakeDocument({
        caseId,
        storageId,
        fileName: file.name,
        contentType: file.type || undefined,
      })
    }
  }

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isIntakeValid(intake)) {
      setIntakeError(ui.fillRequired)
      return
    }
    setIntakeError("")
    setIntakeSubmitting(true)
    try {
      const result = await createFromIntake(
        intakeFormToPayload(intake, activeLocale)
      )
      if (pendingFiles.length > 0) {
        await uploadIntakeFiles(result.caseId, pendingFiles)
      }
      const estimate = await generateForCase({ caseId: result.caseId })
      setIntakeSuccess({
        caseReference: result.caseReference,
        serviceLine: estimate.serviceLine,
        attorneyLow: formatUsdFromCents(estimate.attorneyCompareLowCents),
        attorneyHigh: formatUsdFromCents(estimate.attorneyCompareHighCents),
        ourPrice: estimate.isCustomQuote
          ? ""
          : formatUsdFromCents(estimate.finalQuoteCents),
        isCustomQuote: estimate.isCustomQuote,
      })
      setIntake(EMPTY_INTAKE)
      setPendingFiles([])
      void requestIntakeNotifications({ caseId: result.caseId }).catch(() => {
        // Email is best-effort; intake + estimate already saved.
      })
    } catch (error) {
      console.error("Intake submit failed:", error)
      const detail =
        error instanceof Error ? error.message.toLowerCase() : ""
      if (detail.includes("timed out")) {
        setIntakeError(
          "Request timed out. Run npm run dev:convex in a terminal, wait for \"Convex functions ready\", then try again."
        )
      } else if (
        detail.includes("failed to fetch") ||
        detail.includes("network")
      ) {
        setIntakeError(
          "Cannot reach the server. Start both npm run dev:convex and npm run dev, then try again."
        )
      } else {
        setIntakeError(ui.intakeSubmitError)
      }
    } finally {
      setIntakeSubmitting(false)
    }
  }

  const resetIntakeSuccess = () => {
    setIntakeSuccess(null)
    setIntake(EMPTY_INTAKE)
    setIntakeError("")
    setPendingFiles([])
  }

  const updateIntake = (field: keyof IntakeFormData, value: string) => {
    setIntake((prev) => ({ ...prev, [field]: value }))
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-full border border-gold/50 bg-navy px-5 py-3 text-sm font-semibold text-white shadow-neon transition-transform hover:-translate-y-0.5 hover:border-gold"
        aria-label={ui.openChat}
      >
        <MessageCircle className="h-5 w-5 text-gold" aria-hidden />
        <span className="hidden sm:inline">{ui.openChat}</span>
      </button>
    )
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-[70] flex h-[min(500px,85vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-gold/30 bg-navy shadow-firm max-sm:inset-x-3 max-sm:right-auto max-sm:w-auto"
      role="dialog"
      aria-label={ui.title}
    >
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between gap-2 border-b border-white/10 bg-navy-light px-4 py-3">
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold text-white">{ui.title}</p>
          <p className="text-xs text-white/60">{ui.subtitle}</p>
        </div>
        <div className="flex items-center gap-1">
          {languageConfirmed && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen((v) => !v)}
                className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-gold hover:bg-white/10"
                aria-expanded={langMenuOpen}
              >
                <Globe className="h-3.5 w-3.5" aria-hidden />
                {LANGUAGES.find((l) => l.value === activeLocale)?.label ?? "EN"}
                <ChevronDown className={`h-3 w-3 transition-transform ${langMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 max-h-48 w-36 overflow-y-auto rounded-md border border-gold/25 bg-white py-1 shadow-firm">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => confirmLanguage(lang.value as Locale)}
                      className={`block w-full px-3 py-2 text-left text-xs hover:bg-gold/10 ${
                        lang.value === activeLocale ? "bg-gold/15 font-semibold text-navy" : "text-navy/80"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label={ui.closeChat}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Language picker */}
      {!languageConfirmed ? (
        <div className="flex flex-1 flex-col p-4">
          <p className="font-display text-xl text-white">{ui.pickLanguage}</p>
          <p className="mt-1 text-sm text-white/65">{ui.pickLanguageHint}</p>
          <div className="mt-4 grid flex-1 content-start gap-2 overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => confirmLanguage(lang.value as Locale)}
                className="rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-left text-sm text-white transition-colors hover:border-gold/40 hover:bg-gold/10"
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex shrink-0 border-b border-white/10">
            <button
              type="button"
              onClick={() => setTab("chat")}
              className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold uppercase tracking-wider ${
                tab === "chat" ? "border-b-2 border-gold text-gold" : "text-white/55 hover:text-white/80"
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              {ui.tabChat}
            </button>
            <button
              type="button"
              onClick={switchToQuoteTab}
              className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold uppercase tracking-wider ${
                tab === "quote" ? "border-b-2 border-gold text-gold" : "text-white/55 hover:text-white/80"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              {ui.tabQuote}
            </button>
          </div>

          {tab === "chat" ? (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
                {messages.map((message, index) => {
                  const text = getMessageText(message)
                  const animate = newlyVisibleMessageIds.has(message.id)
                  const isLastAssistant =
                    message.role === "assistant" &&
                    index === messages.length - 1 &&
                    isLoading

                  if (message.role === "user") {
                    return <UserMessageBubble key={message.id} text={text} animate={animate} />
                  }

                  return (
                    <AssistantMessageBubble
                      key={message.id}
                      text={text}
                      animate={animate}
                      isStreaming={isLastAssistant}
                    />
                  )
                })}
                {isLoading && <ChatThinkingLoader label={ui.thinking} />}
                {error && (
                  <div className="rounded-sm border border-red-400/40 bg-red-950/40 px-3 py-2 text-xs text-red-100">
                    <p>{ui.chatError}</p>
                    <button
                      type="button"
                      onClick={() => clearError()}
                      className="mt-2 font-semibold text-gold underline-offset-2 hover:underline"
                    >
                      {ui.tryAgain}
                    </button>
                  </div>
                )}
                <div ref={messagesEndRef} aria-hidden />
              </div>

              <div className="chat-composer">
                <form onSubmit={handleSend} className="chat-composer__form">
                  <div className="chat-composer__inner">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={ui.placeholder}
                      disabled={isLoading}
                      className="chat-composer__input"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="chat-composer__send"
                      aria-label={ui.send}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
                <div className="chat-composer__meta">
                  <a href={SUPPORT_MAILTO} className="chat-composer__support">
                    <Mail className="h-3 w-3 shrink-0 text-gold" aria-hidden />
                    <span>
                      {SUPPORT_EMAIL}
                      <span className="text-white/45"> · {ui.emailSupportHint}</span>
                    </span>
                  </a>
                  <p className="chat-composer__disclaimer">{ui.notLegalAdvice}</p>
                </div>
              </div>
            </>
          ) : intakeSuccess ? (
            <div className="flex flex-1 flex-col overflow-hidden px-4 py-6">
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-12 w-12 text-gold" aria-hidden />
                <p className="mt-4 font-display text-xl text-white">{ui.intakeSuccessTitle}</p>
                <p className="mt-3 rounded-sm border border-gold/40 bg-gold/10 px-4 py-3 font-mono text-lg font-semibold tracking-wide text-gold">
                  {intakeSuccess.caseReference}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/75">
                  {ui.intakeSuccessBody}
                </p>
                <div className="mt-4 w-full rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-left">
                  <p className="text-[10px] uppercase tracking-wider text-white/50">
                    {ui.estimateServiceLine}
                  </p>
                  <p className="mt-1 text-sm text-white/90">{intakeSuccess.serviceLine}</p>
                  <p className="mt-3 text-sm font-semibold text-gold">
                    {intakeSuccess.isCustomQuote
                      ? ui.estimateCustomQuote
                          .replace("{attorneyLow}", intakeSuccess.attorneyLow)
                          .replace("{attorneyHigh}", intakeSuccess.attorneyHigh)
                      : ui.estimateComparison
                          .replace("{attorneyLow}", intakeSuccess.attorneyLow)
                          .replace("{attorneyHigh}", intakeSuccess.attorneyHigh)
                          .replace("{ourPrice}", intakeSuccess.ourPrice)}
                  </p>
                  <p className="mt-2 text-[10px] text-white/45">
                    Estimate only — not legal advice. Payment and delivery come after review.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetIntakeSuccess}
                className="mt-4 w-full rounded-sm border border-white/20 py-2.5 text-sm font-semibold text-white/90 hover:border-gold/40 hover:bg-white/5"
              >
                {ui.submitAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleIntakeSubmit} className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
                <div>
                  <p className="font-display text-lg text-white">{ui.quoteTitle}</p>
                  <p className="mt-1 text-xs text-white/60">{ui.quoteHint}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="mb-1 block text-[10px] uppercase tracking-wider text-white/50">{ui.firstName}</span>
                    <input
                      required
                      value={intake.firstName}
                      onChange={(e) => updateIntake("firstName", e.target.value)}
                      className="w-full rounded-sm border border-white/15 bg-white/5 px-2.5 py-2 text-sm text-white focus:border-gold/50 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[10px] uppercase tracking-wider text-white/50">{ui.lastName}</span>
                    <input
                      required
                      value={intake.lastName}
                      onChange={(e) => updateIntake("lastName", e.target.value)}
                      className="w-full rounded-sm border border-white/15 bg-white/5 px-2.5 py-2 text-sm text-white focus:border-gold/50 focus:outline-none"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wider text-white/50">{ui.email}</span>
                  <input
                    type="email"
                    required
                    value={intake.email}
                    onChange={(e) => updateIntake("email", e.target.value)}
                    className="w-full rounded-sm border border-white/15 bg-white/5 px-2.5 py-2 text-sm text-white focus:border-gold/50 focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wider text-white/50">{ui.phone}</span>
                  <input
                    type="tel"
                    value={intake.phone}
                    onChange={(e) => updateIntake("phone", e.target.value)}
                    className="w-full rounded-sm border border-white/15 bg-white/5 px-2.5 py-2 text-sm text-white focus:border-gold/50 focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wider text-white/50">{ui.state}</span>
                  <select
                    value={intake.state}
                    onChange={(e) => updateIntake("state", e.target.value)}
                    className="w-full rounded-sm border border-white/15 bg-white/5 px-2.5 py-2 text-sm text-white focus:border-gold/50 focus:outline-none"
                  >
                    {US_STATES.map(({ code, label }) => (
                      <option key={code} value={code} className="bg-navy">
                        {label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[10px] text-white/45">{ui.stateHint}</p>
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wider text-white/50">{ui.caseType}</span>
                  <select
                    value={intake.caseType}
                    onChange={(e) => updateIntake("caseType", e.target.value)}
                    className="w-full rounded-sm border border-white/15 bg-white/5 px-2.5 py-2 text-sm text-white focus:border-gold/50 focus:outline-none"
                  >
                    <option value="" className="bg-navy">
                      —
                    </option>
                    {CASE_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-navy">
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wider text-white/50">{ui.issue}</span>
                  <textarea
                    required
                    rows={3}
                    value={intake.issue}
                    onChange={(e) => updateIntake("issue", e.target.value)}
                    className="w-full resize-none rounded-sm border border-white/15 bg-white/5 px-2.5 py-2 text-sm text-white focus:border-gold/50 focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wider text-white/50">{ui.deadline}</span>
                  <input
                    value={intake.deadline}
                    onChange={(e) => updateIntake("deadline", e.target.value)}
                    className="w-full rounded-sm border border-white/15 bg-white/5 px-2.5 py-2 text-sm text-white focus:border-gold/50 focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wider text-white/50">{ui.opposingParty}</span>
                  <input
                    value={intake.opposingParty}
                    onChange={(e) => updateIntake("opposingParty", e.target.value)}
                    className="w-full rounded-sm border border-white/15 bg-white/5 px-2.5 py-2 text-sm text-white focus:border-gold/50 focus:outline-none"
                  />
                </label>

                <fieldset>
                  <legend className="mb-1 text-[10px] uppercase tracking-wider text-white/50">{ui.hasDocuments}</legend>
                  <div className="flex gap-3 text-sm text-white/80">
                    <label className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="hasDocuments"
                        checked={intake.hasDocuments === "yes"}
                        onChange={() => updateIntake("hasDocuments", "yes")}
                        className="accent-gold"
                      />
                      {ui.hasDocumentsYes}
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="hasDocuments"
                        checked={intake.hasDocuments === "no"}
                        onChange={() => updateIntake("hasDocuments", "no")}
                        className="accent-gold"
                      />
                      {ui.hasDocumentsNo}
                    </label>
                  </div>
                </fieldset>

                {(intake.hasDocuments === "yes" || pendingFiles.length > 0) && (
                  <div className="rounded-sm border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/50">{ui.uploadFiles}</p>
                    <p className="mt-1 text-[10px] text-white/45">{ui.uploadFilesHint}</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
                      multiple
                      className="sr-only"
                      onChange={(e) => {
                        handleIntakeFiles(e.target.files)
                        e.target.value = ""
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-gold/40 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/10"
                    >
                      <Paperclip className="h-3.5 w-3.5" aria-hidden />
                      {ui.uploadFiles}
                    </button>
                    {pendingFiles.length > 0 && (
                      <ul className="mt-2 space-y-1 text-left text-[11px] text-white/70">
                        {pendingFiles.map((file) => (
                          <li key={`${file.name}-${file.size}`} className="truncate">
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    {pendingFiles.length > 0 && (
                      <p className="mt-1 text-[10px] text-white/45">
                        {ui.uploadFilesSelected.replace("{count}", String(pendingFiles.length))}
                      </p>
                    )}
                  </div>
                )}

                <fieldset>
                  <legend className="mb-1 text-[10px] uppercase tracking-wider text-white/50">{ui.preferredContact}</legend>
                  <div className="flex flex-wrap gap-3 text-sm text-white/80">
                    {(
                      [
                        ["email", ui.contactEmail],
                        ["phone", ui.contactPhone],
                        ["either", ui.contactEither],
                      ] as const
                    ).map(([value, label]) => (
                      <label key={value} className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name="preferredContact"
                          checked={intake.preferredContact === value}
                          onChange={() => updateIntake("preferredContact", value)}
                          className="accent-gold"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {intakeError && <p className="text-xs text-red-300">{intakeError}</p>}
              </div>

              <div className="shrink-0 border-t border-white/10 px-4 py-3">
                <button
                  type="submit"
                  disabled={intakeSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-gold py-2.5 text-sm font-semibold text-navy transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {intakeSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {intakeSubmitting ? ui.submittingRequest : ui.sendRequest}
                </button>
                <p className="mt-2 text-[10px] leading-snug text-white/45">{ui.uploadNote}</p>
                <p className="mt-1 text-[10px] text-white/40">
                  {SUPPORT_EMAIL}
                </p>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  )
}
