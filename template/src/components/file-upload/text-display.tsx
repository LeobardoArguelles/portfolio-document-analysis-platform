"use client";

import React from "react";
import { Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TextDisplayProps {
  text: string;
  onCopy: () => void;
}

export const TextDisplay = ({ text, onCopy }: TextDisplayProps) => (
  <Card className="p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-medium">Extracted Text</h3>
      <Button
        variant="outline"
        size="sm"
        onClick={onCopy}
        className="flex items-center space-x-1"
      >
        <Copy className="h-4 w-4" />
        <span>Copy</span>
      </Button>
    </div>
    <div className="max-h-96 overflow-y-auto rounded border p-3 bg-muted/50">
      <pre className="text-sm whitespace-pre-wrap">{text}</pre>
    </div>
  </Card>
);
