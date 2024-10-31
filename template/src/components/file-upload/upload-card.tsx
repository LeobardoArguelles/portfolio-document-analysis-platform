"use client";

import React from "react";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UploadCardProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  maxSize: number;
  className?: string;
}

export const UploadCard = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  accept,
  maxSize,
  className,
}: UploadCardProps) => (
  <Card
    className={cn(
      "mt-2 border-2 border-dashed transition-colors duration-200",
      "border-border dark:border-border-dark",
      isDragging && "border-primary dark:border-primary-light",
      className
    )}
  >
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
              onChange={onFileChange}
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
);
