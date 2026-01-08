import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import {
  CreateTaskEvidenceImageType,
  TaskEvidenceImageType,
} from "@/lib/types/task-evidence-image";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Download } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ImagePreviewModalProps {
  previewImage: CreateTaskEvidenceImageType | null;
  setPreviewImage: React.Dispatch<
    React.SetStateAction<TaskEvidenceImageType | null>
  >;
  handleDownload: (url: string) => void;
}

export default function ImagePreviewModal({
  previewImage,
  setPreviewImage,
  handleDownload,
}: ImagePreviewModalProps) {
  return (
    <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Image Preview</DialogTitle>
        </DialogHeader>
        {previewImage && (
          <div className="">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-muted relative h-[70vh] w-full border">
                <Image
                  src={previewImage.image}
                  alt="Preview"
                  unoptimized
                  fill
                  className="max-h-[70vh] w-auto rounded-md object-contain"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => handleDownload(previewImage.image)}
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
            <div className=""></div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
