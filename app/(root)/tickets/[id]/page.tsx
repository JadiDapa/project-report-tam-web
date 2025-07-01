"use client";

import {
  createTicketMessage,
  getTicketById,
  updateTicket,
} from "@/lib/networks/ticket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Info, Mic, PaperclipIcon, Search, Send, XIcon } from "lucide-react";
import { format } from "date-fns";
import {
  CreateTicketMessageType,
  TicketMessageType,
} from "@/lib/types/ticket-message";
import { Input } from "@/components/ui/input";
import TicketInfoSheet from "@/components/root/ticket/TicketInfoSheet";
import { CreateTicketType } from "@/lib/types/ticket";
import { toast } from "sonner";
import { getAllAccounts } from "@/lib/networks/account";
import { socket } from "@/lib/socket/ticket-message";
import { useAccount } from "@/providers/AccountProvider";

export default function TicketDetail() {
  const [messageText, setMessageText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { id } = useParams();
  const queryClient = useQueryClient();
  const { account } = useAccount();

  const { data: ticket } = useQuery({
    queryFn: () => getTicketById(id as string),
    queryKey: ["tickets", id],
  });

  const { data: accounts } = useQuery({
    queryFn: getAllAccounts,
    queryKey: ["accounts"],
  });

  const [messages, setMessages] = useState<TicketMessageType[]>([]);

  useEffect(() => {
    if (ticket?.TicketMessages) {
      setMessages(ticket.TicketMessages);
    }
  }, [ticket]);

  useEffect(() => {
    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("new_message");
    };
  }, []);

  const { mutate: onCreateTicketMessage } = useMutation({
    mutationFn: async (values: CreateTicketMessageType) =>
      createTicketMessage(ticket!.id.toString(), values),
    onSuccess: (savedMessage) => {
      socket.emit("send_message", savedMessage);
      queryClient.invalidateQueries({ queryKey: ["tickets", id] });
      setMessageText("");
      setSelectedImage(null);
    },
    onError: () => {
      toast.error("Failed to send message.");
    },
  });

  const { mutateAsync: updateTicketMutation } = useMutation({
    mutationFn: (values: Partial<CreateTicketType>) =>
      updateTicket(ticket!.id.toString(), values),
    onSuccess: () => {
      toast.success("Ticket successfully updated!");
      queryClient.invalidateQueries({ queryKey: ["tickets", id] });
    },
    onError: (err) => {
      console.log(err);
      toast.error("Something went wrong!");
    },
  });

  const handleSendMessage = () => {
    if (!messageText.trim() && !selectedImage) return;

    const newMessage: CreateTicketMessageType = {
      content: messageText,
      image: selectedImage ?? "",
      ticketId: ticket!.id,
      accountId: account!.id ?? 0,
      type: "message",
    };

    onCreateTicketMessage(newMessage);
  };

  const onTicketUpdate = async (status: string, handlerId: number) => {
    const oldStatus = ticket!.status;
    const oldHandlerId = ticket!.handler;

    const statusChanged = oldStatus !== status;
    const handlerChanged = oldHandlerId !== handlerId;

    try {
      if (!statusChanged && !handlerChanged) return;

      await updateTicketMutation({
        handler: handlerId !== 0 ? handlerId : undefined,
        status: status ? status : undefined,
      });

      const messages: CreateTicketMessageType[] = [];

      if (handlerChanged) {
        const handlerAccount = accounts?.find((acc) => acc.id === handlerId);
        const handlerName = handlerAccount?.fullname || "Unknown";

        messages.push({
          content: `${handlerName} Assigned As Handler`,
          image: "",
          ticketId: ticket!.id,
          accountId: account!.id ?? 0,
          type: "assign-handler",
        });
      }

      if (statusChanged) {
        messages.push({
          content: `Ticket Status updated from "${oldStatus}" to "${status}"`,
          image: "",
          ticketId: ticket!.id,
          accountId: account?.id ?? 0,
          type: "status-change",
        });
      }

      for (const msg of messages) {
        onCreateTicketMessage(msg);
      }
    } catch (err) {
      console.error("Update failed:", err);
      throw err;
    }
  };

  if (!ticket) {
    return <div>Loading...</div>;
  }

  return (
    <section className="relative flex h-[89vh] w-[105%] -translate-x-6 flex-col">
      {/* Header */}
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
          <TicketInfoSheet ticket={ticket} onTicketUpdate={onTicketUpdate}>
            <Info className="size-6" />
          </TicketInfoSheet>
          <Search className="size-6" />
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto bg-white px-6 py-6">
        {messages.length > 0 ? (
          <div className="flex flex-col">
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isSameSender =
                prevMessage && prevMessage.Account.id === message.Account.id;
              const isCurrentUser = message.Account.id === account?.id;

              const profileImage =
                ticket.Requester.image ||
                "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";

              if (
                ["status-change", "assign-handler"].includes(message.type || "")
              ) {
                const textColor =
                  message.type === "assign-handler"
                    ? "text-primary"
                    : "text-slate-400";
                return (
                  <div key={message.id}>
                    <p
                      className={`font-cereal-medium py-4 text-center capitalize ${textColor}`}
                    >
                      --- {message.content} ---
                    </p>
                  </div>
                );
              }

              return (
                <div
                  key={message.id}
                  className={`flex w-fit max-w-[90%] gap-2 rounded-lg ${
                    isCurrentUser ? "self-end" : "self-start"
                  } ${isSameSender ? "mt-1" : "mt-6"}`}
                >
                  {!isSameSender && (
                    <div
                      className={`relative size-10 overflow-hidden rounded-full border ${
                        isCurrentUser ? "order-2" : "order-1"
                      }`}
                    >
                      <Image
                        src={profileImage}
                        alt={ticket.Requester.fullname}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  )}

                  <div
                    className={`w-fit max-w-[90%] rounded-lg px-4 py-3 ${
                      isCurrentUser
                        ? "bg-primary order-1"
                        : "order-2 bg-sky-400"
                    } ${isSameSender && isCurrentUser ? "mr-12" : ""} ${
                      isSameSender && !isCurrentUser ? "ms-12" : ""
                    }`}
                  >
                    {!isSameSender && (
                      <div className="mb-2 flex flex-row items-center justify-between gap-16">
                        <p className="font-cereal-medium text-white">
                          {message.Account.fullname}
                        </p>
                        <div className="rounded-full bg-white px-4 py-[1px]">
                          <p className="font-cereal-light text-xs text-slate-400">
                            {message.Account.Role.name}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <p className="font-cereal-regular text-white">
                        {message.content}
                      </p>

                      {message.image && (
                        <Image
                          src={
                            typeof message.image === "string"
                              ? message.image
                              : URL.createObjectURL(message.image)
                          }
                          alt="Attached"
                          width={250}
                          height={250}
                          className="rounded-md"
                        />
                      )}
                      <p className="font-cereal-light self-end text-[10px] text-white">
                        {format(message.createdAt, "HH:mm")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="font-cereal-medium text-center text-slate-400">
            --- No Messages Found ---
          </p>
        )}
      </div>

      {/* Footer */}
      {selectedImage && (
        <div className="flex items-center gap-2 px-6 py-2">
          <Image
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            width={200}
            height={200}
            className="rounded"
          />
          <XIcon
            className="cursor-pointer"
            onClick={() => setSelectedImage(null)}
          />
        </div>
      )}

      <div className="bottom-0 z-10 flex items-center gap-6 border-t bg-white px-6 py-2">
        <div className="relative">
          <PaperclipIcon strokeWidth={1.4} className="size-6 cursor-pointer" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setSelectedImage(file);
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>

        <Input
          placeholder="Your Message"
          className="flex-1 border-none shadow-none focus-visible:ring-0"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />

        <div className="flex gap-2">
          <Mic strokeWidth={1.4} className="size-6" />
          <Send
            strokeWidth={1.4}
            className="size-6 cursor-pointer"
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </section>
  );
}
