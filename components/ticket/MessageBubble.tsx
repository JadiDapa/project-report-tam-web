import { TicketMessageType } from "@/lib/types/ticket-message";
import { format } from "date-fns";
import Image from "next/image";

export function MessageBubble({
  message,
  isCurrentUser,
  isSameSender,
  profileImage,
  requesterName,
}: {
  message: TicketMessageType;
  isCurrentUser: boolean;
  isSameSender: boolean;
  profileImage: string;
  requesterName: string;
}) {
  return (
    <div
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
            alt={requesterName}
            fill
            className="object-cover object-center"
          />
        </div>
      )}

      <div
        className={`w-fit max-w-[90%] rounded-lg px-4 py-3 ${
          isCurrentUser ? "bg-primary order-1" : "order-2 bg-sky-400"
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
          <p className="font-cereal-regular text-white">{message.content}</p>
          <p className="font-cereal-light self-end text-[10px] text-white">
            {format(message.createdAt, "HH:mm")}
          </p>
        </div>
      </div>
    </div>
  );
}
