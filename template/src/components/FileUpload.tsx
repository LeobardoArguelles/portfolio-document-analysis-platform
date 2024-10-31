"use client";

import React, { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  maxSize?: number; // in MB
  accept?: string;
  className?: string;
}

const FileUpload = ({
  onFileSelect,
  maxSize = 10,
  accept = "application/pdf",
  className,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelection = useCallback(
    (file: File) => {
      if (file && file.size <= maxSize * 1024 * 1024) {
        setSelectedFile(file);
        // Create object URL for PDF preview
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
        onFileSelect?.(file);
      }
    },
    [maxSize, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    },
    [handleFileSelection]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelection(file);
      }
    },
    [handleFileSelection]
  );

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <Card
          className={cn(
            "mt-2 border-2 border-dashed transition-colors duration-200",
            "border-border dark:border-border-dark",
            isDragging && "border-primary dark:border-primary-light",
            className
          )}
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="flex justify-center px-6 py-10"
          >
            <div className="text-center">
              <Upload
                className={cn(
                  "mx-auto h-12 w-12 transition-colors duration-200",
                  "text-secondary dark:text-secondary-light",
                  isDragging && "text-primary dark:text-primary-light"
                )}
                aria-hidden="true"
              />
              <div className="mt-4 flex text-sm/6">
                <label
                  htmlFor="file-upload"
                  className={cn(
                    "relative cursor-pointer rounded-md font-semibold",
                    "text-primary hover:text-primary-light dark:text-primary-light dark:hover:text-primary",
                    "focus-within:outline-none focus-within:ring-2 focus-within:ring-primary dark:focus-within:ring-primary-light focus-within:ring-offset-2"
                  )}
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1 text-text-light dark:text-text-dark-light">
                  or drag and drop
                </p>
              </div>
              <p className="mt-1 text-xs text-text-light dark:text-text-dark-light">
                PDF up to {maxSize}MB
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {previewUrl && (
            <div className="mt-4 border rounded-lg">
              <iframe
                src={previewUrl}
                className="w-full h-[500px] rounded-lg"
                title="PDF Preview"
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default FileUpload;
