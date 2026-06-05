import clsx from "clsx";

export function SeverityBadge({ severity }: { severity: string }) {
  const label =
    severity === "normal"
      ? "Normal"
      : severity === "warning"
        ? "Ogohlantirish"
        : severity === "critical"
          ? "Kritik"
          : severity;

  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]",
        severity === "normal" && "bg-cyan-500/15 text-cyan-300",
        severity === "warning" && "bg-amber-500/15 text-amber-300",
        severity === "critical" && "bg-rose-500/15 text-rose-300"
      )}
    >
      {label}
    </span>
  );
}
