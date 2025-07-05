"use client";

import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  createTaskEvidenceImage,
  deleteTaskEvidenceImage,
} from "@/lib/networks/task-evidence-image";
import { CreateTaskEvidenceImageType } from "@/lib/types/task-evidence-image";
import { useQueryClient } from "@tanstack/react-query";

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

  return (
    <div className="space-y-4">
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

      <div className="flex flex-wrap gap-4">
        {uploadedEvidences.map((evidence) => (
          <div
            key={evidence.id}
            className="group relative h-32 w-32 overflow-hidden rounded border"
          >
            <Image
              src={evidence.image as string}
              alt="Evidence"
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() =>
                evidence.id !== undefined && handleDelete(evidence.id)
              }
              className="absolute top-1 right-1 rounded-full bg-white p-1 shadow hover:bg-red-100"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
