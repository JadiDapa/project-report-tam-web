import { Mic, PaperclipIcon, Send } from "lucide-react";
import { Input } from "../ui/input";

export function MessageInput({
  messageText,
  setMessageText,
  handleSendMessage,
  handleImageChange,
}: {
  messageText: string;
  setMessageText: (val: string) => void;
  handleSendMessage: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="bottom-0 z-10 flex items-center gap-3 border-t bg-white px-6 py-2">
      <label className="cursor-pointer">
        <PaperclipIcon strokeWidth={1.4} className="size-6" />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>

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
  );
}
