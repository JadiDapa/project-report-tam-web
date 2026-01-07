"use client";

import React, { useState } from "react";
import { Upload, X, Download } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  createTaskEvidenceImage,
  deleteTaskEvidenceImage,
  updateTaskEvidenceImage,
} from "@/lib/networks/task-evidence-image";
import { CreateTaskEvidenceImageType } from "@/lib/types/task-evidence-image";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/providers/AccountProvider";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface UploadTaskEvidenceProps {
  uploadedEvidences: CreateTaskEvidenceImageType[];
  setUploadedEvidences: React.Dispatch<
    React.SetStateAction<CreateTaskEvidenceImageType[]>
  >;
  evidenceId: number;
  accountId?: number;
  taskId?: string | number;
}

export default function UploadTaskEvidence({
  uploadedEvidences,
  setUploadedEvidences,
  evidenceId,
  accountId,
  taskId = "",
}: UploadTaskEvidenceProps) {
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const { account } = useAccount();

  const isProjectManager = account?.Role?.Features?.some(
    (feature) => feature.name === "Manage Project",
  );

  // State for modal preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const values: CreateTaskEvidenceImageType = {
      image: file,
      taskEvidenceId: evidenceId,
      accountId,
    };

    setUploading(true);
    try {
      const response = await createTaskEvidenceImage(values);

      setUploadedEvidences((prev) => [...prev, response]);
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });

      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTaskEvidenceImage(id.toString());

      setUploadedEvidences((prev) => prev.filter((img) => img.id !== id));
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });

      toast.success("Image deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete image");
    }
  };

  const handleDownload = async (src: string) => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "evidence-image.jpg"; // filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download image");
    }
  };

  const handleSetIsExport = async (id: number, status?: boolean) => {
    try {
      await updateTaskEvidenceImage(id.toString(), {
        isExport: !status,
      });

      setUploadedEvidences((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, isExport: !status } : img,
        ),
      );

      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });

      toast.success(`Image export status updated`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update export status");
    }
  };

  return (
    <div className="space-y-4">
      {isProjectManager && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Evidence Images</h2>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            <div className="bg-primary inline-flex items-center rounded-md px-3 py-2 text-white">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </div>
          </label>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {uploadedEvidences.map((evidence) => {
          console.log(evidence);
          return (
            <div
              key={evidence.id}
              className="group relative h-52 w-full cursor-pointer overflow-hidden rounded border lg:size-52"
            >
              <Image
                src={evidence.image as string}
                alt="Evidence"
                width={128}
                height={128}
                unoptimized
                className="h-full w-full object-cover"
                onClick={() => setPreviewImage(evidence.image as string)}
              />
              {isProjectManager && (
                <button
                  onClick={() => {
                    const confirmed = confirm(
                      "Are you sure you want to delete this image?",
                    );
                    if (confirmed) {
                      handleDelete(evidence.id as number);
                    }
                  }}
                  className="absolute top-1 right-1 rounded-full bg-white p-1 shadow hover:bg-red-100"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              )}
              {isProjectManager && (
                <div className="absolute bottom-0 flex cursor-pointer items-center space-x-2 rounded-full bg-black/40 p-1 px-4">
                  <Checkbox
                    id={`isExport-${evidence.id}`}
                    checked={evidence.isExport}
                    onClick={() =>
                      handleSetIsExport(
                        evidence.id as number,
                        evidence.isExport,
                      )
                    }
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor={`isExport-${evidence.id}`}
                    className="cursor-pointer text-white"
                  >
                    Export Image
                  </Label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for preview */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="flex flex-col items-center gap-4">
              <div className="bg-muted relative h-[70vh] w-full border">
                <Image
                  src={previewImage}
                  alt="Preview"
                  unoptimized
                  fill
                  className="max-h-[70vh] w-auto rounded-md object-contain"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => handleDownload(previewImage)}
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
