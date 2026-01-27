"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ExcelExport from "@/components/root/ExcelExport";
import { getTicketsByHandlerId } from "@/lib/networks/ticket";
import { format } from "date-fns";
import { useAccount } from "@/providers/AccountProvider";
import TicketCard from "@/components/root/ticket/TicketCard";
import { TicketType } from "@/lib/types/ticket";

function normalize(v: unknown) {
  return String(v ?? "")
    .toLowerCase()
    .trim();
}

export default function TicketDashboard() {
  const { account } = useAccount();

  const { data: tickets } = useQuery({
    queryFn: () => getTicketsByHandlerId(String(account?.id ?? "")),
    queryKey: ["tickets", account?.id],
    enabled: !!account?.id,
  });

  const excelData = tickets?.map((t, i) => ({
    No: i + 1,
    "Created At": format(t.createdAt, "dd MMMM, yyyy"),
    Requester: t.Requester.fullname,
    Handler: t.Handler?.fullname || "Unassigned",
    Title: t.title,
    Status: t.status,
    Priority: (t as any).priority,
  }));

  // Filters (similar to your SearchDataTable usage)
  const [qRequester, setQRequester] = useState("");
  const [qHandler, setQHandler] = useState("");
  const [qTitle, setQTitle] = useState("");
  const [qStatus, setQStatus] = useState("");

  const filteredTickets = useMemo(() => {
    const list = (tickets ?? []) as TicketType[];

    return list.filter((t) => {
      const requester = normalize(t.Requester?.fullname);
      const handler = normalize(t.Handler?.fullname ?? "unassigned");
      const title = normalize(t.title);
      const status = normalize(t.status);

      if (qRequester && !requester.includes(normalize(qRequester)))
        return false;
      if (qHandler && !handler.includes(normalize(qHandler))) return false;
      if (qTitle && !title.includes(normalize(qTitle))) return false;
      if (qStatus && !status.includes(normalize(qStatus))) return false;

      return true;
    });
  }, [tickets, qRequester, qHandler, qTitle, qStatus]);

  if (!tickets) return null;

  return (
    <section className="flex w-full flex-col gap-4 py-6 lg:gap-6">
      {/* Header Title */}
      <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:gap-6">
        <div>
          <h1 className="text-4xl font-medium">My Assigned Ticket List</h1>
          <p className="hidden lg:inline">
            These are the tickets you are currently handling with Taruna Anugrah
            Mandiri.
          </p>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <ExcelExport
            data={excelData ?? []}
            filename={`tam-tickets-${format(new Date(), "dd-MMMM-yyyy")}.xlsx`}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card grid gap-4 rounded-2xl border p-4 lg:grid-cols-4 lg:gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">Requester</p>
          <input
            value={qRequester}
            onChange={(e) => setQRequester(e.target.value)}
            placeholder="Search Requester..."
            className="bg-background focus:ring-primary/30 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Handler</p>
          <input
            value={qHandler}
            onChange={(e) => setQHandler(e.target.value)}
            placeholder="Search Handler..."
            className="bg-background focus:ring-primary/30 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Title</p>
          <input
            value={qTitle}
            onChange={(e) => setQTitle(e.target.value)}
            placeholder="Search Title..."
            className="bg-background focus:ring-primary/30 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Status</p>
          <input
            value={qStatus}
            onChange={(e) => setQStatus(e.target.value)}
            placeholder="Search Status..."
            className="bg-background focus:ring-primary/30 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </div>
      </div>

      {/* Result summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Showing{" "}
          <span className="text-foreground font-medium">
            {filteredTickets.length}
          </span>{" "}
          of{" "}
          <span className="text-foreground font-medium">{tickets.length}</span>{" "}
          tickets
        </p>
      </div>

      {/* Card grid */}
      {filteredTickets.length === 0 ? (
        <div className="bg-card rounded-2xl border p-10 text-center">
          <p className="text-lg font-semibold">No tickets found</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTickets.map((t) => (
            <TicketCard key={t.id} ticket={t} />
          ))}
        </div>
      )}
    </section>
  );
}
