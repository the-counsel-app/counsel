"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import MessageBubble from "./MessageBubble";
import PrivacyBadge from "./PrivacyBadge";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "init",
  role: "assistant",
  content:
    "Hello, I'm the intake specialist at Mitchell & Associates. Everything you share with me today is protected by attorney-client privilege — it cannot be used against you in court. I'm here to help Attorney Mitchell understand your situation. To get started, could you briefly describe what happened to you?",
};

const FAKE_CONVERSATION: ChatMessage[] = [
  { id: "f1", role: "assistant", content: "Hello, I'm the intake specialist at Mitchell & Associates. Everything you share with me today is protected by attorney-client privilege. To get started, could you briefly describe what happened to you?" },
  { id: "f2", role: "user", content: "I was rear-ended at a red light on I-90 in Chicago on March 15th. The other driver hit me pretty hard — airbags went off." },
  { id: "f3", role: "assistant", content: "I'm so sorry to hear that — that sounds like a frightening experience. Was a police report filed at the scene, and do you have the report number or the other driver's insurance information?" },
  { id: "f4", role: "user", content: "Yes, police came and filed a report. I have the report number. The other driver's insurance is State Farm." },
  { id: "f5", role: "assistant", content: "Good, that's helpful. What injuries are you experiencing, and did you notice them right away or did some symptoms appear later?" },
  { id: "f6", role: "user", content: "My neck and lower back hurt immediately. I also started getting headaches the next day. My right shoulder has been sore too." },
  { id: "f7", role: "assistant", content: "Did you go to the emergency room or see a doctor after the accident? And are you still receiving treatment?" },
  { id: "f8", role: "user", content: "I went to the ER the same day. I've been seeing an orthopedic specialist for about 8 weeks now. They're talking about possible surgery on my shoulder." },
  { id: "f9", role: "assistant", content: "I understand — ongoing treatment is important to document. Have you had any prior injuries to your neck, back, or shoulder, or any previous car accidents or workers' comp claims?" },
  { id: "f10", role: "user", content: "I had some lower back issues back in 2023 but that had fully resolved. No prior accidents or claims." },
  { id: "f11", role: "assistant", content: "Thank you for being upfront about that — it's important context. Have you missed any work as a result of your injuries, and do you have a sense of your medical bills so far?" },
  { id: "f12", role: "user", content: "I missed 2 weeks of work. My employer gave me a letter confirming it. Medical bills are around $18,000 so far and climbing." },
  { id: "f13", role: "assistant", content: "[INTAKE_COMPLETE] Thank you so much for walking me through everything today. Attorney Mitchell's team will review your case carefully and be in touch soon to discuss next steps. In the meantime, please continue following your doctor's treatment plan and hold onto any bills, records, or correspondence related to the accident. Take care of yourself." },
];

export default function ChatInterface() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [ctaState, setCtaState] = useState<"idle" | "loading" | "error">("idle");
  const [ctaError, setCtaError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const intakeComplete = messages.some(
    (m) => m.role === "assistant" && m.content.includes("[INTAKE_COMPLETE]")
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const syncViewport = useCallback(() => {
    const vv = window.visualViewport;
    if (!vv || !containerRef.current) return;
    containerRef.current.style.height = `${vv.height}px`;
    containerRef.current.style.top = `${vv.offsetTop}px`;
  }, []);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    vv.addEventListener("resize", syncViewport);
    vv.addEventListener("scroll", syncViewport);
    syncViewport();
    return () => {
      vv.removeEventListener("resize", syncViewport);
      vv.removeEventListener("scroll", syncViewport);
    };
  }, [syncViewport]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isStreaming || intakeComplete) return;

    if (input.trim().toLowerCase() === "gen fake report") {
      setInput("");
      setMessages(FAKE_CONVERSATION);
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    const assistantId = crypto.randomUUID();
    let assistantContent = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;
        setMessages((prev) => {
          const idx = prev.findIndex((m) => m.id === assistantId);
          if (idx === -1) return prev;
          const updated = [...prev];
          updated[idx] = { ...updated[idx], content: assistantContent };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === assistantId);
        const fallback: ChatMessage = {
          id: assistantId,
          role: "assistant",
          content: "I'm sorry, something went wrong. Please try again.",
        };
        if (idx === -1) return [...prev, fallback];
        const updated = [...prev];
        updated[idx] = fallback;
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  async function handleGetEvaluation() {
    setCtaState("loading");
    try {
      sessionStorage.setItem("intakeMessages", JSON.stringify(messages));
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content.replace(/\[INTAKE_COMPLETE\]/g, "").trim(),
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? `HTTP ${res.status}`);
      sessionStorage.setItem("caseSummary", JSON.stringify(data));
      router.push("/summary");
    } catch (err) {
      setCtaError(err instanceof Error ? err.message : "Unknown error");
      setCtaState("error");
    }
  }

  return (
    <div ref={containerRef} className="flex flex-col bg-navy fixed inset-x-0 top-0" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-lighter">
        <div className="flex items-center gap-2">
          <span className="text-gold font-semibold text-sm tracking-wide">COUNSEL</span>
          <span className="text-navy-lighter text-sm">·</span>
          <span className="text-slate-400 text-xs">Mitchell &amp; Associates</span>
        </div>
        <PrivacyBadge />
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
        {isStreaming && messages[messages.length - 1]?.content === "" && (
          <div className="flex justify-start mb-3">
            <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-navy text-xs font-bold shrink-0 mr-2 mt-0.5">
              M
            </div>
            <div className="bg-navy-light rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* CTA when intake complete */}
      {intakeComplete && (
        <div className="mx-4 mb-3 p-4 bg-navy-light rounded-xl border border-gold/30 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gold">Intake Complete</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Generate your confidential case evaluation.
            </p>
          </div>
          {ctaState === "error" && (
            <p className="text-xs text-red-400">Error: {ctaError || "Something went wrong."}</p>
          )}
          <button
            onClick={handleGetEvaluation}
            disabled={ctaState === "loading"}
            className="shrink-0 px-5 py-2.5 bg-gold hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-navy font-semibold text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            {ctaState === "loading" ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generating…
              </>
            ) : (
              "Get My Case Evaluation →"
            )}
          </button>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex gap-2 px-4 pb-5 pt-2 border-t border-navy-lighter"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response…"
          disabled={intakeComplete}
          className="flex-1 bg-navy-light border border-navy-lighter rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-gold/50 transition-colors disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming || intakeComplete}
          className="px-4 py-3 bg-gold hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed text-navy rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
