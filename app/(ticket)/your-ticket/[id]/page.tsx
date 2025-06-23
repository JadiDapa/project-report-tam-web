"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { createTicketMessage, getTicketById } from "@/lib/networks/ticket";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Mic, PaperclipIcon, Search, Send } from "lucide-react";
import { format } from "date-fns";
import {
  CreateTicketMessageType,
  TicketMessageType,
} from "@/lib/types/ticket-message";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { socket } from "@/lib/socket/ticket-message";
import { useAccount } from "@/providers/AccountProvider";

export default function TicketDetail() {
  const [messageText, setMessageText] = useState("");

  const { id } = useParams();
  const queryClient = useQueryClient();
  const { account } = useAccount();

  const { data: ticket } = useQuery({
    queryFn: () => getTicketById(id as string),
    queryKey: ["tickets", id],
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
    mutationFn: (values: CreateTicketMessageType) =>
      createTicketMessage(ticket!.id.toString(), values),

    onError: (err) => {
      console.log(err);
      toast.error("Something went wrong!");
    },
  });

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: CreateTicketMessageType = {
      content: messageText,
      image: "",
      ticketId: ticket!.id,
      accountId: account!.id ?? 0,
      type: "message",
    };

    onCreateTicketMessage(newMessage, {
      onSuccess: (savedMessage) => {
        socket.emit("send_message", savedMessage);
        queryClient.invalidateQueries({ queryKey: ["tickets", id] });

        setMessageText("");
      },
      onError: () => {
        toast.error("Failed to send message.");
      },
    });
  };

  if (!ticket) {
    return <div>Loading...</div>;
  }

  return (
    <section className="relative flex h-screen w-full flex-col border">
      {/* Header - Fixed */}
      <div className="sticky top-0 z-10 flex justify-between border-b bg-white px-6 py-2">
        <div className="flex gap-6">
          <div className="relative size-10 overflow-hidden rounded-full border">
            <Image
              src={
                ticket.Requester.image
                  ? ticket.Requester.image
                  : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
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
          <Search className="size-6" />
        </div>
      </div>

      {/* Scrollable Messages */}
      <div className="flex-1 overflow-y-auto bg-white px-6 py-6">
        {messages?.length > 0 ? (
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
                    } ${isSameSender && isCurrentUser ? "mr-12" : ""} ${isSameSender && !isCurrentUser ? "ms-12" : ""}`}
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
                    <div className="flex items-end justify-between gap-12">
                      <p className="font-cereal-regular text-white">
                        {message.content}
                      </p>
                      <p className="font-cereal-light text-[10px] text-white">
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

      {/* Input Footer - Fixed */}
      <div className="bottom-0 z-10 flex items-center gap-6 border-t bg-white px-6 py-2">
        <PaperclipIcon strokeWidth={1.4} className="size-6" />
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
