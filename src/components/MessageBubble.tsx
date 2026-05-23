interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";
  const displayContent = content
    .replace(/\[INTAKE_COMPLETE\]/, "")
    .trim();

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-navy text-xs font-bold shrink-0 mr-2 mt-0.5">
          M
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-gold text-navy font-medium rounded-br-sm"
            : "bg-navy-light text-slate-100 rounded-bl-sm"
        }`}
      >
        {displayContent}
      </div>
    </div>
  );
}
