/**
 * Generic contract data interface that allows for flexible structure
 */
export interface ContractData {
  keyElements?: {
    parties?: {
      companies?: string[];
      signatories?: Array<{
        name: string;
        title: any;
      }>;
    };
    dates?: {
      effectiveDate?: any;
      terminationDate?: any;
      renewalDates?: any[];
    };
    financial?: {
      contractValue?: any;
      paymentTerms?: any;
    };
    obligations?: Array<{
      party: string;
      commitment: string;
    }>;
    governingLaw?: {
      jurisdiction?: string;
      applicableLaw?: string;
    };
  };
  riskAnalysis?: {
    nonStandardClauses?: Array<{
      clause: string;
      explanation: string;
    }>;
    missingClauses?: string[];
    unusualTerms?: Array<{
      term?: string;
      concern?: string;
    }>;
  };
  classification?: string;
  [key: string]: any; // Allows for additional properties
}

/**
 * Simple utility to clean markdown code blocks and parse JSON
 */
export const parseContractJson = (input: string): ContractData => {
  try {
    // Clean markdown syntax
    const cleanJson = input
      .replace(/```json\n/g, '')  // Remove opening markdown
      .replace(/\n```/g, '')      // Remove closing markdown
      .trim();                    // Remove extra whitespace
    
    // Parse JSON
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Error parsing contract JSON:', error);
    throw new Error('Failed to parse contract data: ' + (error as Error).message);
  }
};

/**
 * Helper functions to safely access potentially undefined data
 */
export const contractHelpers = {
  getObligations: (data: ContractData, party?: string) => {
    const obligations = data.keyElements?.obligations || [];
    return party 
      ? obligations.filter(o => o.party === party)
      : obligations;
  },

  getCompanies: (data: ContractData) => {
    return data.keyElements?.parties?.companies || [];
  },

  getMissingClauses: (data: ContractData) => {
    return data.riskAnalysis?.missingClauses || [];
  },

  getGoverningLaw: (data: ContractData) => {
    return data.keyElements?.governingLaw;
  },

  getClassification: (data: ContractData) => {
    return data.classification;
  }
};
