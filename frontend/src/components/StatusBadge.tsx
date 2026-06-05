import clsx from "clsx";

export function StatusBadge({ status }: { status: string }) {
  const label =
    status === "online" ? "Onlayn" : status === "warning" ? "Ogohlantirish" : status === "offline" ? "Oflayn" : status;

  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]",
        status === "online" && "bg-emerald-500/15 text-emerald-300",
        status === "warning" && "bg-amber-500/15 text-amber-300",
        status === "offline" && "bg-rose-500/15 text-rose-300"
      )}
    >
      {label}
    </span>
  );
}
