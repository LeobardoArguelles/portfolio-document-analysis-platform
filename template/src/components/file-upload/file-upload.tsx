"use client";

import React, { useCallback, useState } from "react";
import { UploadCard } from "./upload-card";
import { FileCard } from "./file-card";
import { TextDisplay } from "./text-display";
import { Card } from "@/components/ui/card";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onTextExtracted?: (text: string) => void;
  onTextProcessed?: (data: any) => void;
  maxSize?: number;
  accept?: string;
  className?: string;
}

const FileUpload = ({
  onFileSelect,
  onTextExtracted,
  onTextProcessed,
  maxSize = 10,
  accept = "application/pdf",
  className,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [processedData, setProcessedData] = useState<any>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");

  const processExtractedText = async (text: string) => {
    try {
      setIsProcessing(true);
      setError("");

      const response = await fetch("/api/process-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setProcessedData(data);
      onTextProcessed?.(data); // Call callback with processed data
      return data;
    } catch (err) {
      console.error("Error processing text:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process extracted text. Please try again."
      );
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const extractTextFromPDF = async (file: File) => {
    try {
      setIsExtracting(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      // Store the extracted text
      setExtractedText(data.text);
      onTextExtracted?.(data.text);

      // Process the extracted text
      const processedResult = await processExtractedText(data.text);
    } catch (err) {
      console.error("Error extracting text:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to extract text from PDF. Please try again."
      );
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelection = useCallback(
    async (file: File) => {
      if (file && file.size <= maxSize * 1024 * 1024) {
        setSelectedFile(file);
        onFileSelect?.(file);
        await extractTextFromPDF(file);
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
    setExtractedText("");
    setError("");
  }, []);

  const handleCopyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }, [extractedText]);

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <UploadCard
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileChange={handleFileChange}
          accept={accept}
          maxSize={maxSize}
          className={className}
        />
      ) : (
        <div className="space-y-4">
          <FileCard
            fileName={selectedFile.name}
            fileSize={selectedFile.size}
            onRemove={handleRemoveFile}
          />

          {isExtracting || isProcessing ? (
            <Card className="p-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">
                  {isExtracting ? "Extracting text..." : "Processing text..."}
                </p>
              </div>
            </Card>
          ) : error ? (
            <Card className="p-4 border-destructive">
              <p className="text-sm text-destructive">{error}</p>
            </Card>
          ) : (
            extractedText && (
              <TextDisplay text={extractedText} onCopy={handleCopyText} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
