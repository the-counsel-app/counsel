import Link from "next/link";
import DemoButton from "@/components/DemoButton";

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-navy">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-navy-lighter">
        <span className="text-gold font-bold tracking-widest text-sm">COUNSEL</span>
        <span className="text-slate-500 text-xs">Mitchell &amp; Associates</span>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-2xl mx-auto">
        {/* Privilege badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 text-xs text-gold/80 mb-8">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
              clipRule="evenodd"
            />
          </svg>
          Attorney-Client Privilege Protected
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 leading-tight mb-4">
          Your Story.{" "}
          <span className="text-gold">Protected.</span>{" "}
          Evaluated.
        </h1>

        <p className="text-slate-400 text-lg mb-4 leading-relaxed">
          Tell your side of the story to our AI intake specialist — working under the
          supervision of a licensed attorney, so everything you share is{" "}
          <strong className="text-slate-300">
            protected by attorney-client privilege
          </strong>{" "}
          and cannot be used against you in court.
        </p>

        <p className="text-slate-500 text-sm mb-10">
          Unlike generic AI tools, conversations with Counsel are tied to a
          supervising attorney — making your intake legally protected from the start.
        </p>

        <Link
          href="/chat"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-base transition-colors"
        >
          Start Your Free Intake
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <DemoButton />
      </section>

      {/* How it works */}
      <section className="px-6 pb-16 max-w-3xl mx-auto w-full">
        <div className="border-t border-navy-lighter pt-10">
          <h2 className="text-center text-slate-500 text-xs font-semibold uppercase tracking-widest mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Protected Intake",
                desc: "Answer questions from our AI specialist. Your conversation is covered by attorney-client privilege from the first message.",
              },
              {
                step: "02",
                title: "Case Evaluation",
                desc: "Our system analyzes your information and generates a confidential assessment — liability, strengths, and risks.",
              },
              {
                step: "03",
                title: "Attorney Match",
                desc: "Get connected with the right personal injury attorney for your situation. No guesswork, no cold calls.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col gap-2">
                <span className="text-gold font-bold text-2xl">{step}</span>
                <h3 className="font-semibold text-slate-200">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-lighter px-6 py-4 text-center text-xs text-slate-600">
        Counsel · Operated under Mitchell &amp; Associates Law Firm · Attorney-Client Privilege Applies
      </footer>
    </main>
  );
}
