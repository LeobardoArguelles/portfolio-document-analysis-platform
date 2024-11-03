import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Download, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const CollapsibleSamples = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const sampleFiles = [
    {
      name: "Service Agreement.pdf",
      description: "Standard service agreement template",
      type: "PDF",
    },
    {
      name: "Non-Disclosure Agreement.pdf",
      description: "Confidentiality and NDA template",
      type: "PDF",
    },
    {
      name: "Employment Contract.pdf",
      description: "Standard employment agreement",
      type: "PDF",
    },
    {
      name: "License Agreement.pdf",
      description: "Software/content licensing template",
      type: "PDF",
    },
    {
      name: "Purchase Order.pdf",
      description: "Standard purchase order form",
      type: "PDF",
    },
  ];

  const handleDownload = (fileName: string) => {
    const fileUrl = `/sample-contracts/${fileName
      .toLowerCase()
      .replace(/ /g, "-")}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Need sample files for testing?
            </span>
          </div>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-transparent p-0 h-auto"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
              <span className="sr-only">Toggle sample files</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="px-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.2,
              opacity: { duration: 0.2 },
              y: { duration: 0.2 },
            }}
            className="py-4"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sampleFiles.map((file) => (
                <Card
                  key={file.name}
                  className="group hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {file.name}
                          </p>
                          <span className="text-xs text-muted-foreground ml-2">
                            {file.type}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {file.description}
                        </p>
                        <div className="flex items-center justify-end mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 group-hover:bg-primary group-hover:text-primary-foreground"
                            onClick={() => handleDownload(file.name)}
                          >
                            <Download className="h-3 w-3 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CollapsibleSamples;
