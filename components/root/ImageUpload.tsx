"use client";

import {
  useState,
  useRef,
  useEffect,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  value?: string | File;
  onChange?: (file: File | null) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof value === "string") {
      setPreview(value);
    } else if (value instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setPreview(e.target.result as string);
      };
      reader.readAsDataURL(value);
      setFile(value);
    }
  }, [value]);

  const handleFiles = (fileList: FileList) => {
    const selectedFile = fileList[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      onChange?.(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setPreview(e.target.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) handleFiles(e.target.files);
  };

  const removeFile = () => {
    setFile(null);
    setPreview("");
    onChange?.(null); // if you want to clear from parent too
  };

  return (
    <div className="w-full space-y-4">
      <div
        className={`relative rounded-lg border-2 border-dashed p-6 transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="text-primary hover:text-primary/80 cursor-pointer font-medium">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={() => inputRef.current?.click()}
        variant="outline"
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        Select Image
      </Button>

      {preview && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">Uploaded Image</h3>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <div className="flex-shrink-0">
              <Image
                src={preview || "/placeholder.svg"}
                alt="Uploaded"
                width={40}
                height={40}
                className="h-10 w-10 rounded object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">
                {file?.name ?? "From server"}
              </p>
            </div>
            <Button
              onClick={removeFile}
              variant="ghost"
              size="sm"
              className="h-8 w-8 flex-shrink-0 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
