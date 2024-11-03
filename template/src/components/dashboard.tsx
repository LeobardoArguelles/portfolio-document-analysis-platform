import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  DollarSign,
  Scale,
  AlertTriangle,
  Users,
  FileQuestion,
  Shield,
  Briefcase,
  FileText,
  ShoppingCart,
} from "lucide-react";

type ContractData = {
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
      terminationDate?: string;
      renewalDates: string[];
    };
    financial?: {
      // Optional for some contract types
      contractValue?: {
        amount: number;
        currency: string;
      };
      paymentTerms?: string;
    };
    obligations?: {
      // Optional for some contract types
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
};

interface ContractAnalysisViewProps {
  data: ContractData;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

const ContractTypeIcon = ({
  type,
}: {
  type: ContractData["classification"];
}) => {
  const icons = {
    SERVICE_AGREEMENT: Briefcase,
    NDA: Shield,
    EMPLOYMENT_CONTRACT: Users,
    LICENSE_AGREEMENT: FileText,
    PURCHASE_ORDER: ShoppingCart,
  };

  const Icon = icons[type] || FileQuestion;
  return <Icon className="h-6 w-6" />;
};

const getContractHighlights = (data: ContractData) => {
  const common = {
    parties: data.keyElements.parties.companies.join(", "),
    effectiveDate: formatDate(data.keyElements.dates.effectiveDate),
    jurisdiction: data.keyElements.governingLaw.jurisdiction,
  };

  const highlights = {
    SERVICE_AGREEMENT: {
      title: "Service Agreement Details",
      description: "Key service delivery terms and conditions",
      keyPoints: [
        {
          label: "Service Value",
          value: data.keyElements.financial?.contractValue
            ? `${data.keyElements.financial.contractValue.amount} ${data.keyElements.financial.contractValue.currency}`
            : "Not specified",
        },
        {
          label: "Payment Terms",
          value: data.keyElements.financial?.paymentTerms || "Not specified",
        },
        {
          label: "Duration",
          value: `From ${common.effectiveDate} to ${
            data.keyElements.dates.terminationDate &&
            formatDate(data.keyElements.dates.terminationDate)
          }`,
        },
      ],
    },
    NDA: {
      title: "Non-Disclosure Agreement",
      description: "Confidentiality and information protection terms",
      keyPoints: [
        {
          label: "Parties Bound",
          value: common.parties,
        },
        {
          label: "Jurisdiction",
          value: common.jurisdiction,
        },
        {
          label: "Effective Date",
          value: common.effectiveDate,
        },
      ],
    },
    EMPLOYMENT_CONTRACT: {
      title: "Employment Contract",
      description: "Employment terms and conditions",
      keyPoints: [
        {
          label: "Parties",
          value: common.parties,
        },
        {
          label: "Start Date",
          value: common.effectiveDate,
        },
        {
          label: "Compensation",
          value: data.keyElements.financial?.contractValue
            ? `${data.keyElements.financial.contractValue.amount} ${data.keyElements.financial.contractValue.currency}`
            : "Not specified",
        },
      ],
    },
    LICENSE_AGREEMENT: {
      title: "License Agreement",
      description: "Licensing terms and usage rights",
      keyPoints: [
        {
          label: "Licensor",
          value: data.keyElements.parties.companies[0] || "Not specified",
        },
        {
          label: "License Fee",
          value: data.keyElements.financial?.contractValue
            ? `${data.keyElements.financial.contractValue.amount} ${data.keyElements.financial.contractValue.currency}`
            : "Not specified",
        },
        {
          label: "Term",
          value: data.keyElements.dates.terminationDate
            ? `Until ${formatDate(data.keyElements.dates.terminationDate)}`
            : "Not specified",
        },
      ],
    },
    PURCHASE_ORDER: {
      title: "Purchase Order",
      description: "Order details and delivery terms",
      keyPoints: [
        {
          label: "Order Value",
          value: data.keyElements.financial?.contractValue
            ? `${data.keyElements.financial.contractValue.amount} ${data.keyElements.financial.contractValue.currency}`
            : "Not specified",
        },
        {
          label: "Payment Terms",
          value: data.keyElements.financial?.paymentTerms || "Not specified",
        },
        {
          label: "Delivery Date",
          value: data.keyElements.dates.terminationDate
            ? formatDate(data.keyElements.dates.terminationDate)
            : "Not specified",
        },
      ],
    },
  };

  return highlights[data.classification];
};

const ContractTypeDetails = ({ data }: { data: ContractData }) => {
  const contractInfo = getContractHighlights(data);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <ContractTypeIcon type={data.classification} />
          <div>
            <CardTitle>{contractInfo.title}</CardTitle>
            <CardDescription>{contractInfo.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {contractInfo.keyPoints.map((point, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {point.label}
              </h3>
              <p className="text-lg font-semibold">{point.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ContractAnalysisView: React.FC<ContractAnalysisViewProps> = ({
  data,
}) => {
  const hasHighRisks =
    data.riskAnalysis.unusualTerms.length > 0 ||
    data.riskAnalysis.nonStandardClauses.length > 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Contract Analysis</h1>
        <Badge
          variant={hasHighRisks ? "destructive" : "outline"}
          className="text-lg px-4 py-1"
        >
          {data.classification.replace("_", " ")}
        </Badge>
      </div>

      <ContractTypeDetails data={data} />

      <Tabs defaultValue="key-elements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="key-elements">Key Elements</TabsTrigger>
          <TabsTrigger value="risk-analysis">
            Risk Analysis
            {hasHighRisks && (
              <span className="ml-2 w-2 h-2 bg-destructive rounded-full"></span>
            )}
          </TabsTrigger>
        </TabsList>

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
                  {data.keyElements.parties.companies.map((company, idx) => (
                    <li key={idx} className="text-sm">
                      {company}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Signatories</h3>
                {data.keyElements.parties.signatories.map((signatory, idx) => (
                  <div key={idx} className="text-sm">
                    {signatory.name} - {signatory.title}
                  </div>
                ))}
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
                <p className="text-sm">
                  {formatDate(data.keyElements.dates.effectiveDate)}
                </p>
              </div>
              <div>
                <p className="font-semibold">Termination Date</p>
                <p className="text-sm">
                  {data.keyElements.dates.terminationDate &&
                    formatDate(data.keyElements.dates.terminationDate)}
                </p>
              </div>
              <div>
                <p className="font-semibold">Renewal Dates</p>
                <ul className="list-disc list-inside text-sm">
                  {data.keyElements.dates.renewalDates.map((date, idx) => (
                    <li key={idx}>{formatDate(date)}</li>
                  ))}
                </ul>
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
                <p className="text-sm">
                  {data.keyElements.governingLaw.jurisdiction}
                </p>
              </div>
              <div>
                <p className="font-semibold">Applicable Law</p>
                <p className="text-sm">
                  {data.keyElements.governingLaw.applicableLaw}
                </p>
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
                Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {data.riskAnalysis.nonStandardClauses.length > 0 && (
                    <div className="space-y-2">
                      <Alert variant="destructive">
                        <AlertTitle>Non-Standard Clauses Found</AlertTitle>
                        <AlertDescription>
                          The following clauses require special attention
                        </AlertDescription>
                      </Alert>
                      {data.riskAnalysis.nonStandardClauses.map(
                        (clause, idx) => (
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
                      <Alert>
                        <AlertTitle>Missing Clauses</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc list-inside mt-2">
                            {data.riskAnalysis.missingClauses.map(
                              (clause, idx) => (
                                <li key={idx}>{clause}</li>
                              )
                            )}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {data.riskAnalysis.unusualTerms.length > 0 && (
                    <div className="space-y-2">
                      <Alert variant="destructive">
                        <AlertTitle>Unusual Terms Detected</AlertTitle>
                        <AlertDescription>
                          The following terms require review
                        </AlertDescription>
                      </Alert>
                      {data.riskAnalysis.unusualTerms.map((term, idx) => (
                        <Alert key={idx}>
                          <AlertDescription>
                            <span className="font-semibold">{term.term}</span>
                            <p className="mt-1 text-sm">{term.concern}</p>
                          </AlertDescription>
                        </Alert>
                      ))}
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
