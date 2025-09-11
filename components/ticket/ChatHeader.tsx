import { TicketType } from "@/lib/types/ticket";
import { Info, Search } from "lucide-react";
import Image from "next/image";
import TicketInfoSheet from "../root/ticket/TicketInfoSheet";

export function ChatHeader({
  ticket,
  onTicketUpdate,
}: {
  ticket: TicketType;
  onTicketUpdate: (status: string, handlerId: number) => Promise<void>;
}) {
  return (
    <div className="sticky top-0 z-10 flex justify-between border-b bg-white px-6 py-2">
      <div className="flex gap-6">
        <div className="relative size-10 overflow-hidden rounded-full border">
          <Image
            src={
              ticket.Requester.image ||
              "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
            }
            alt={ticket.Requester.fullname}
            fill
            className="object-cover object-center"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{ticket.title}</h2>
          <p className="font-medium">
            Requested By: {ticket.Requester.fullname}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {
          <TicketInfoSheet ticket={ticket} onTicketUpdate={onTicketUpdate}>
            <Info className="size-6" />
          </TicketInfoSheet>
        }
        <Search className="size-6" />
      </div>
    </div>
  );
}
