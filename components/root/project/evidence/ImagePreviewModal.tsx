import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { updateTaskEvidenceImage } from "@/lib/networks/task-evidence-image";
import { CreateTaskType } from "@/lib/types/task";
import {
  CreateTaskEvidenceImageType,
  TaskEvidenceImageType,
} from "@/lib/types/task-evidence-image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ImagePreviewModalProps {
  previewImage: CreateTaskEvidenceImageType | null;
  setPreviewImage: React.Dispatch<
    React.SetStateAction<TaskEvidenceImageType | null>
  >;
  handleDownload: (url: string) => void;
}

const evidenceImageSchema = z.object({
  date: z.date(),
  latitude: z.string().min(1, "Image Must Be Filled"),
  longitude: z.string().min(1, "Image Must Be Filled"),
});

export default function ImagePreviewModal({
  previewImage,
  setPreviewImage,
  handleDownload,
}: ImagePreviewModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof evidenceImageSchema>>({
    resolver: zodResolver(evidenceImageSchema),
    values: {
      date: "",
      latitude: "",
      longitude: "",
    },
  });

  const { mutateAsync: onUpdateImage, isPending } = useMutation({
    mutationFn: (values: CreateTaskType) => updateTaskEvidenceImage(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task successfully created!");
    },
    onError: () => {
      toast.error("Something went wrong creating the task data!");
    },
  });

  async function onSubmit(values: z.infer<typeof evidenceImageSchema>) {
    try {
      await onUpdateImage({
        image: "new uploaded ",
        date: "",
        latitude: "",
        longitude: "",
      });
    } catch (err) {
      console.error("Task creation failed", err);
    }
  }
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
