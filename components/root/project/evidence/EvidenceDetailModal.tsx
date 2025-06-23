"use client";

import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateTaskEvidence } from "@/lib/networks/task-evidence";
import {
  CreateTaskEvidenceType,
  TaskEvidenceType,
} from "@/lib/types/task-evidence";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ImageUploader from "../../ImageUpload";
import { Calendar, User } from "lucide-react";

interface EvidenceDetailModalProps {
  children: React.ReactNode;
  evidence: TaskEvidenceType;
}

export default function EvidenceDetailModal({
  children,
  evidence,
}: EvidenceDetailModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedEvidence, setUploadedEvidence] = useState<string | File>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (evidence?.image) {
      setUploadedEvidence(evidence.image);
    }
  }, [evidence]);

  const { mutate: onCreateTaskEvidence } = useMutation({
    mutationFn: (values: CreateTaskEvidenceType) =>
      updateTaskEvidence(evidence!.id.toString(), values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidences", evidence.id] });
      queryClient.invalidateQueries({
        queryKey: ["tasks", evidence?.taskId],
      });

      toast.success("Task Evidence Successfully Updated!");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Task Evidence Update Failed!");
    },
  });

  const onSubmit = () => {
    onCreateTaskEvidence({
      accountId: 1,
      image: uploadedEvidence,
      taskId: Number(evidence?.taskId),
      description: evidence?.description,
    });

    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Task Evidence
          </DialogTitle>
          <div className="">
            <p className="text-primary text-xl font-medium capitalize">
              {evidence.description}
            </p>
            <div className="mt-2 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="text-primary size-4" />
                <p className="font-medium"> {"Mi"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-primary size-4" />
                <p className="font-medium">
                  {format(new Date(), "dd MMMM, yyyy")}
                </p>
              </div>
            </div>
            {evidence.image ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-md border-3 border-dashed border-slate-300">
                <Image
                  src={evidence.image as string}
                  alt="Logo"
                  fill
                  className="object-contain object-center"
                />
              </div>
            ) : (
              <div>
                <ImageUploader
                  value={uploadedEvidence}
                  onChange={setUploadedEvidence}
                />
                <Button onClick={onSubmit} className="mt-4 w-full">
                  Upload Image
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
