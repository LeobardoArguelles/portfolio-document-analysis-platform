"use client";

import React from "react";
import { FileText, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FileCardProps {
  fileName: string;
  fileSize: number;
  onRemove: () => void;
}

export const FileCard = ({ fileName, fileSize, onRemove }: FileCardProps) => (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <p className="text-sm font-medium">{fileName}</p>
          <p className="text-xs text-muted-foreground">
            {(fileSize / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  </Card>
);

