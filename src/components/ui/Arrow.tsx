export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={`arrow ${className}`}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M7 25 25 7M7 7h18v18" : "M4 16h23M17 6l10 10-10 10"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
