"use client"

import { useEffect, useState } from "react"
import { Bot, FileUp, MessageSquare, Sparkles, Check } from "lucide-react"

type DemoStep = "chat" | "upload" | "generate" | "done"

const chatMessages = [
  { role: "user" as const, text: "I need a motion to dismiss for lack of probable cause." },
  { role: "ai" as const, text: "What jurisdiction is your matter in, and what was the basis for the stop?" },
  { role: "user" as const, text: "California. Traffic stop — taillight was out." },
]

export function ProductDemo() {
  const [step, setStep] = useState<DemoStep>("chat")
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    if (step === "chat" && msgIndex < chatMessages.length) {
      timers.push(setTimeout(() => setMsgIndex((i) => i + 1), 1800))
    } else if (step === "chat" && msgIndex >= chatMessages.length) {
      timers.push(setTimeout(() => setStep("upload"), 1200))
    } else if (step === "upload") {
      timers.push(setTimeout(() => setStep("generate"), 2000))
    } else if (step === "generate") {
      timers.push(setTimeout(() => setStep("done"), 2500))
    } else if (step === "done") {
      timers.push(setTimeout(() => { setStep("chat"); setMsgIndex(0) }, 4000))
    }
    return () => timers.forEach(clearTimeout)
  }, [step, msgIndex])

  return (
    <section id="demo" className="section-pad bg-gray-50">
      <div className="container-main">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.25em] text-brand">
            — Live demo —
          </span>
          <h2 className="section-title-dark mx-auto">
            Watch your files become a complete document package
          </h2>
          <p className="section-desc-dark mx-auto">
            Intake → upload → generate → export. The full workflow, automated.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-950 shadow-2xl shadow-gray-950/40">
          <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
            <div className="flex gap-2" aria-hidden>
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
            </div>
            <span className="text-sm font-medium text-gray-400">Ask AI Legal — Assistant</span>
            <span className="ml-auto rounded-full bg-brand/20 px-3 py-1 text-xs font-bold text-brand">
              ● LIVE
            </span>
          </div>

          <div className="grid min-h-[440px] md:grid-cols-5">
            <aside className="hidden border-r border-white/10 p-5 md:col-span-1 md:block">
              {[
                { id: "chat", label: "Intake", icon: MessageSquare },
                { id: "upload", label: "Upload", icon: FileUp },
                { id: "generate", label: "Draft", icon: Sparkles },
                { id: "done", label: "Export", icon: Check },
              ].map(({ id, label, icon: Icon }) => (
                <div
                  key={id}
                  className={`mb-2 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                    step === id ? "bg-brand text-white" : "text-gray-500"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </div>
              ))}
            </aside>

            <div className="col-span-full p-6 md:col-span-4 md:p-8">
              {step === "chat" && (
                <div className="space-y-4">
                  {chatMessages.slice(0, msgIndex).map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                      {msg.role === "ai" && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand">
                          <Bot className="h-4 w-4 text-white" aria-hidden />
                        </div>
                      )}
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                        msg.role === "user" ? "bg-brand text-white" : "bg-white/10 text-gray-200"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {step === "upload" && (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-accent/50 bg-accent/5 p-10 text-center">
                  <FileUp className="mb-4 h-14 w-14 text-accent" aria-hidden />
                  <p className="text-lg font-semibold text-white">Analyzing police report.pdf</p>
                  <div className="mt-6 h-2 w-56 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-3/4 animate-pulse rounded-full bg-gradient-to-r from-brand to-accent" />
                  </div>
                </div>
              )}
              {step === "generate" && (
                <div className="doc-rules min-h-[300px] rounded-2xl bg-white p-6 font-mono text-xs text-gray-800">
                  <p className="font-bold text-lg">MOTION TO DISMISS</p>
                  <p className="mt-4 font-semibold text-brand">I. STATEMENT OF FACTS</p>
                  <p className="mt-2">Defendant was stopped for an alleged taillight violation…</p>
                  <p className="mt-4 flex items-center gap-2 text-brand">
                    <Sparkles className="h-4 w-4 animate-spin" style={{ animationDuration: "2s" }} aria-hidden />
                    Adding verified references…
                  </p>
                </div>
              )}
              {step === "done" && (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand/20">
                    <Check className="h-10 w-10 text-brand" aria-hidden />
                  </div>
                  <p className="font-display text-3xl text-white">Ready for your review</p>
                  <p className="mt-2 text-gray-400">Motion to Dismiss · 4 pages · PDF export</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
