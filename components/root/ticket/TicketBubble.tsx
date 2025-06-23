import React from "react";
import { TicketMessageType } from "@/lib/types/ticket-message";
import { AccountType } from "@/lib/types/account";
import Image from "next/image";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: TicketMessageType;
  account?: AccountType;
  isCurrentAccount: boolean;
  showAvatar: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  account,
  isCurrentAccount,
  showAvatar,
}) => {
  return (
    <div
      className={`flex items-end space-x-2 ${isCurrentAccount ? "justify-end" : "justify-start"}`}
    >
      {!isCurrentAccount && (
        <div className="h-8 w-8 flex-shrink-0">
          {showAvatar && account && (
            <div className="relative">
              <Image
                src={
                  account.image ||
                  "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                }
                alt={account.fullname}
                className="h-8 w-8 rounded-full object-cover"
              />
              {/* {account.isOnline && (
                <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
              )} */}
            </div>
          )}
        </div>
      )}

      <div
        className={`max-w-xs lg:max-w-md ${isCurrentAccount ? "order-1" : "order-2"}`}
      >
        {!isCurrentAccount && showAvatar && account && (
          <div className="mb-1 flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">
              {account.fullname}
            </span>
            <span className="text-xs text-gray-500">
              {format(message.createdAt, "HH:mm")}
            </span>
            {/* {message.isEdited && (
              <span className="text-xs text-gray-400">Edited</span>
            )} */}
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-2 ${
            isCurrentAccount
              ? "rounded-br-md bg-blue-600 text-white"
              : "rounded-bl-md border border-gray-200 bg-white text-gray-900"
          } shadow-sm`}
        >
          {message.type === "text" && (
            <p className="text-sm leading-relaxed">{message.content}</p>
          )}

          {/* {message.type === "image" && message.imageUrl && (
            <div className="overflow-hidden rounded-lg relative">
              <Image
                src={message.image || ""}
                alt="Shared image"
                className="h-auto max-w-full object-cover"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )} */}
        </div>

        {isCurrentAccount && (
          <div className="mt-1 flex items-center justify-end space-x-1">
            <span className="text-xs text-gray-500">
              {format(message.createdAt, "HH:mm")}
            </span>
            {/* {message.isEdited && (
              <span className="text-xs text-gray-400">Edited</span>
            )}
            <div className="ml-1">
              {message.isRead ? (
                <CheckCheck className="h-4 w-4 text-blue-500" />
              ) : (
                <Check className="h-4 w-4 text-gray-400" />
              )}
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
