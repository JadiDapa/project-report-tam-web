import { X } from "lucide-react";
import Image from "next/image";

export function ImagePreview({
  previewUrl,
  onRemove,
}: {
  previewUrl: string;
  onRemove: () => void;
}) {
  return (
    <div className="absolute right-0 bottom-16 left-0 flex items-center gap-2 border-t bg-gray-100 p-2">
      <div className="relative h-20 w-20 overflow-hidden rounded-md border">
        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
      </div>
      <button
        onClick={onRemove}
        className="rounded-full bg-red-500 p-1 text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}
