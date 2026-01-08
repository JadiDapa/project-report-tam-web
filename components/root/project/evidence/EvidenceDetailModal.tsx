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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ImageUploader from "../../ImageUpload";
import { Calendar, Send, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAccount } from "@/providers/AccountProvider";
import { CreateTaskEvidenceImageType } from "@/lib/types/task-evidence-image";

interface EvidenceDetailModalProps {
  children: React.ReactNode;
  evidence: TaskEvidenceType;
  taskId: string | number;
}

export default function EvidenceDetailModal({
  children,
  evidence,
  taskId,
}: EvidenceDetailModalProps) {
  const [detail, setDetail] = useState<string>("");
  const [createEvidence, setCreateEvidence] = useState<boolean>(false);
  const [uploadedEvidences, setUploadedEvidences] = useState<
    CreateTaskEvidenceImageType[]
  >([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { account } = useAccount();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      evidence?.TaskEvidenceImages &&
      evidence.TaskEvidenceImages.length > 0
    ) {
      setUploadedEvidences(
        evidence.TaskEvidenceImages.map((image) => ({
          id: image.id,
          baseImage: image.baseImage,
          image: image.image,
          taskEvidenceId: image.taskEvidenceId,
          accountId: image.accountId,
          isExport: image.isExport,
          latitude: image.latitude,
          longitude: image.longitude,
          date: image.date,
          description: image.description,
        })),
      );
    }

    if (evidence?.description) {
      setDetail(evidence.description);
    }
  }, [evidence]);

  const { mutate: onUpdateTaskEvidence } = useMutation({
    mutationFn: (values: CreateTaskEvidenceType) =>
      updateTaskEvidence(evidence!.id.toString(), values),
    onSuccess: () => {
      toast.success("Task Evidence Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
      setCreateEvidence(false);
      setDetail("");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Failed to create Task Evidence");
    },
  });

  const isProjectManager = account?.Role?.Features?.some(
    (feature) => feature.name === "Manage Project",
  );

  const onSubmit = () => {
    onUpdateTaskEvidence({
      title: evidence?.title ?? "",
      taskId: Number(evidence?.taskId),
      description: detail,
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto lg:min-w-[50vw]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            <div className="flex items-center justify-between">
              <p>Task Evidence</p>
            </div>
          </DialogTitle>
          <div className="">
            <p className="text-primary text-xl font-medium capitalize">
              {evidence.title}
            </p>
            <div className="mt-2 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="text-primary size-4" />
                <p className="font-medium"> {"User"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-primary size-4" />
                <p className="font-medium">
                  {format(new Date(), "dd MMMM, yyyy")}
                </p>
              </div>
            </div>
            {createEvidence ? (
              <div className="relative mt-3 flex gap-3 bg-white">
                <div className="flex-1">
                  <Input
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    className="flex-1"
                    placeholder="Add a description for this evidence..."
                  />
                </div>

                <div
                  onClick={() => onSubmit()}
                  className="bg-primary justify-center rounded-md px-2"
                >
                  <Send className="" color={"#fff"} />
                </div>
              </div>
            ) : (
              <div className="mt-3 flex items-end justify-between bg-white">
                <div>
                  <p className="font-cereal-medium font-semibold text-slate-600">
                    Description
                  </p>
                  <p className="font-cereal-regular text-sm text-slate-600">
                    {evidence.description || "No Description Provided"}
                  </p>
                </div>

                {isProjectManager && (
                  <div
                    onClick={() => setCreateEvidence(true)}
                    className="bg-primary justify-center rounded-md px-2 py-1"
                  >
                    <p className="font-cereal-regular text-sm text-white">
                      {evidence.description
                        ? "Edit Description"
                        : "Add Description"}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4">
              <ImageUploader
                uploadedEvidences={uploadedEvidences}
                setUploadedEvidences={setUploadedEvidences}
                evidenceId={evidence.id}
                taskId={taskId}
              />
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
