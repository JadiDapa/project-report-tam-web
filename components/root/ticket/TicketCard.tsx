// components/tickets/TicketCard.tsx
"use client";

import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { TicketType } from "@/lib/types/ticket";

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const styles: Record<string, string> = {
    default: "bg-muted text-foreground",
    success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    danger: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    info: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

function statusVariant(status: string) {
  const s = status.toLowerCase();
  if (s.includes("closed") || s.includes("done") || s.includes("resolved"))
    return "success";
  if (s.includes("pending") || s.includes("waiting")) return "warning";
  if (s.includes("reject") || s.includes("cancel")) return "danger";
  return "info"; // open/in progress/etc
}

function priorityVariant(priority?: string) {
  const p = (priority ?? "").toLowerCase();
  if (p.includes("high") || p.includes("urgent")) return "danger";
  if (p.includes("medium")) return "warning";
  if (p.includes("low")) return "success";
  return "default";
}

export default function TicketCard({ ticket }: { ticket: TicketType }) {
  const created = new Date(ticket.createdAt);

  return (
    <div className="group bg-card relative overflow-hidden rounded-2xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* subtle accent */}
      <div className="bg-primary/70 absolute inset-x-0 top-0 h-1" />

      <div className="flex flex-col gap-4 p-5">
        {/* Top row: title + badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">
                #{ticket.id}
              </span>
            </div>

            <h3 className="mt-1 line-clamp-2 text-lg leading-snug font-semibold">
              {ticket.title}
            </h3>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <Badge variant={statusVariant(ticket.status as string)}>
              {ticket.status}
            </Badge>
            {"priority" in ticket && (
              <Badge variant={priorityVariant((ticket as any).priority)}>
                {(ticket as any).priority ?? "—"}
              </Badge>
            )}
          </div>
        </div>

        {/* Info section */}
        <div className="bg-muted/40 grid grid-cols-2 gap-3 rounded-xl p-3">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Requester</p>
            <p className="truncate text-sm font-medium">
              {ticket.Requester?.fullname ?? "-"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Handler</p>
            <p className="truncate text-sm font-medium">
              {ticket.Handler?.fullname ?? "Unassigned"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Time</p>
            <p className="text-primary text-sm font-medium">
              {format(created, "HH.mm", { locale: id })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Date</p>
            <p className="text-sm font-medium">
              {format(created, "d MMMM yyyy", { locale: id })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            Tap for full details & activity
          </p>

          <Link
            href={`/tickets/${ticket.id}`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
