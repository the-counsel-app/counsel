export default function PrivacyBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-light border border-gold/20 text-xs text-gold/90 w-fit">
      <svg
        className="w-3.5 h-3.5 shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
          clipRule="evenodd"
        />
      </svg>
      Attorney-Client Privilege Protected
    </div>
  );
}
