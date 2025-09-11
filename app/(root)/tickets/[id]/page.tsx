"use client";

import {
  createTicketMessage,
  getTicketById,
  updateTicket,
} from "@/lib/networks/ticket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CreateTicketMessageType,
  TicketMessageType,
} from "@/lib/types/ticket-message";
import { CreateTicketType } from "@/lib/types/ticket";
import { toast } from "sonner";
import { getAllAccounts } from "@/lib/networks/account";
import { socket } from "@/lib/socket/ticket-message";
import { useAccount } from "@/providers/AccountProvider";
import { ImagePreview } from "@/components/ticket/ImagePreview";
import { MessageInput } from "@/components/ticket/MessageInput";
import { ChatHeader } from "@/components/ticket/ChatHeader";
import { SystemMessage } from "@/components/ticket/SystemMessage";
import { MessageBubble } from "@/components/ticket/MessageBubble";

export default function TicketDetail() {
  const [messageText, setMessageText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleTicketUpdate = async (status: string, handlerId: number) => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (!ticket) {
    return <div>Loading...</div>;
  }

  const profileImage =
    ticket.Requester.image ??
    "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";

  return (
    <section className="relative flex h-[89vh] w-[105%] -translate-x-6 flex-col">
      {/* Header */}
      <ChatHeader ticket={ticket} onTicketUpdate={handleTicketUpdate} />

      {/* Message List */}
      <div className="flex-1 overflow-y-auto bg-white px-6 py-6">
        {messages.length > 0 ? (
          <div className="flex flex-col">
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isSameSender =
                prevMessage && prevMessage.Account.id === message.Account.id;
              const isCurrentUser = message.Account.id === account?.id;

              if (
                ["status-change", "assign-handler"].includes(message.type || "")
              ) {
                return (
                  <SystemMessage
                    key={message.id}
                    content={message.content}
                    type={message.type!}
                  />
                );
              }

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isCurrentUser={isCurrentUser}
                  isSameSender={!!isSameSender}
                  profileImage={profileImage}
                  requesterName={ticket.Requester.fullname}
                />
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
      {previewUrl && (
        <ImagePreview
          previewUrl={previewUrl}
          onRemove={() => {
            setSelectedImage(null);
            setPreviewUrl(null);
          }}
        />
      )}

      {/* Input */}
      <MessageInput
        messageText={messageText}
        setMessageText={setMessageText}
        handleSendMessage={handleSendMessage}
        handleImageChange={handleImageChange}
      />
    </section>
  );
}
