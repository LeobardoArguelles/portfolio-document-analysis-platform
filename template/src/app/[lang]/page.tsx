"use client";

import { useState } from "react";
import FileUpload from "@/components/file-upload/file-upload";
import ContractAnalysisView from "@/components/dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileQuestion } from "lucide-react";

// Type for the contract data
interface ContractData {
  keyElements: {
    parties: {
      companies: string[];
      signatories: {
        name: string;
        title: string;
      }[];
    };
    dates: {
      effectiveDate: string;
      terminationDate: string;
      renewalDates: string[];
    };
    financial: {
      contractValue: {
        amount: number;
        currency: string;
      };
      paymentTerms: string;
    };
    obligations: {
      party: string;
      commitment: string;
    }[];
    governingLaw: {
      jurisdiction: string;
      applicableLaw: string;
    };
  };
  riskAnalysis: {
    nonStandardClauses: {
      clause: string;
      explanation: string;
    }[];
    missingClauses: string[];
    unusualTerms: {
      term: string;
      concern: string;
    }[];
  };
  classification:
    | "SERVICE_AGREEMENT"
    | "NDA"
    | "EMPLOYMENT_CONTRACT"
    | "LICENSE_AGREEMENT"
    | "PURCHASE_ORDER";
}

export default function Home() {
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [error, setError] = useState<string>("");

  const isValidContractType = (
    type: string
  ): type is ContractData["classification"] => {
    return [
      "SERVICE_AGREEMENT",
      "NDA",
      "EMPLOYMENT_CONTRACT",
      "LICENSE_AGREEMENT",
      "PURCHASE_ORDER",
    ].includes(type);
  };

  const handleProcessedText = (processedData: any) => {
    console.log("Processed data:", processedData);
    try {
      // Validate that the processed data matches our expected structure
      if (
        !processedData.keyElements ||
        !processedData.riskAnalysis ||
        !processedData.classification
      ) {
        throw new Error("Invalid contract data format");
      }

      setContractData(processedData as ContractData);
      setError("");
    } catch (err) {
      setError(
        "Failed to parse contract data. Please ensure the file contains valid contract information."
      );
      console.error("Error parsing contract data:", err);
    }
  };

  return (
    <main className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Contract Analysis Tool
      </h1>

      <FileUpload
        onFileSelect={(file) => console.log("File selected:", file)}
        onTextProcessed={(processedData) => {
          console.log("Processed text:", processedData);
          console.log("Type of processed text:", typeof processedData);
          try {
            // Parse the JSON string if it's not already an object
            const data =
              typeof processedData === "string"
                ? JSON.parse(processedData)
                : processedData;

            handleProcessedText(data);
          } catch (err) {
            setError(
              "Failed to parse the processed text. Please ensure the file contains valid JSON."
            );
            console.error("Error parsing JSON:", err);
          }
        }}
      />

      {error && (
        <Card className="p-4 border-destructive">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {contractData ? (
        <div className="mt-8">
          {isValidContractType(contractData.classification) ? (
            <ContractAnalysisView data={contractData} />
          ) : (
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileQuestion className="h-6 w-6" />
                  Unrecognized Contract Type
                </CardTitle>
                <CardDescription>
                  This contract type could not be automatically classified.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTitle>Manual Review Required</AlertTitle>
                  <AlertDescription>
                    This contract requires manual review by a legal
                    professional. The system was unable to confidently classify
                    its type.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </main>
  );
}
