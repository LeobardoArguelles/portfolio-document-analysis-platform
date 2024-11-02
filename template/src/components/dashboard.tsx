import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  DollarSign,
  Scale,
  AlertTriangle,
  Users,
} from "lucide-react";

type Signatory = {
  name: string;
  title: string;
};

type ContractValue = {
  amount: number;
  currency: string;
};

type Obligation = {
  party: string;
  commitment: string;
};

type GoverningLaw = {
  jurisdiction: string;
  applicableLaw: string;
};

type NonStandardClause = {
  clause: string;
  explanation: string;
};

type UnusualTerm = {
  term: string;
  concern: string;
};

type ContractClassification =
  | "SERVICE_AGREEMENT"
  | "NDA"
  | "EMPLOYMENT_CONTRACT"
  | "LICENSE_AGREEMENT"
  | "PURCHASE_ORDER";

interface ContractData {
  keyElements: {
    parties: {
      companies: string[];
      signatories: Signatory[];
    };
    dates: {
      effectiveDate: string;
      terminationDate: string;
      renewalDates: string[];
    };
    financial: {
      contractValue: ContractValue;
      paymentTerms: string;
    };
    obligations: Obligation[];
    governingLaw: GoverningLaw;
  };
  riskAnalysis: {
    nonStandardClauses: NonStandardClause[];
    missingClauses: string[];
    unusualTerms: UnusualTerm[];
  };
  classification: ContractClassification;
}

interface ContractAnalysisViewProps {
  data: ContractData;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

const ContractAnalysisView: React.FC<ContractAnalysisViewProps> = ({
  data,
}) => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with Classification */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contract Analysis</h1>
        <Badge variant="outline" className="text-lg px-4 py-1">
          {data.classification.replace("_", " ")}
        </Badge>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="key-elements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="key-elements">Key Elements</TabsTrigger>
          <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
        </TabsList>

        {/* Key Elements Tab */}
        <TabsContent value="key-elements" className="space-y-4">
          {/* Parties Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Companies</h3>
                <ul className="list-disc list-inside">
                  {data.keyElements.parties.companies.map(
                    (company: string, idx: number) => (
                      <li key={idx}>{company}</li>
                    )
                  )}
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Signatories</h3>
                {data.keyElements.parties.signatories.map(
                  (signatory: Signatory, idx: number) => (
                    <div key={idx} className="text-sm">
                      {signatory.name} - {signatory.title}
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dates Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold">Effective Date</p>
                <p>{formatDate(data.keyElements.dates.effectiveDate)}</p>
              </div>
              <div>
                <p className="font-semibold">Termination Date</p>
                <p>{formatDate(data.keyElements.dates.terminationDate)}</p>
              </div>
              <div>
                <p className="font-semibold">Renewal Dates</p>
                <ul className="list-disc list-inside">
                  {data.keyElements.dates.renewalDates.map(
                    (date: string, idx: number) => (
                      <li key={idx}>{formatDate(date)}</li>
                    )
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Financial Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Contract Value</p>
                <p className="text-2xl">
                  {data.keyElements.financial.contractValue.amount}{" "}
                  {data.keyElements.financial.contractValue.currency}
                </p>
              </div>
              <div>
                <p className="font-semibold">Payment Terms</p>
                <p>{data.keyElements.financial.paymentTerms}</p>
              </div>
            </CardContent>
          </Card>

          {/* Law Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Jurisdiction</p>
                <p>{data.keyElements.governingLaw.jurisdiction}</p>
              </div>
              <div>
                <p className="font-semibold">Applicable Law</p>
                <p>{data.keyElements.governingLaw.applicableLaw}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {data.riskAnalysis.nonStandardClauses.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Non-Standard Clauses</h3>
                      {data.riskAnalysis.nonStandardClauses.map(
                        (clause: NonStandardClause, idx: number) => (
                          <Alert key={idx}>
                            <AlertDescription>
                              <span className="font-semibold">
                                {clause.clause}
                              </span>
                              <p className="mt-1 text-sm">
                                {clause.explanation}
                              </p>
                            </AlertDescription>
                          </Alert>
                        )
                      )}
                    </div>
                  )}

                  {data.riskAnalysis.missingClauses.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Missing Clauses</h3>
                      <ul className="list-disc list-inside">
                        {data.riskAnalysis.missingClauses.map(
                          (clause: string, idx: number) => (
                            <li key={idx}>{clause}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {data.riskAnalysis.unusualTerms.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Unusual Terms</h3>
                      {data.riskAnalysis.unusualTerms.map(
                        (term: UnusualTerm, idx: number) => (
                          <Alert key={idx}>
                            <AlertDescription>
                              <span className="font-semibold">{term.term}</span>
                              <p className="mt-1 text-sm">{term.concern}</p>
                            </AlertDescription>
                          </Alert>
                        )
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractAnalysisView;
