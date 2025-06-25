import CreateTicketModal from "@/components/ticket/CreateTicketModal";
import { Ticket, User2Icon } from "lucide-react";

export default function YourTicket() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <h2 className="text-2xl font-semibold tracking-wide">
        Select Your Tickets Aside Or :
      </h2>
      <div className="flex gap-9">
        <CreateTicketModal>
          <div className="flex size-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-3 border-dashed border-sky-600 p-4 transition hover:scale-105">
            <Ticket
              className="size-16 -rotate-12 text-sky-600"
              strokeWidth={1.2}
            />
            <p className="text-center text-lg font-medium text-sky-600">
              Create New Ticket
            </p>
          </div>
        </CreateTicketModal>
        <div className="flex size-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-3 border-dashed border-slate-400 p-4 transition hover:scale-105">
          <User2Icon className="size-16 text-slate-600" strokeWidth={1.2} />
          <p className="text-center text-lg font-medium text-slate-600">
            Your Profile
          </p>
        </div>
      </div>
    </div>
  );
}
