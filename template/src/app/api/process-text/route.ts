import { NextRequest, NextResponse } from "next/server";
import { parseContractJson } from "@/lib/contract-parser";

const { GoogleGenerativeAI } = require("@google/generative-ai");

export async function POST(request: NextRequest) {
  try {
    // Get the text from the request body
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: "No text provided in the request body" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `# Contract Analysis Instructions

You are an AI assistant specialized in contract analysis. Analyze the provided contract and extract the following key information:

## 1. Key Contract Elements

Extract and structure the following information:

### Parties and Signatories
- Company names
- Signatory names and titles

### Important Dates
- Effective date
- Termination date
- Renewal dates

### Financial Terms
- Contract value
- Payment terms and schedule

### Legal Obligations
- Key commitments for each party
- Core deliverables
- Critical requirements

### Governing Law
- Applicable law
- Jurisdiction
- Dispute resolution venue

## 2. Risk Analysis

### Non-Standard Elements
- Identify any non-standard clauses
- Flag unusual terms or conditions

### Missing Elements
- List any missing standard clauses
- Identify gaps in key provisions

### Risk Flags
- Highlight unusual terms that require attention

## 3. Contract Classification

Classify the contract as one of:
- Service Agreement
- NDA
- Employment Contract
- License Agreement
- Purchase Order

Present findings in a structured JSON format according to the provided schema specification. Only respond using JSON, either
using this format, or a message indicating an error occurred.

{
  "type": "object",
  "required": ["keyElements", "riskAnalysis", "classification"],
  "properties": {
    "keyElements": {
      "type": "object",
      "required": ["parties", "dates", "financial", "obligations", "governingLaw"],
      "properties": {
        "parties": {
          "type": "object",
          "properties": {
            "companies": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "signatories": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "title": { "type": "string" }
                }
              }
            }
          }
        },
        "dates": {
          "type": "object",
          "properties": {
            "effectiveDate": { "type": "string", "format": "date" },
            "terminationDate": { "type": "string", "format": "date" },
            "renewalDates": {
              "type": "array",
              "items": { "type": "string", "format": "date" }
            }
          }
        },
        "financial": {
          "type": "object",
          "properties": {
            "contractValue": {
              "type": "object",
              "properties": {
                "amount": { "type": "number" },
                "currency": { "type": "string" }
              }
            },
            "paymentTerms": { "type": "string" }
          }
        },
        "obligations": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "party": { "type": "string" },
              "commitment": { "type": "string" }
            }
          }
        },
        "governingLaw": {
          "type": "object",
          "properties": {
            "jurisdiction": { "type": "string" },
            "applicableLaw": { "type": "string" }
          }
        }
      }
    },
    "riskAnalysis": {
      "type": "object",
      "properties": {
        "nonStandardClauses": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "clause": { "type": "string" },
              "explanation": { "type": "string" }
            }
          }
        },
        "missingClauses": {
          "type": "array",
          "items": { "type": "string" }
        },
        "unusualTerms": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "term": { "type": "string" },
              "concern": { "type": "string" }
            }
          }
        }
      }
    },
    "classification": {
      "type": "string",
      "enum": [
        "SERVICE_AGREEMENT",
        "NDA",
        "EMPLOYMENT_CONTRACT",
        "LICENSE_AGREEMENT",
        "PURCHASE_ORDER",
        "OTHER"
      ]
    }
  }
}

CONTRACT TEXT TO ANALYZE:
${text}`;

    const result = await model.generateContent(prompt);

    console.log("Response:", result.response.text());

    const contractData = parseContractJson(result.response.text());

    console.log("Contract Data:", contractData);

    return NextResponse.json(contractData);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
